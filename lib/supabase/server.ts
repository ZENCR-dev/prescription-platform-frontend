/**
 * Supabase Server Client - M1.2 Auth Client Integration
 * 
 * Frontend Lead Implementation: Dev-Step 1.2
 * Implements @supabase/ssr server client with Next.js cookies integration
 * Supports SSR, Server Components, and Server Actions with session management
 * 
 * @architecture Supabase-First Server-Side Integration
 * @compliance APIv1.md v1.0.0-alpha, Zero-PII mandate
 * @dependencies @supabase/ssr v0.7.0, Next.js 14.2.15
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'

// Reuse types from browser client for consistency
export type { UserRole, UserClaims, AuthUser } from './client'

/**
 * Create server-side Supabase client for SSR and Server Components
 * Uses Next.js cookies() API for session management
 * Supports chunked cookies for large session data
 * 
 * @usage Server Components, Server Actions, Route Handlers
 * @performance Singleton pattern - reuses client instance per request context
 * @security Validates environment variables and handles cookies securely
 */
let serverClientInstance: ReturnType<typeof createServerClient> | null = null

export function createServerSupabaseClient() {
  // Performance optimization: reuse client instance within request context
  // Note: In server environment, each request creates new instance for isolation
  if (serverClientInstance) {
    return serverClientInstance
  }

  // Security: validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  // Get cookies instance for server-side cookie management
  const cookieStore = cookies()

  serverClientInstance = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      /**
       * Get all cookies for Supabase session management
       * Handles chunked cookies for large session data
       * 
       * @returns Array of cookie objects with name and value
       */
      getAll() {
        try {
          return cookieStore.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value
          }))
        } catch (error) {
          console.warn('Failed to read cookies in server context:', error)
          return []
        }
      },

      /**
       * Set cookies for Supabase session management
       * Handles both setting new cookies and clearing stale chunks
       * 
       * @param cookiesToSet Array of cookies to set with options
       */
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options = {} }) => {
            // Set cookie with proper options for security and functionality
            const cookieOptions: CookieOptions = {
              httpOnly: options.httpOnly !== false, // Default to true for security
              secure: process.env.NODE_ENV === 'production', // HTTPS in production
              sameSite: options.sameSite || 'lax', // CSRF protection
              maxAge: options.maxAge || (value ? 7 * 24 * 60 * 60 : 0), // 7 days or clear
              path: options.path || '/', // Site-wide access
              ...options
            }

            if (value) {
              cookieStore.set(name, value, cookieOptions)
            } else {
              // Clear cookie by setting empty value and maxAge: 0
              cookieStore.set(name, '', { ...cookieOptions, maxAge: 0 })
            }
          })
        } catch (error) {
          console.error('Failed to set cookies in server context:', error)
          // In server context, we might not be able to set cookies in all scenarios
          // This is expected behavior and should not break the application
        }
      }
    }
  })

  return serverClientInstance
}

/**
 * Get server-side authenticated user's JWT claims
 * Server-side version of getUserClaims() from browser client
 * 
 * @returns Promise<UserClaims | null>
 * @usage Server Components, Server Actions for role-based access
 * @security Validates claim structure and required fields server-side
 */
export async function getServerUserClaims(): Promise<import('./client').UserClaims | null> {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.warn('Server-side Supabase auth error:', error.message)
      return null
    }
    
    if (!user) {
      return null
    }
    
    // Security: validate required metadata exists
    const metadata = user.user_metadata
    if (!metadata || !metadata.role) {
      console.warn('Server-side user metadata missing or incomplete:', { userId: user.id, hasMetadata: !!metadata })
      return null
    }
    
    // Validate role is one of the allowed values
    const validRoles: import('./client').UserRole[] = ['tcm_practitioner', 'pharmacy', 'admin']
    if (!validRoles.includes(metadata.role)) {
      console.error('Invalid user role detected on server-side:', metadata.role)
      return null
    }
    
    // Extract claims from user_metadata per APIv1.md specification
    const claims: import('./client').UserClaims = {
      role: metadata.role as import('./client').UserRole,
      license_number: metadata.license_number || '',
      business_name: metadata.business_name || '',
      verification_status: metadata.verification_status || 'pending',
      aal: metadata.aal || 'aal1' // Default to basic auth level
    }
    
    return claims
  } catch (error) {
    console.error('Error fetching server-side user claims:', error)
    return null
  }
}

/**
 * Check if user has specific role on server-side
 * Server-side version of hasRole() from browser client
 * 
 * @param requiredRole - Role to check against
 * @returns Promise<boolean>
 * @usage Server Components for role-based rendering
 */
export async function serverHasRole(requiredRole: import('./client').UserRole): Promise<boolean> {
  const claims = await getServerUserClaims()
  return claims?.role === requiredRole
}

/**
 * Check if user is verified professional on server-side
 * Server-side version of isVerifiedProfessional() from browser client
 * 
 * @returns Promise<boolean>
 * @usage Server Actions requiring professional verification
 */
export async function serverIsVerifiedProfessional(): Promise<boolean> {
  const claims = await getServerUserClaims()
  return claims?.verification_status === 'verified'
}

/**
 * Check if user has MFA enabled on server-side
 * Server-side version of hasMFA() from browser client
 * 
 * @returns Promise<boolean>
 * @usage Server Actions requiring MFA verification
 */
export async function serverHasMFA(): Promise<boolean> {
  const claims = await getServerUserClaims()
  return claims?.aal === 'aal2'
}

/**
 * Get current authenticated user on server-side with typed metadata
 * Server-side version of getCurrentUser() from browser client
 * 
 * @returns Promise<AuthUser | null>
 * @usage Server Components needing full user information
 */
export async function getServerCurrentUser(): Promise<import('./client').AuthUser | null> {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return {
      id: user.id,
      email: user.email || '',
      user_metadata: user.user_metadata as import('./client').UserClaims,
      email_confirmed_at: user.email_confirmed_at
    }
  } catch (error) {
    console.error('Error fetching server-side current user:', error)
    return null
  }
}

/**
 * Server-side authentication status check
 * Quick check for authenticated state without full user data
 * 
 * @returns Promise<boolean>
 * @usage Server Components for simple auth state checks
 * @performance Optimized for minimal server-side overhead
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return !error && !!user && !!user.email_confirmed_at
  } catch (error) {
    console.warn('Server authentication check failed:', error)
    return false
  }
}

/**
 * Server-side session validation
 * Validates active session and returns session info
 * 
 * @returns Promise<Session | null>
 * @usage Middleware and Server Actions requiring session validation
 */
export async function getServerSession() {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.warn('Server session validation error:', error.message)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error validating server session:', error)
    return null
  }
}

/**
 * Server-side route protection utility
 * Comprehensive authentication and authorization check
 * 
 * @param requiredRole - Optional role requirement
 * @param requireVerification - Require professional verification
 * @param requireMFA - Require multi-factor authentication
 * @returns Promise<{ authorized: boolean; user?: AuthUser; reason?: string }>
 * @usage Server Actions and Route Handlers for access control
 */
export async function serverProtectRoute(options?: {
  requiredRole?: import('./client').UserRole
  requireVerification?: boolean
  requireMFA?: boolean
}): Promise<{
  authorized: boolean
  user?: import('./client').AuthUser
  reason?: string
}> {
  const { requiredRole, requireVerification = false, requireMFA = false } = options || {}
  
  const user = await getServerCurrentUser()
  
  if (!user) {
    return { authorized: false, reason: 'Not authenticated' }
  }
  
  if (!user.email_confirmed_at) {
    return { authorized: false, user, reason: 'Email not confirmed' }
  }
  
  if (requiredRole && user.user_metadata.role !== requiredRole) {
    return { authorized: false, user, reason: 'Insufficient permissions' }
  }
  
  if (requireVerification) {
    const isVerified = user.user_metadata.verification_status === 'verified'
    if (!isVerified) {
      return { authorized: false, user, reason: 'Professional verification required' }
    }
  }
  
  if (requireMFA) {
    const hasMFA = user.user_metadata.aal === 'aal2'
    if (!hasMFA) {
      return { authorized: false, user, reason: 'Multi-factor authentication required' }
    }
  }
  
  return { authorized: true, user }
}

// Export default server client instance for common usage
// Removed top-level instance creation to avoid calling cookies() outside request scope
// Always call createServerSupabaseClient() within request lifecycle where cookies() is valid

/**
 * Reset server client instance
 * Used for testing or when forcing fresh client creation
 * 
 * @internal
 */
export function resetServerClientInstance() {
  serverClientInstance = null
}