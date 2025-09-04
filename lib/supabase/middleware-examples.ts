/**
 * Supabase Middleware Usage Examples - M1.2 Auth Client Integration
 * 
 * Frontend Lead Implementation: Dev-Step 1.3 Examples
 * Demonstrates middleware client usage patterns for different scenarios
 * Includes route protection, custom configurations, and integration patterns
 * 
 * @usage Reference examples for middleware.ts implementation
 * @compliance Next.js Edge Runtime, APIv1.md enhanced JWT claims
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  protectMiddlewareRoute,
  getMiddlewareUserClaims,
  middlewareHasRole,
  middlewareIsVerifiedProfessional,
  middlewareHasMFA,
  type MiddlewareRouteConfig
} from './middleware'

// Example 1: Basic middleware with default configuration
// Use this in your middleware.ts file for standard protection
export function basicMiddlewareExample() {
  // middleware.ts
  /*
  export { default } from './lib/supabase/middleware'
  
  export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
    ],
  }
  */
}

// Example 2: Custom route configuration for different business needs
export const customRouteConfig: MiddlewareRouteConfig = {
  protectedRoutes: [
    '/dashboard',
    '/profile',
    '/prescriptions',
    '/patients',
    '/inventory',
    '/reports',
    '/settings'
  ],
  publicRoutes: [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/callback',
    '/about',
    '/contact',
    '/help',
    '/legal/privacy',
    '/legal/terms'
  ],
  adminRoutes: [
    '/admin',
    '/admin/users',
    '/admin/verification',
    '/admin/audit',
    '/admin/system'
  ],
  professionalRoutes: [
    '/prescriptions/create',
    '/prescriptions/dispense',
    '/patients/add',
    '/patients/history',
    '/professional/cpd'
  ],
  verificationRequiredRoutes: [
    '/prescriptions/create',
    '/prescriptions/dispense',
    '/patients/add',
    '/professional/license'
  ],
  mfaRequiredRoutes: [
    '/admin',
    '/prescriptions/controlled',
    '/audit/reports',
    '/settings/security'
  ]
}

// Example 3: Advanced middleware with custom logic
export function advancedMiddlewareExample() {
  return async function middleware(request: NextRequest) {
    let response = NextResponse.next()
    
    try {
      const { pathname } = request.nextUrl
      
      // Custom logic for specific paths
      if (pathname.startsWith('/api/auth/')) {
        // Skip middleware for auth API routes
        return response
      }
      
      // Apply standard route protection
      response = await protectMiddlewareRoute(request, response, customRouteConfig)
      
      // Add custom business logic
      if (pathname.startsWith('/prescriptions/')) {
        const userClaims = await getMiddlewareUserClaims(request, response)
        
        if (userClaims) {
          // Enhanced JWT Claims validation for prescriptions
          if (userClaims.profile_status !== 'complete') {
            console.log('Middleware: Incomplete profile for prescription access')
            return NextResponse.redirect(new URL('/profile/complete', request.url))
          }
          
          // Business-specific validation using enhanced claims
          if (userClaims.business_info && userClaims.business_info.status === 'suspended') {
            console.log('Middleware: Suspended business access attempt')
            return NextResponse.redirect(new URL('/dashboard/suspended', request.url))
          }
        }
      }
      
      // Add performance and security headers
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
      
      return response
    } catch (error) {
      console.error('Advanced middleware error:', error)
      return response
    }
  }
}

// Example 4: Role-based middleware with fine-grained control
export function roleBasedMiddlewareExample() {
  return async function middleware(request: NextRequest) {
    const response = NextResponse.next()
    const { pathname } = request.nextUrl
    
    // Skip public routes
    const publicPaths = ['/', '/auth', '/api/public', '/about', '/contact']
    if (publicPaths.some(path => pathname.startsWith(path))) {
      return response
    }
    
    // Check authentication first
    const userClaims = await getMiddlewareUserClaims(request, response)
    if (!userClaims) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    
    // Fine-grained role checking
    if (pathname.startsWith('/admin/')) {
      const isAdmin = await middlewareHasRole(request, response, 'admin')
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
    
    if (pathname.startsWith('/professional/')) {
      const isProfessional = await middlewareHasRole(request, response, 'tcm_practitioner')
      const isVerified = await middlewareIsVerifiedProfessional(request, response)
      
      if (!isProfessional || !isVerified) {
        return NextResponse.redirect(new URL('/profile/verification', request.url))
      }
    }
    
    if (pathname.startsWith('/secure/')) {
      const hasMFA = await middlewareHasMFA(request, response)
      if (!hasMFA) {
        return NextResponse.redirect(new URL('/auth/mfa/setup', request.url))
      }
    }
    
    return response
  }
}

// Example 5: A/B testing middleware with session-based routing
export function abTestingMiddlewareExample() {
  return async function middleware(request: NextRequest) {
    let response = NextResponse.next()
    
    // Apply standard authentication
    response = await protectMiddlewareRoute(request, response)
    
    const userClaims = await getMiddlewareUserClaims(request, response)
    if (userClaims) {
      const { pathname } = request.nextUrl
      
      // A/B test for dashboard layout based on user role
      if (pathname === '/dashboard') {
        if (userClaims.role === 'tcm_practitioner') {
          // Route professionals to new dashboard
          response = NextResponse.rewrite(new URL('/dashboard/professional', request.url))
        } else if (userClaims.role === 'pharmacy') {
          // Route pharmacies to specialized dashboard
          response = NextResponse.rewrite(new URL('/dashboard/pharmacy', request.url))
        }
      }
      
      // Feature flag based on enhanced JWT claims
      if (userClaims.business_info?.features?.beta_access && pathname.startsWith('/beta/')) {
        // Allow beta feature access
        response.headers.set('X-Beta-Access', 'true')
      }
    }
    
    return response
  }
}

// Example 6: API route protection middleware
export function apiProtectionMiddlewareExample() {
  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    // Only protect API routes
    if (!pathname.startsWith('/api/')) {
      return NextResponse.next()
    }
    
    // Skip public API routes
    if (pathname.startsWith('/api/public/') || pathname.startsWith('/api/auth/')) {
      return NextResponse.next()
    }
    
    const response = NextResponse.next()
    const userClaims = await getMiddlewareUserClaims(request, response)
    
    if (!userClaims) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // API-specific role validation
    if (pathname.startsWith('/api/admin/')) {
      if (userClaims.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }
    
    if (pathname.startsWith('/api/prescriptions/')) {
      if (userClaims.role !== 'tcm_practitioner' || userClaims.verification_status !== 'verified') {
        return NextResponse.json(
          { error: 'Verified professional access required' },
          { status: 403 }
        )
      }
    }
    
    // Add user context headers for API routes
    response.headers.set('X-User-ID', userClaims.role) // Note: Never expose actual user ID
    response.headers.set('X-User-Role', userClaims.role)
    response.headers.set('X-User-Verified', userClaims.verification_status || 'unknown')
    
    return response
  }
}

// Example 7: Maintenance mode middleware
export function maintenanceMiddlewareExample() {
  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    // Check if maintenance mode is enabled
    const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'
    
    if (maintenanceMode) {
      // Allow admin access during maintenance
      const response = NextResponse.next()
      const userClaims = await getMiddlewareUserClaims(request, response)
      
      if (!userClaims || userClaims.role !== 'admin') {
        // Redirect non-admin users to maintenance page
        if (pathname !== '/maintenance') {
          return NextResponse.redirect(new URL('/maintenance', request.url))
        }
      }
    }
    
    // Apply normal middleware logic
    return protectMiddlewareRoute(request, NextResponse.next())
  }
}

// Example 8: Geolocation-based access control
export function geolocationMiddlewareExample() {
  return async function middleware(request: NextRequest) {
    let response = NextResponse.next()
    
    // Apply standard authentication
    response = await protectMiddlewareRoute(request, response)
    
    const userClaims = await getMiddlewareUserClaims(request, response)
    if (userClaims) {
      // Check user's business location from enhanced JWT claims
      const userLocation = userClaims.business_info?.location
      const requestCountry = request.geo?.country
      
      // Restrict access based on business location for compliance
      if (userLocation && requestCountry && userLocation.country !== requestCountry) {
        console.log(`Location mismatch: User business in ${userLocation.country}, request from ${requestCountry}`)
        
        // Allow access but log for compliance monitoring
        response.headers.set('X-Location-Warning', 'true')
        response.headers.set('X-Business-Country', userLocation.country)
        response.headers.set('X-Request-Country', requestCountry)
      }
    }
    
    return response
  }
}

// Export configuration examples for different use cases
export const middlewareConfigs = {
  // Standard web app protection
  standard: {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
  },
  
  // API-only protection
  apiOnly: {
    matcher: ['/api/:path*']
  },
  
  // Specific path protection
  specificPaths: {
    matcher: [
      '/dashboard/:path*',
      '/admin/:path*',
      '/prescriptions/:path*'
    ]
  },
  
  // Comprehensive protection with exclusions
  comprehensive: {
    matcher: [
      {
        source: '/((?!api/public|api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
        missing: [
          { type: 'header', key: 'next-router-prefetch' },
          { type: 'header', key: 'purpose', value: 'prefetch' },
        ],
      },
    ],
  }
}