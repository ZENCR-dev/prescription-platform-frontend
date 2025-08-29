/**
 * Next.js Middleware - Main Application Middleware
 * 
 * Frontend Lead Implementation: M1.2 Auth Client Integration
 * Implements Supabase authentication and route protection for the entire application
 * 
 * @usage Automatically applied by Next.js to all routes matching the config
 * @compliance APIv1.md v1.0.0-alpha, Enhanced JWT Claims support
 * @dependencies lib/supabase/middleware.ts
 */

// Export the default Supabase middleware with custom route configuration
export { default } from './lib/supabase/middleware'

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
 * Middleware Configuration Notes:
 * 
 * The default middleware exported from lib/supabase/middleware provides:
 * 
 * ✅ Automatic session refresh
 * ✅ Route-based access control
 * ✅ Enhanced JWT claims support (role, profile_status, business_info)
 * ✅ Edge runtime optimization
 * ✅ Security headers injection
 * 
 * Protected Routes (require authentication):
 * - /dashboard/*
 * - /profile/*
 * - /prescriptions/*
 * - /patients/*
 * - /inventory/*
 * - /reports/*
 * 
 * Public Routes (no authentication required):
 * - /
 * - /auth/*
 * - /about, /contact, /help
 * - /legal/privacy, /legal/terms
 * 
 * Admin Routes (require admin role):
 * - /admin/*
 * 
 * Professional Routes (require tcm_practitioner role):
 * - /prescriptions/create
 * - /prescriptions/dispense
 * - /patients/add
 * - /patients/history
 * 
 * Verification Required Routes (require verified status):
 * - /prescriptions/create
 * - /prescriptions/dispense
 * - /patients/add
 * - /professional/license
 * 
 * MFA Required Routes (require aal2):
 * - /admin/*
 * - /prescriptions/controlled
 * - /audit/reports
 * - /settings/security
 * 
 * To customize route configuration, see:
 * - lib/supabase/middleware.ts (main implementation)
 * - lib/supabase/middleware-examples.ts (advanced examples)
 */