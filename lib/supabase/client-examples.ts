/**
 * Supabase Browser Client Usage Examples
 * 
 * Dev-Step 1.1 Reference Implementation Examples
 * Demonstrates proper usage of auth.getClaims() and client functionality
 */

import { 
  getUserClaims, 
  hasRole, 
  isVerifiedProfessional, 
  hasMFA,
  getCurrentUser,
  onAuthStateChange,
  signOut,
  type UserRole,
  type AuthUser 
} from './client'

/**
 * Example 1: Basic Authentication Check
 * Check if user is authenticated and get their claims
 */
export async function exampleAuthCheck(): Promise<void> {
  const user = await getCurrentUser()
  
  if (user) {
    console.log('User authenticated:', {
      id: user.id,
      email: user.email,
      role: user.user_metadata.role,
      business: user.user_metadata.business_name,
      verified: user.user_metadata.verification_status
    })
  } else {
    console.log('User not authenticated')
  }
}

/**
 * Example 2: Role-Based Access Control
 * Demonstrate role checking for different user types
 */
export async function exampleRoleBasedAccess(): Promise<void> {
  // Check specific roles
  const isPractitioner = await hasRole('tcm_practitioner')
  const isPharmacy = await hasRole('pharmacy')
  const isAdmin = await hasRole('admin')
  
  console.log('Role permissions:', {
    canCreatePrescriptions: isPractitioner,
    canFulfillOrders: isPharmacy,
    hasAdminAccess: isAdmin
  })
  
  // Check professional verification status
  const isVerified = await isVerifiedProfessional()
  console.log('Professional verification:', isVerified)
  
  // Check MFA status for sensitive operations
  const mfaEnabled = await hasMFA()
  console.log('MFA enabled:', mfaEnabled)
}

/**
 * Example 3: JWT Claims Access
 * Direct access to user claims for UI state management
 */
export async function exampleClaimsAccess(): Promise<void> {
  const claims = await getUserClaims()
  
  if (claims) {
    // Use claims for UI state management
    const uiState = {
      userRole: claims.role,
      businessName: claims.business_name,
      canAccessProfessionalFeatures: claims.verification_status === 'verified',
      requiresMFA: claims.aal !== 'aal2', // True if MFA not completed
      licenseNumber: claims.license_number
    }
    
    console.log('UI State from claims:', uiState)
  }
}

/**
 * Example 4: Real-time Auth State Management
 * Set up authentication state listener for React components
 */
export function exampleAuthStateListener(): () => void {
  const unsubscribe = onAuthStateChange((user: AuthUser | null) => {
    if (user) {
      console.log('User signed in:', user.email)
      console.log('User role:', user.user_metadata.role)
      
      // Update app state, redirect based on role, etc.
      switch (user.user_metadata.role) {
        case 'tcm_practitioner':
          console.log('Redirect to practitioner dashboard')
          break
        case 'pharmacy':
          console.log('Redirect to pharmacy dashboard')
          break
        case 'admin':
          console.log('Redirect to admin dashboard')
          break
      }
    } else {
      console.log('User signed out')
      // Redirect to login, clear app state, etc.
    }
  })
  
  // Return unsubscribe function for cleanup
  return unsubscribe
}

/**
 * Example 5: Protected Route Implementation
 * How to use the client for route protection
 */
export async function exampleProtectedRoute(
  requiredRole?: UserRole
): Promise<{ allowed: boolean; reason?: string }> {
  const user = await getCurrentUser()
  
  if (!user) {
    return { allowed: false, reason: 'Not authenticated' }
  }
  
  if (!user.email_confirmed_at) {
    return { allowed: false, reason: 'Email not confirmed' }
  }
  
  if (requiredRole && user.user_metadata.role !== requiredRole) {
    return { allowed: false, reason: 'Insufficient permissions' }
  }
  
  // For professional features, require verification
  if (requiredRole && requiredRole !== 'admin') {
    const isVerified = user.user_metadata.verification_status === 'verified'
    if (!isVerified) {
      return { allowed: false, reason: 'Professional verification required' }
    }
  }
  
  return { allowed: true }
}

/**
 * Example 6: Sign Out with Cleanup
 * Proper sign out with error handling
 */
export async function exampleSignOut(): Promise<void> {
  try {
    await signOut()
    console.log('Successfully signed out')
    
    // Clear any app-specific state
    // Redirect to login page
    window.location.href = '/login'
  } catch (error) {
    console.error('Sign out failed:', error)
    // Handle sign out errors
  }
}

/**
 * Example 7: Environment Variables Validation
 * Check if required environment variables are configured
 */
export function validateEnvironmentSetup(): boolean {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missing = requiredEnvVars.filter(
    varName => !process.env[varName]
  )
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    return false
  }
  
  console.log('✅ Environment setup validated')
  return true
}

/**
 * Example Usage in React Component:
 * 
 * ```tsx
 * import { useEffect, useState } from 'react'
 * import { getCurrentUser, onAuthStateChange, type AuthUser } from '@/lib/supabase/client'
 * 
 * export function useAuth() {
 *   const [user, setUser] = useState<AuthUser | null>(null)
 *   const [loading, setLoading] = useState(true)
 * 
 *   useEffect(() => {
 *     // Get initial user state
 *     getCurrentUser().then(user => {
 *       setUser(user)
 *       setLoading(false)
 *     })
 * 
 *     // Listen for auth changes
 *     const unsubscribe = onAuthStateChange(setUser)
 *     return unsubscribe
 *   }, [])
 * 
 *   return { user, loading }
 * }
 * ```
 */