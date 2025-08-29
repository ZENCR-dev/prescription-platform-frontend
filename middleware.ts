/**
 * Next.js Middleware - Main Application Middleware
 * 
 * Frontend Lead Implementation: Dev-Step 2.2 Role-based Route Protection
 * Implements Supabase authentication and comprehensive route protection with pharmacy role support
 * 
 * @usage Automatically applied by Next.js to all routes matching the config
 * @compliance APIv1.md v1.0.0-alpha, Enhanced JWT Claims support, Role-based access control
 * @dependencies lib/supabase/middleware.ts, lib/supabase/middleware-config.ts
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddleware } from './lib/supabase/middleware'
import { getRouteConfig } from './lib/supabase/middleware-config'

// Create middleware with custom route configuration for all three roles
const customMiddleware = createSupabaseMiddleware(getRouteConfig())

export default customMiddleware

// Export the middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}

/**
 * Dev-Step 2.2: Comprehensive Role-Based Route Protection
 * 
 * Custom middleware with support for all three platform user roles:
 * 
 * ✅ Automatic session refresh and JWT validation
 * ✅ Role-based access control (admin/tcm_practitioner/pharmacy)
 * ✅ Enhanced JWT claims support (role, verification_status, profile_status, business_info)
 * ✅ Verification status checking for sensitive operations
 * ✅ MFA enforcement for critical functions
 * ✅ Edge runtime optimization with security headers
 * ✅ 403 Access Denied handling for unauthorized role access
 * 
 * Role-Based Route Architecture:
 * 
 * **Admin Routes** (admin role required):
 * - /admin/* - Complete administrative dashboard and system management
 * - /admin/users, /admin/verification, /admin/reports, /admin/audit
 * 
 * **TCM Practitioner Routes** (tcm_practitioner role required):
 * - /prescriptions/* - Prescription management and creation
 * - /patients/* - Patient management (verification required)
 * - /professional/* - Professional dashboard and license management
 * 
 * **Pharmacy Routes** (pharmacy role required) - NEW in Dev-Step 2.2:
 * - /pharmacy/* - Pharmacy operations dashboard
 * - /pharmacy/orders, /pharmacy/inventory, /pharmacy/fulfillment
 * - /pharmacy/compliance, /pharmacy/reports (verification required)
 * 
 * **Protected Routes** (authentication required, any role):
 * - /dashboard, /profile, /settings, /support, /notifications
 * 
 * **Public Routes** (no authentication required):
 * - /, /auth/*, /about, /contact, /help, /legal/*, /403
 * 
 * **Verification Required** (verified professional/business status):
 * - Prescription creation and management operations
 * - Patient management and sensitive medical functions
 * - Pharmacy order fulfillment and compliance features
 * 
 * **MFA Required** (aal2 authentication level):
 * - All admin functions and system management
 * - Controlled substance operations
 * - Security settings and audit access
 * 
 * Configuration Source: lib/supabase/middleware-config.ts
 * Environment-aware: Production vs. Development configurations
 */