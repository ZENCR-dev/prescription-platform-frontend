/**
 * Supabase Middleware Client - M1.2 Auth Client Integration
 * 
 * Frontend Lead Implementation: Dev-Step 1.3
 * Implements @supabase/ssr middleware client for Next.js edge runtime
 * Supports session validation, automatic refresh, and enhanced JWT claims
 * 
 * @architecture Supabase-First Edge Runtime Integration
 * @compliance APIv1.md v1.0.0-alpha, Zero-PII mandate, Next.js Edge Runtime
 * @dependencies @supabase/ssr v0.7.0, Next.js 14.2.15
 */

import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

// Reuse types from browser/server clients for consistency
export type { UserRole, UserClaims, AuthUser } from './client'

/**
 * Middleware route protection configuration
 * Defines which routes require authentication and specific permissions
 */
export interface MiddlewareRouteConfig {
  // Protected routes that require authentication
  protectedRoutes: string[]
  // Public routes accessible without authentication
  publicRoutes: string[]
  // Admin routes requiring admin role
  adminRoutes: string[]
  // Professional routes requiring tcm_practitioner role
  professionalRoutes: string[]
  // Pharmacy routes requiring pharmacy role (Dev-Step 2.2 Addition)
  pharmacyRoutes?: string[]
  // Verification required routes
  verificationRequiredRoutes: string[]
  // MFA required routes
  mfaRequiredRoutes: string[]
}

/**
 * Default route configuration for medical prescription platform
 * Aligned with business requirements and enhanced JWT claims
 */
export const defaultRouteConfig: MiddlewareRouteConfig = {
  protectedRoutes: [
    '/dashboard',
    '/profile',
    '/prescriptions',
    '/patients',
    '/inventory',
    '/reports'
  ],
  publicRoutes: [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/about',
    '/contact',
    '/privacy',
    '/terms'
  ],
  adminRoutes: [
    '/admin',
    '/admin/users',
    '/admin/verification',
    '/admin/settings',
    '/admin/reports'
  ],
  professionalRoutes: [
    '/prescriptions/create',
    '/prescriptions/manage',
    '/patients/manage',
    '/professional/dashboard'
  ],
  verificationRequiredRoutes: [
    '/prescriptions/create',
    '/patients/manage',
    '/professional/license'
  ],
  mfaRequiredRoutes: [
    '/admin',
    '/prescriptions/controlled',
    '/patients/sensitive'
  ]
}

/**
 * Create middleware-specific Supabase client optimized for edge runtime
 * Uses Next.js Request/Response cookie handling for session management
 * 
 * @param request NextRequest object from middleware
 * @param response NextResponse object from middleware
 * @returns Supabase client configured for middleware
 * @performance Edge runtime optimized with minimal overhead
 * @security Validates environment variables and handles cookies securely
 */
export function createMiddlewareSupabaseClient(
  request: NextRequest, 
  response: NextResponse
) {
  // Security: validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase environment variables for middleware. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      /**
       * Get all cookies from the incoming request
       * Edge runtime compatible cookie reading
       * 
       * @returns Array of cookie objects with name and value
       */
      getAll() {
        try {
          return request.cookies.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value
          }))
        } catch (error) {
          console.warn('Failed to read cookies in middleware:', error)
          return []
        }
      },

      /**
       * Set cookies on the outgoing response
       * Handles session updates and chunked cookies for large data
       * Edge runtime compatible cookie setting
       * 
       * @param cookiesToSet Array of cookies to set with options
       */
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options = {} }) => {
            // Configure cookie options for middleware context
            const cookieOptions: CookieOptions = {
              httpOnly: options.httpOnly !== false, // Default to true for security
              secure: process.env.NODE_ENV === 'production', // HTTPS in production
              sameSite: options.sameSite || 'lax', // CSRF protection
              maxAge: options.maxAge || (value ? 7 * 24 * 60 * 60 : 0), // 7 days or clear
              path: options.path || '/', // Site-wide access
              ...options
            }

            if (value) {
              response.cookies.set(name, value, cookieOptions)
            } else {
              // Clear cookie by setting empty value and maxAge: 0
              response.cookies.set(name, '', { ...cookieOptions, maxAge: 0 })
            }
          })
        } catch (error) {
          console.error('Failed to set cookies in middleware:', error)
          // In middleware context, cookie setting failures should not break the application
        }
      }
    }
  })
}

/**
 * Get middleware user claims from session
 * Edge runtime optimized version of getUserClaims for middleware
 * 
 * @param request NextRequest object from middleware
 * @param response NextResponse object from middleware  
 * @returns Promise<UserClaims | null>
 * @usage Middleware for route protection and role-based access
 * @security Validates claim structure and enhanced JWT claims
 */
export async function getMiddlewareUserClaims(
  request: NextRequest,
  response: NextResponse
): Promise<import('./client').UserClaims | null> {
  const supabase = createMiddlewareSupabaseClient(request, response)
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.warn('Middleware Supabase auth error:', error.message)
      return null
    }
    
    if (!user) {
      return null
    }
    
    // Security: validate required metadata exists
    const metadata = user.user_metadata
    if (!metadata || !metadata.role) {
      console.warn('Middleware user metadata missing or incomplete:', { userId: user.id, hasMetadata: !!metadata })
      return null
    }
    
    // Validate role is one of the allowed values
    const validRoles: import('./client').UserRole[] = ['tcm_practitioner', 'pharmacy', 'admin']
    if (!validRoles.includes(metadata.role)) {
      console.error('Invalid user role detected in middleware:', metadata.role)
      return null
    }
    
    // Extract enhanced claims from user_metadata per APIv1.md specification
    const claims: import('./client').UserClaims = {
      role: metadata.role as import('./client').UserRole,
      license_number: metadata.license_number || '',
      business_name: metadata.business_name || '',
      verification_status: metadata.verification_status || 'pending',
      aal: metadata.aal || 'aal1', // Default to basic auth level
      
      // Enhanced JWT Claims from Global Architect directive
      profile_status: metadata.profile_status || 'incomplete',
      business_info: metadata.business_info || null
    }
    
    return claims
  } catch (error) {
    console.error('Error fetching middleware user claims:', error)
    return null
  }
}

/**
 * Session refresh result for middleware operations
 * Enhanced return type for better error handling and redirect logic
 */
export interface SessionRefreshResult {
  refreshed: boolean
  shouldRedirect: boolean
  redirectUrl?: string
  error?: string
}

/**
 * Refresh lock to prevent concurrent session refreshes
 * Uses in-memory lock for edge runtime compatibility
 */
let refreshLock = false
let lastRefreshTime = 0

/**
 * Enhanced session refresh in middleware with comprehensive error handling
 * Handles automatic session refresh for expired or expiring sessions
 * 
 * Dev-Step 2.3 Enhancement: Added refresh lock, better error handling, and graceful logout
 * 
 * @param request NextRequest object from middleware
 * @param response NextResponse object from middleware
 * @returns Promise<SessionRefreshResult> - Detailed refresh result with redirect info
 * @usage Middleware automatic session management with failure handling
 * @performance Edge runtime optimized with refresh lock to prevent duplicates
 */
export async function refreshMiddlewareSession(
  request: NextRequest,
  response: NextResponse
): Promise<SessionRefreshResult> {
  const result: SessionRefreshResult = {
    refreshed: false,
    shouldRedirect: false
  }

  // Prevent concurrent refreshes (edge runtime safe)
  const now = Date.now()
  if (refreshLock && (now - lastRefreshTime) < 10000) { // 10 second lock
    console.log('Session refresh already in progress, skipping...')
    return result
  }

  const supabase = createMiddlewareSupabaseClient(request, response)
  
  try {
    refreshLock = true
    lastRefreshTime = now

    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.warn('Middleware session check error:', error.message)
      result.error = error.message
      return result
    }
    
    if (!session) {
      // No session exists, no refresh needed
      return result
    }
    
    // Check if session is close to expiring (within 5 minutes)
    const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null
    const currentTime = new Date()
    const fiveMinutes = 5 * 60 * 1000 // 5 minutes in milliseconds
    const oneMinute = 60 * 1000 // 1 minute for critical refresh
    
    if (!expiresAt) {
      console.warn('Session has no expiration time, considering invalid')
      result.shouldRedirect = true
      result.redirectUrl = `/auth/login?reason=invalid_session&return=${encodeURIComponent(request.nextUrl.pathname)}`
      return result
    }

    const timeUntilExpiry = expiresAt.getTime() - currentTime.getTime()
    
    // Session already expired
    if (timeUntilExpiry <= 0) {
      console.log('Session already expired, redirecting to login')
      result.shouldRedirect = true
      result.redirectUrl = `/auth/login?reason=expired&return=${encodeURIComponent(request.nextUrl.pathname)}`
      return result
    }
    
    // Session needs refresh (within 5 minutes of expiry)
    if (timeUntilExpiry < fiveMinutes) {
      const isCritical = timeUntilExpiry < oneMinute
      console.log(`${isCritical ? 'CRITICAL: ' : ''}Refreshing session (expires in ${Math.floor(timeUntilExpiry / 1000)}s)`)
      
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
      
      if (refreshError) {
        console.error('Session refresh failed:', refreshError.message)
        result.error = refreshError.message
        
        // On refresh failure, redirect to login with return URL
        result.shouldRedirect = true
        result.redirectUrl = `/auth/login?reason=refresh_failed&return=${encodeURIComponent(request.nextUrl.pathname)}`
        
        // Clear invalid session cookies
        try {
          await supabase.auth.signOut()
        } catch (signOutError) {
          console.error('Failed to sign out after refresh failure:', signOutError)
        }
        
        return result
      }
      
      if (refreshData.session) {
        const newExpiry = refreshData.session.expires_at 
          ? new Date(refreshData.session.expires_at * 1000).toISOString() 
          : 'unknown'
        console.log(`Session refreshed successfully (new expiry: ${newExpiry})`)
        result.refreshed = true
        
        // Set refresh success header for monitoring
        if (process.env.NODE_ENV === 'development') {
          response.headers.set('X-Session-Refreshed', 'true')
          response.headers.set('X-Session-Expiry', newExpiry)
        }
      } else {
        console.warn('Refresh returned no session, redirecting to login')
        result.shouldRedirect = true
        result.redirectUrl = `/auth/login?reason=no_session&return=${encodeURIComponent(request.nextUrl.pathname)}`
      }
    }
    
    return result
  } catch (error) {
    console.error('Unexpected error during session refresh:', error)
    result.error = error instanceof Error ? error.message : 'Unknown error'
    result.shouldRedirect = true
    result.redirectUrl = `/auth/login?reason=error&return=${encodeURIComponent(request.nextUrl.pathname)}`
    return result
  } finally {
    refreshLock = false
  }
}

/**
 * Check if middleware user has specific role
 * Edge runtime version of hasRole for middleware route protection
 * 
 * @param request NextRequest object from middleware
 * @param response NextResponse object from middleware
 * @param requiredRole Role to check against
 * @returns Promise<boolean>
 * @usage Middleware role-based route protection
 */
export async function middlewareHasRole(
  request: NextRequest,
  response: NextResponse,
  requiredRole: import('./client').UserRole
): Promise<boolean> {
  const claims = await getMiddlewareUserClaims(request, response)
  return claims?.role === requiredRole
}

/**
 * Check if middleware user is verified professional
 * Edge runtime version for professional verification checks
 * 
 * @param request NextRequest object from middleware
 * @param response NextResponse object from middleware
 * @returns Promise<boolean>
 * @usage Middleware professional route protection
 */
export async function middlewareIsVerifiedProfessional(
  request: NextRequest,
  response: NextResponse
): Promise<boolean> {
  const claims = await getMiddlewareUserClaims(request, response)
  return claims?.verification_status === 'verified'
}

/**
 * Check if middleware user has MFA enabled
 * Edge runtime version for MFA requirement checks
 * 
 * @param request NextRequest object from middleware
 * @param response NextResponse object from middleware
 * @returns Promise<boolean>
 * @usage Middleware MFA-required route protection
 */
export async function middlewareHasMFA(
  request: NextRequest,
  response: NextResponse
): Promise<boolean> {
  const claims = await getMiddlewareUserClaims(request, response)
  return claims?.aal === 'aal2'
}

/**
 * Comprehensive middleware route protection
 * Main function for implementing route-based access control in middleware
 * 
 * @param request NextRequest object from middleware
 * @param response NextResponse object from middleware
 * @param routeConfig Route configuration for protection rules
 * @returns Promise<NextResponse> - Modified response with redirects if needed
 * @usage Main middleware function for route protection
 * @security Implements comprehensive access control with enhanced JWT claims
 */
export async function protectMiddlewareRoute(
  request: NextRequest,
  response: NextResponse,
  routeConfig: MiddlewareRouteConfig = defaultRouteConfig
): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  
  // Check if route is public (no protection needed)
  const isPublicRoute = routeConfig.publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isPublicRoute) {
    // Allow session refresh on public routes but don't require auth
    const refreshResult = await refreshMiddlewareSession(request, response)
    
    // Even on public routes, redirect if session refresh critically failed
    if (refreshResult.shouldRedirect && refreshResult.redirectUrl) {
      console.log(`Redirecting from public route due to session issue: ${refreshResult.error}`)
      return NextResponse.redirect(new URL(refreshResult.redirectUrl, request.url))
    }
    
    return response
  }
  
  // Get user claims for authentication and authorization checks
  const userClaims = await getMiddlewareUserClaims(request, response)
  
  // Check if user is authenticated
  if (!userClaims) {
    console.log(`Middleware: Unauthenticated access attempt to ${pathname}`)
    // Preserve return URL for after login
    const returnUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/auth/login?return=${returnUrl}`, request.url))
  }
  
  // Enhanced session refresh for authenticated users (Dev-Step 2.3)
  const refreshResult = await refreshMiddlewareSession(request, response)
  
  // Handle refresh failures with graceful redirect
  if (refreshResult.shouldRedirect && refreshResult.redirectUrl) {
    console.log(`Session refresh required redirect: ${refreshResult.error || 'Session invalid'}`)
    return NextResponse.redirect(new URL(refreshResult.redirectUrl, request.url))
  }
  
  // Log successful refresh in development
  if (refreshResult.refreshed && process.env.NODE_ENV === 'development') {
    console.log(`Session refreshed for user ${userClaims.role} on ${pathname}`)
  }
  
  // Check admin routes
  const isAdminRoute = routeConfig.adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isAdminRoute && userClaims.role !== 'admin') {
    console.log(`Middleware: Non-admin access attempt to ${pathname} by role: ${userClaims.role}`)
    return NextResponse.redirect(new URL('/403', request.url))
  }
  
  // Check professional routes
  const isProfessionalRoute = routeConfig.professionalRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isProfessionalRoute && userClaims.role !== 'tcm_practitioner') {
    console.log(`Middleware: Non-professional access attempt to ${pathname} by role: ${userClaims.role}`)
    return NextResponse.redirect(new URL('/403', request.url))
  }
  
  // Check pharmacy routes (Dev-Step 2.2 Addition)
  const isPharmacyRoute = (routeConfig.pharmacyRoutes || []).some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isPharmacyRoute && userClaims.role !== 'pharmacy') {
    console.log(`Middleware: Non-pharmacy access attempt to ${pathname} by role: ${userClaims.role}`)
    return NextResponse.redirect(new URL('/403', request.url))
  }
  
  // Check verification required routes
  const isVerificationRequired = routeConfig.verificationRequiredRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isVerificationRequired && userClaims.verification_status !== 'verified') {
    console.log(`Middleware: Unverified access attempt to ${pathname}, status: ${userClaims.verification_status}`)
    return NextResponse.redirect(new URL('/profile/verification', request.url))
  }
  
  // Check MFA required routes
  const isMFARequired = routeConfig.mfaRequiredRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isMFARequired && userClaims.aal !== 'aal2') {
    console.log(`Middleware: MFA required for ${pathname}, current AAL: ${userClaims.aal}`)
    return NextResponse.redirect(new URL('/auth/mfa/setup', request.url))
  }
  
  // Enhanced JWT Claims validation (profile_status check)
  if (userClaims.profile_status === 'incomplete' && !pathname.startsWith('/profile/')) {
    console.log(`Middleware: Incomplete profile access attempt to ${pathname}`)
    return NextResponse.redirect(new URL('/profile/complete', request.url))
  }
  
  // All checks passed - allow access to protected route
  return response
}

/**
 * Create Next.js middleware function with Supabase session management
 * Factory function to create middleware with route protection
 * 
 * @param routeConfig Optional route configuration, uses default if not provided
 * @returns Middleware function compatible with Next.js middleware.ts
 * @usage Export from middleware.ts for automatic Next.js integration
 * @example
 * ```typescript
 * // middleware.ts
 * export { createSupabaseMiddleware as default } from './lib/supabase/middleware'
 * ```
 */
export function createSupabaseMiddleware(routeConfig?: MiddlewareRouteConfig) {
  return async function middleware(request: NextRequest) {
    // Create response object
    let response = NextResponse.next()
    
    try {
      // Apply route protection with session management
      response = await protectMiddlewareRoute(request, response, routeConfig)
      
      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      
      // Add custom headers for debugging in development
      if (process.env.NODE_ENV === 'development') {
        const userClaims = await getMiddlewareUserClaims(request, response)
        if (userClaims) {
          response.headers.set('X-User-Role', userClaims.role)
          response.headers.set('X-User-Verification', userClaims.verification_status || 'unknown')
          response.headers.set('X-User-AAL', userClaims.aal || 'aal1')
        }
      }
      
      return response
    } catch (error) {
      console.error('Middleware error:', error)
      // On middleware errors, continue without protection (fail open for availability)
      return response
    }
  }
}

/**
 * Default middleware configuration matcher
 * Excludes API routes, static files, and internal Next.js paths
 */
export const middlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, sitemap.xml, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}

// Export default middleware for easy Next.js integration
export default createSupabaseMiddleware()