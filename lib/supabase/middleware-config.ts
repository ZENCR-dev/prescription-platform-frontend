/**
 * Custom Middleware Route Configuration
 * Dev-Step 2.2: Protected route definitions (tcm_practitioner/pharmacy/admin)
 * 
 * Defines comprehensive role-based access control for all three user roles
 * in the B2B2C TCM Prescription Fulfillment Platform
 * 
 * @compliance APIv1.md v1.0.0-alpha - Role definitions and JWT claims
 * @reference Component 1 middleware client integration
 * @usage Import in middleware.ts to replace defaultRouteConfig
 */

import type { MiddlewareRouteConfig } from './middleware'

/**
 * Production Route Configuration with Role-Based Access Control
 * Enhanced configuration supporting all three platform user roles
 * with verification status and MFA requirements per APIv1.md
 */
export const productionRouteConfig: MiddlewareRouteConfig = {
  // Basic protected routes requiring authentication but no specific role
  protectedRoutes: [
    '/dashboard',     // General user dashboard
    '/profile',       // User profile settings  
    '/settings',      // Account settings
    '/support',       // Help and support center
    '/notifications', // User notifications
    '/professional/license'  // License verification (accessible to all logged-in users)
  ],

  // Public routes accessible without authentication
  publicRoutes: [
    '/',                        // Homepage
    '/auth/login',              // Login page (updated path)
    '/auth/register',           // Registration page (updated path) 
    '/auth/forgot-password',    // Password reset request
    '/auth/reset-password',     // Password reset form
    '/auth/mfa/verify',         // MFA verification during login
    '/about',                   // About the platform
    '/contact',                 // Contact information
    '/help',                    // Help documentation
    '/legal/privacy',           // Privacy policy
    '/legal/terms',             // Terms of service
    '/403'                      // Access denied page
  ],

  // Admin routes requiring admin role
  adminRoutes: [
    '/admin',                   // Admin dashboard
    '/admin/users',             // User management
    '/admin/verification',      // User verification approvals
    '/admin/verification/pending', // Pending verifications
    '/admin/verification/history', // Verification history
    '/admin/settings',          // System settings
    '/admin/reports',           // Administrative reports
    '/admin/reports/usage',     // Platform usage reports
    '/admin/reports/security',  // Security audit reports
    '/admin/audit',             // System audit logs
    '/admin/maintenance'        // System maintenance
  ],

  // TCM Practitioner routes requiring tcm_practitioner role  
  professionalRoutes: [
    '/prescriptions',           // Prescription management hub
    '/prescriptions/create',    // Create new prescription
    '/prescriptions/manage',    // Manage existing prescriptions  
    '/prescriptions/history',   // Prescription history
    '/prescriptions/templates', // Prescription templates
    '/patients',                // Patient management (when verified)
    '/patients/manage',         // Patient list and management
    '/patients/history',        // Patient history access
    '/patients/add',            // Add new patient
    '/professional',            // Professional dashboard
    '/professional/dashboard',  // TCM practitioner main dashboard
    '/professional/profile',    // Professional profile settings
    '/professional/continuing-education' // CE credit tracking
  ],

  // Pharmacy routes requiring pharmacy role (Previously Missing)
  pharmacyRoutes: [
    '/pharmacy',                // Pharmacy operations hub
    '/pharmacy/dashboard',      // Pharmacy main dashboard
    '/pharmacy/orders',         // Prescription order management
    '/pharmacy/orders/pending', // Pending prescription orders
    '/pharmacy/orders/active',  // Active orders being filled
    '/pharmacy/orders/history', // Order fulfillment history
    '/pharmacy/inventory',      // Medication inventory management
    '/pharmacy/inventory/stock', // Stock level monitoring
    '/pharmacy/inventory/expiry', // Expiry date tracking
    '/pharmacy/fulfillment',    // Order fulfillment tracking
    '/pharmacy/fulfillment/queue', // Fulfillment queue
    '/pharmacy/fulfillment/shipping', // Shipping management
    '/pharmacy/profile',        // Pharmacy profile settings
    '/pharmacy/staff',          // Staff management (when applicable)
    '/pharmacy/reports',        // Pharmacy operation reports
    '/pharmacy/compliance'      // Regulatory compliance tracking
  ],

  // Routes requiring verified professional/business status
  verificationRequiredRoutes: [
    '/prescriptions/create',    // Creating prescriptions requires verification
    '/prescriptions/manage',    // Managing prescriptions requires verification  
    '/patients/add',            // Adding patients requires verification
    '/patients/manage',         // Managing patients requires verification
    '/pharmacy/orders/accept',  // Accepting orders requires verification
    '/pharmacy/fulfillment',    // Fulfillment operations require verification
    '/pharmacy/compliance'      // Compliance features require verification
  ],

  // Routes requiring multi-factor authentication (aal2)
  mfaRequiredRoutes: [
    '/admin',                   // All admin functions require MFA
    '/admin/users',             // User management is sensitive
    '/admin/verification',      // Verification decisions require MFA
    '/admin/settings',          // System settings require MFA  
    '/admin/audit',             // Audit access requires MFA
    '/prescriptions/controlled', // Controlled substance prescriptions
    '/patients/sensitive',      // Sensitive patient operations
    '/pharmacy/controlled',     // Controlled substance fulfillment
    '/settings/security',       // Security settings require MFA
    '/profile/delete-account'   // Account deletion requires MFA
  ]
}

/**
 * Route Configuration Type Extensions
 * Extends the base MiddlewareRouteConfig to include pharmacy routes
 */
declare module './middleware' {
  interface MiddlewareRouteConfig {
    pharmacyRoutes?: string[]
  }
}

/**
 * Development Route Configuration  
 * Simplified configuration for development and testing
 * Reduces security restrictions for easier development workflow
 */
export const developmentRouteConfig: MiddlewareRouteConfig = {
  protectedRoutes: [
    '/dashboard',
    '/profile'
  ],
  publicRoutes: [
    '/',
    '/auth/login',
    '/auth/register',
    '/403'
  ],
  adminRoutes: [
    '/admin'
  ],
  professionalRoutes: [
    '/prescriptions'
  ],
  pharmacyRoutes: [
    '/pharmacy'
  ],
  verificationRequiredRoutes: [],  // Reduced restrictions in development
  mfaRequiredRoutes: []            // No MFA required in development
}

/**
 * Get appropriate route configuration based on environment
 * Automatically selects production or development config
 * 
 * @returns MiddlewareRouteConfig - Environment-appropriate route configuration
 * @usage import { getRouteConfig } from './middleware-config'
 */
export function getRouteConfig(): MiddlewareRouteConfig {
  const isProduction = process.env.NODE_ENV === 'production'
  const config = isProduction ? productionRouteConfig : developmentRouteConfig
  
  // Add pharmacy routes to the configuration if they exist
  return {
    ...config,
    pharmacyRoutes: config.pharmacyRoutes || []
  }
}

/**
 * Route Configuration Validation
 * Ensures all route configurations are properly formatted and non-overlapping
 */
export function validateRouteConfig(config: MiddlewareRouteConfig): boolean {
  const allRoutes = [
    ...config.protectedRoutes,
    ...config.publicRoutes,
    ...config.adminRoutes,
    ...config.professionalRoutes,
    ...(config.pharmacyRoutes || [])
  ]
  
  // Check for duplicate routes
  const uniqueRoutes = new Set(allRoutes)
  if (uniqueRoutes.size !== allRoutes.length) {
    console.error('Duplicate routes detected in middleware configuration')
    return false
  }
  
  // Ensure critical routes are defined
  const requiredPublicRoutes = ['/', '/auth/login', '/403']
  const hasRequiredRoutes = requiredPublicRoutes.every(route => 
    config.publicRoutes.includes(route)
  )
  
  if (!hasRequiredRoutes) {
    console.error('Missing required public routes in configuration')
    return false
  }
  
  return true
}

/**
 * Route Permission Utilities
 * Helper functions for checking route permissions based on user roles
 */
export const RoutePermissions = {
  /**
   * Check if user role has access to specific route
   */
  hasRouteAccess(
    route: string, 
    userRole: 'tcm_practitioner' | 'pharmacy' | 'admin', 
    isVerified: boolean = false,
    hasMFA: boolean = false
  ): boolean {
    const config = getRouteConfig()
    
    // Public routes are accessible to everyone
    if (config.publicRoutes.some(r => route.startsWith(r))) {
      return true
    }
    
    // Check role-specific access
    switch (userRole) {
      case 'admin':
        if (config.adminRoutes.some(r => route.startsWith(r))) {
          // MFA check for sensitive admin routes
          if (config.mfaRequiredRoutes.some(r => route.startsWith(r))) {
            return hasMFA
          }
          return true
        }
        break
        
      case 'tcm_practitioner':
        if (config.professionalRoutes.some(r => route.startsWith(r))) {
          // Verification check for professional routes
          if (config.verificationRequiredRoutes.some(r => route.startsWith(r))) {
            return isVerified
          }
          return true
        }
        break
        
      case 'pharmacy':
        if ((config.pharmacyRoutes || []).some(r => route.startsWith(r))) {
          // Verification check for pharmacy routes
          if (config.verificationRequiredRoutes.some(r => route.startsWith(r))) {
            return isVerified
          }
          return true
        }
        break
    }
    
    // Basic protected routes accessible to all authenticated users
    if (config.protectedRoutes.some(r => route.startsWith(r))) {
      return true
    }
    
    return false
  },
  
  /**
   * Get appropriate redirect URL for unauthorized access
   */
  getUnauthorizedRedirect(
    route: string,
    userRole?: 'tcm_practitioner' | 'pharmacy' | 'admin'
  ): string {
    if (!userRole) {
      return '/auth/login'
    }
    
    const config = getRouteConfig()
    
    // If trying to access admin route without admin role
    if (config.adminRoutes.some(r => route.startsWith(r)) && userRole !== 'admin') {
      return '/403'
    }
    
    // If trying to access professional route without tcm_practitioner role
    if (config.professionalRoutes.some(r => route.startsWith(r)) && userRole !== 'tcm_practitioner') {
      return '/403'
    }
    
    // If trying to access pharmacy route without pharmacy role
    if ((config.pharmacyRoutes || []).some(r => route.startsWith(r)) && userRole !== 'pharmacy') {
      return '/403'
    }
    
    // Default to role-appropriate dashboard
    switch (userRole) {
      case 'admin': return '/admin'
      case 'tcm_practitioner': return '/professional/dashboard'
      case 'pharmacy': return '/pharmacy/dashboard'
      default: return '/dashboard'
    }
  }
}

export default productionRouteConfig