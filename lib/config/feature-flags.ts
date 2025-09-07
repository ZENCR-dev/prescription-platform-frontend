/**
 * Feature Flags Configuration - M1.2 IRG Integration
 * 
 * @description Controls IRG integration with backend M1.3 real data sources
 * @author Frontend Lead
 * @date 2025-09-07
 * @compliance Architecture directive for IRG validation
 */

export interface FeatureFlags {
  /** Enable real backend views instead of mock data */
  USE_REAL_VIEWS: boolean
  /** Enable IRG validation mode */
  IRG_VALIDATION_MODE: boolean
  /** Enable performance monitoring during IRG */
  IRG_PERFORMANCE_MONITORING: boolean
}

export interface RealViewsConfig {
  /** TCM Practitioner context view - role-based access */
  TCM_CONTEXT_VIEW: string
  /** Pharmacy context view - role-based access */
  PHARMACY_CONTEXT_VIEW: string
  /** Public profiles view - public directory access */
  PUBLIC_VIEW: string
}

/**
 * Real Views Configuration
 * Backend M1.3 provided view names for IRG integration
 */
export const REAL_VIEWS: RealViewsConfig = {
  TCM_CONTEXT_VIEW: 'v_profiles_tcm_context',
  PHARMACY_CONTEXT_VIEW: 'v_profiles_pharmacy_context', 
  PUBLIC_VIEW: 'v_profiles_public'
} as const

/**
 * Feature Flags Configuration
 * Controlled by environment variables
 */
export const FEATURE_FLAGS: FeatureFlags = {
  USE_REAL_VIEWS: process.env.NEXT_PUBLIC_USE_REAL_VIEWS === 'true',
  IRG_VALIDATION_MODE: process.env.NEXT_PUBLIC_IRG_VALIDATION === 'true',
  IRG_PERFORMANCE_MONITORING: process.env.NEXT_PUBLIC_IRG_PERF_MONITORING === 'true'
} as const

/**
 * Get view name based on user role and feature flag
 */
export function getViewName(role: 'tcm_practitioner' | 'pharmacy' | 'admin' | 'public'): string {
  if (!FEATURE_FLAGS.USE_REAL_VIEWS) {
    // Return mock/fallback view names
    return `mock_${role}_view`
  }

  switch (role) {
    case 'tcm_practitioner':
    case 'admin': // Admin can access TCM context
      return REAL_VIEWS.TCM_CONTEXT_VIEW
    case 'pharmacy':
      return REAL_VIEWS.PHARMACY_CONTEXT_VIEW
    case 'public':
      return REAL_VIEWS.PUBLIC_VIEW
    default:
      return REAL_VIEWS.PUBLIC_VIEW
  }
}

/**
 * Check if IRG validation mode is enabled
 */
export function isIRGMode(): boolean {
  return FEATURE_FLAGS.IRG_VALIDATION_MODE
}

/**
 * Check if performance monitoring is enabled
 */
export function isPerfMonitoringEnabled(): boolean {
  return FEATURE_FLAGS.IRG_PERFORMANCE_MONITORING
}

/**
 * Get IRG configuration for testing
 */
export interface IRGConfig {
  viewNames: RealViewsConfig
  performanceThreshold: {
    maxAuthCheckMs: number
    maxViewQueryMs: number
    maxConcurrentRequests: number
  }
  validationChecks: {
    positiveRecords: boolean // >0 records for authorized users
    negativeRecords: boolean // =0 records for unauthorized users  
    publicProfileFilter: boolean // only is_public_profile=true in public view
    jwtConsistency: boolean // JWT claims consistent across middleware/ProtectedRoute
  }
}

export function getIRGConfig(): IRGConfig {
  return {
    viewNames: REAL_VIEWS,
    performanceThreshold: {
      maxAuthCheckMs: 100,
      maxViewQueryMs: 200, 
      maxConcurrentRequests: 1 // concurrent deduplication
    },
    validationChecks: {
      positiveRecords: true,
      negativeRecords: true,
      publicProfileFilter: true,
      jwtConsistency: true
    }
  }
}

/**
 * IRG Environment Validation
 * Ensures all required environment variables are set for IRG mode
 */
export function validateIRGEnvironment(): { valid: boolean; missing: string[] } {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missing = required.filter(env => !process.env[env])
  
  return {
    valid: missing.length === 0,
    missing
  }
}

/**
 * Development utilities for testing
 */
export const DEV_UTILS = {
  /**
   * Toggle feature flags for development testing
   */
  toggleRealViews: () => {
    if (process.env.NODE_ENV === 'development') {
      // This would be used in development console
      console.log('Current USE_REAL_VIEWS:', FEATURE_FLAGS.USE_REAL_VIEWS)
      console.log('To toggle, set NEXT_PUBLIC_USE_REAL_VIEWS=true/false in .env.local')
    }
  },
  
  /**
   * Log current configuration for debugging
   */
  logConfig: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Feature Flags:', FEATURE_FLAGS)
      console.log('Real Views:', REAL_VIEWS)
      console.log('IRG Config:', getIRGConfig())
    }
  }
}

export default FEATURE_FLAGS