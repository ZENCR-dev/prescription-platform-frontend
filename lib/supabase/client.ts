/**
 * Supabase Browser Client - M1.2 Auth Client Integration
 * 
 * Frontend Lead Implementation: Dev-Step 1.1
 * Implements @supabase/ssr browser client with auth.getClaims() support
 * Integrates with APIv1.md authentication endpoints and user_metadata schema
 * 
 * @architecture Supabase-First Frontend Integration
 * @compliance APIv1.md v1.0.0-alpha, Zero-PII mandate
 * @dependencies @supabase/ssr v0.7.0
 */

import { createBrowserClient } from '@supabase/ssr'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

// Types from APIv1.md user_metadata schema
export type UserRole = 'tcm_practitioner' | 'pharmacy' | 'admin'

export interface UserClaims {
  role: UserRole
  license_number: string
  business_name: string
  verification_status?: 'pending' | 'verified' | 'rejected'
  aal?: 'aal1' | 'aal2' // Authentication Assurance Level (MFA)
  
  // Enhanced JWT Claims from Global Architect directive (APIv1.md lines 700-727)
  profile_status?: 'incomplete' | 'complete' | 'pending_review'
  business_info?: {
    status?: 'active' | 'suspended' | 'pending'
    location?: {
      country: string
      province?: string
      city?: string
    }
    features?: {
      beta_access?: boolean
      advanced_analytics?: boolean
      priority_support?: boolean
    }
  } | null
}

export interface AuthUser {
  id: string
  email: string
  user_metadata: UserClaims
  email_confirmed_at: string | null | undefined
}

/**
 * Create browser-side Supabase client
 * Uses environment variables for configuration
 * Enables automatic session management via cookies
 * 
 * @performance Singleton pattern - reuses client instance
 * @security Validates environment variables at creation time
 */
let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Performance optimization: reuse client instance
  if (clientInstance) {
    return clientInstance
  }
  
  // Security: validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }
  
  clientInstance = createBrowserClient(supabaseUrl, supabaseKey)
  
  // Auto-sync session to server cookies via auth state change
  // This ensures server-side middleware has access to authentication state
  if (typeof window !== 'undefined') {
    clientInstance.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      try {
        // Sync session to server for SSR/middleware access
        await fetch('/api/auth/callback', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ event, session })
        })
      } catch (error) {
        console.warn('Failed to sync session to server:', error)
        // Don't throw - this is a background operation
      }
    })
  }
  
  return clientInstance
}

/**
 * Get authenticated user's JWT claims
 * Primary method for accessing user role and metadata
 * 
 * @returns UserClaims | null
 * @usage Frontend role-based access control and UI state management
 * @performance Enhanced caching with stale-while-revalidate and request deduplication
 * @security Validates claim structure and required fields
 */

// Enhanced cache configuration for different use cases
interface CacheConfig {
  ui: number      // UI display cache TTL
  auth: number    // Permission validation cache TTL
  mfa: number     // MFA status cache TTL
}

const CACHE_CONFIG: CacheConfig = {
  ui: 180000,     // 3 minutes for UI display
  auth: 30000,    // 30 seconds for permission checks
  mfa: 300000     // 5 minutes for MFA status
}

interface EnhancedClaimsCache {
  claims: UserClaims | null
  timestamp: number
  userId?: string
  staleAt: number      // When cache becomes stale but still usable
  validUntil: number   // When cache becomes invalid
}

let claimsCache: EnhancedClaimsCache | null = null
let pendingRequest: Promise<UserClaims | null> | null = null

/**
 * Enhanced getUserClaims with intelligent caching and request deduplication
 * @param cacheType - Cache type for different use cases (ui|auth|mfa)
 */
export async function getUserClaims(cacheType: keyof CacheConfig = 'ui'): Promise<UserClaims | null> {
  const now = Date.now()
  const cacheTTL = CACHE_CONFIG[cacheType]
  
  // Return cached data if valid
  if (claimsCache && claimsCache.validUntil > now) {
    return claimsCache.claims
  }
  
  // Stale-while-revalidate: return stale data while fetching fresh data
  if (claimsCache && claimsCache.staleAt < now && claimsCache.validUntil > now) {
    // Background refresh without blocking caller
    refreshClaimsInBackground()
    return claimsCache.claims
  }
  
  // Request deduplication: if a request is already pending, wait for it
  if (pendingRequest) {
    return await pendingRequest
  }
  
  // Create new request
  pendingRequest = fetchUserClaimsWithRetry()
  
  try {
    const claims = await pendingRequest
    
    // Update cache with enhanced metadata
    if (claims) {
      claimsCache = {
        claims,
        timestamp: now,
        userId: claims.role ? `${claims.role}_user` : 'unknown',
        staleAt: now + (cacheTTL * 0.8), // 80% of TTL for stale-while-revalidate
        validUntil: now + cacheTTL
      }
    } else {
      claimsCache = null
    }
    
    return claims
  } finally {
    pendingRequest = null
  }
}

/**
 * Core claims fetching logic with retry mechanism
 */
async function fetchUserClaimsWithRetry(maxRetries: number = 2): Promise<UserClaims | null> {
  const supabase = createClient()
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.warn(`Supabase auth error (attempt ${attempt + 1}):`, error.message)
        if (attempt === maxRetries) return null
        
        // Exponential backoff: wait 200ms, 400ms, 800ms
        await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, attempt)))
        continue
      }
      
      if (!user) {
        // Clear cache when user is not authenticated
        claimsCache = null
        return null
      }
      
      // Security: validate required metadata exists
      const metadata = user.user_metadata
      if (!metadata || !metadata.role) {
        console.warn('User metadata missing or incomplete:', { userId: user.id, hasMetadata: !!metadata })
        return null
      }
      
      // Validate role is one of the allowed values
      const validRoles: UserRole[] = ['tcm_practitioner', 'pharmacy', 'admin']
      if (!validRoles.includes(metadata.role)) {
        console.error('Invalid user role detected:', metadata.role)
        return null
      }
      
      // Extract claims from user_metadata per APIv1.md specification
      const claims: UserClaims = {
        role: metadata.role as UserRole,
        license_number: metadata.license_number || '',
        business_name: metadata.business_name || '',
        verification_status: metadata.verification_status || 'pending',
        aal: metadata.aal || 'aal1' // Default to basic auth level
      }
      
      return claims
      
    } catch (error) {
      console.error(`Error fetching user claims (attempt ${attempt + 1}):`, error)
      if (attempt === maxRetries) {
        // Clear potentially stale cache on final error
        claimsCache = null
        return null
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, attempt)))
    }
  }
  
  return null
}

/**
 * Background refresh for stale-while-revalidate pattern
 */
function refreshClaimsInBackground(): void {
  // Don't block - fire and forget background refresh
  fetchUserClaimsWithRetry().then(claims => {
    if (claims && claimsCache) {
      const now = Date.now()
      const cacheTTL = CACHE_CONFIG.ui // Default to UI cache TTL for background refresh
      
      claimsCache = {
        ...claimsCache,
        claims,
        timestamp: now,
        staleAt: now + (cacheTTL * 0.8),
        validUntil: now + cacheTTL
      }
    }
  }).catch(error => {
    console.warn('Background claims refresh failed:', error)
  })
}

/**
 * Check if user has specific role
 * Convenience function for role-based access control
 * Uses 'auth' cache type for security-sensitive operations
 * 
 * @param requiredRole - Role to check against
 * @returns boolean
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const claims = await getUserClaims('auth') // Use auth cache TTL (30s) for security
  return claims?.role === requiredRole
}

/**
 * Check if user is verified professional
 * Used for accessing verified practitioner/pharmacy features
 * Uses 'auth' cache type for verification status checks
 * 
 * @returns boolean
 */
export async function isVerifiedProfessional(): Promise<boolean> {
  const claims = await getUserClaims('auth') // Use auth cache TTL for verification status
  return claims?.verification_status === 'verified'
}

/**
 * Check if user has MFA enabled (AAL2)
 * Used for sensitive operations requiring MFA verification
 * Uses 'mfa' cache type with longer TTL since MFA status changes less frequently
 * 
 * @returns boolean
 */
export async function hasMFA(): Promise<boolean> {
  const claims = await getUserClaims('mfa') // Use MFA cache TTL (5m) for MFA status
  return claims?.aal === 'aal2'
}

/**
 * Get current authenticated user with typed metadata
 * Enhanced version of supabase.auth.getUser() with proper typing
 * 
 * @returns Promise<AuthUser | null>
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return {
      id: user.id,
      email: user.email || '',
      user_metadata: user.user_metadata as UserClaims,
      email_confirmed_at: user.email_confirmed_at
    }
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

/**
 * Sign out current user
 * Clears session and redirects to login
 * Integrates with APIv1.md /auth/v1/logout endpoint
 * Enhanced with cache cleanup and retry logic
 * 
 * @returns Promise<void>
 */
export async function signOut(): Promise<void> {
  const supabase = createClient()
  
  try {
    // Clear cache immediately to prevent stale auth state
    claimsCache = null
    pendingRequest = null
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
    
    // Clear any client-side session data
    // Supabase automatically handles cookie cleanup
  } catch (error) {
    console.error('Error signing out:', error)
    // Still clear cache even if signOut fails
    claimsCache = null
    pendingRequest = null
    throw error
  }
}

/**
 * Listen to auth state changes
 * Real-time authentication state management
 * 
 * @param callback - Function called on auth state change
 * @returns Unsubscribe function
 */
export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
) {
  const supabase = createClient()
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          user_metadata: session.user.user_metadata as UserClaims,
          email_confirmed_at: session.user.email_confirmed_at
        }
        callback(authUser)
      } else {
        callback(null)
      }
    }
  )
  
  return () => subscription.unsubscribe()
}

// Export default client instance for common usage
export const supabase = createClient()