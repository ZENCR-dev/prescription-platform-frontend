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
    clientInstance.auth.onAuthStateChange(async (event, session) => {
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
 * @performance Cached for better performance in rapid succession calls
 * @security Validates claim structure and required fields
 */
let claimsCache: { claims: UserClaims | null; timestamp: number; userId?: string } | null = null
const CLAIMS_CACHE_TTL = 60000 // 1 minute cache

export async function getUserClaims(): Promise<UserClaims | null> {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.warn('Supabase auth error:', error.message)
      return null
    }
    
    if (!user) {
      // Clear cache when user is not authenticated
      claimsCache = null
      return null
    }
    
    // Performance: return cached claims if still valid for same user
    if (claimsCache && 
        claimsCache.userId === user.id && 
        Date.now() - claimsCache.timestamp < CLAIMS_CACHE_TTL) {
      return claimsCache.claims
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
    
    // Update cache
    claimsCache = {
      claims,
      timestamp: Date.now(),
      userId: user.id
    }
    
    return claims
  } catch (error) {
    console.error('Error fetching user claims:', error)
    // Clear potentially stale cache on errors
    claimsCache = null
    return null
  }
}

/**
 * Check if user has specific role
 * Convenience function for role-based access control
 * 
 * @param requiredRole - Role to check against
 * @returns boolean
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const claims = await getUserClaims()
  return claims?.role === requiredRole
}

/**
 * Check if user is verified professional
 * Used for accessing verified practitioner/pharmacy features
 * 
 * @returns boolean
 */
export async function isVerifiedProfessional(): Promise<boolean> {
  const claims = await getUserClaims()
  return claims?.verification_status === 'verified'
}

/**
 * Check if user has MFA enabled (AAL2)
 * Used for sensitive operations requiring MFA verification
 * 
 * @returns boolean
 */
export async function hasMFA(): Promise<boolean> {
  const claims = await getUserClaims()
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
 * 
 * @returns Promise<void>
 */
export async function signOut(): Promise<void> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
    
    // Clear any client-side session data
    // Supabase automatically handles cookie cleanup
  } catch (error) {
    console.error('Error signing out:', error)
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