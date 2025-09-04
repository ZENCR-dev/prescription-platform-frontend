/**
 * Supabase Server Client Usage Examples
 * 
 * Dev-Step 1.2 Reference Implementation Examples
 * Demonstrates proper server-side usage with Next.js App Router
 */

import { 
  createServerSupabaseClient,
  getServerUserClaims,
  getServerCurrentUser,
  isServerAuthenticated,
  getServerSession,
  serverProtectRoute,
  type AuthUser
} from './server'

/**
 * Example 1: Server Component Authentication
 * How to check auth state in Server Components
 */
export async function exampleServerComponentAuth() {
  const isAuth = await isServerAuthenticated()
  const user = await getServerCurrentUser()
  
  if (isAuth && user) {
    console.log('Server Component - User authenticated:', {
      id: user.id,
      email: user.email,
      role: user.user_metadata.role,
      business: user.user_metadata.business_name,
      verified: user.user_metadata.verification_status
    })
    
    // Example role-based rendering logic
    switch (user.user_metadata.role) {
      case 'tcm_practitioner':
        console.log('Render practitioner dashboard')
        break
      case 'pharmacy':
        console.log('Render pharmacy dashboard')
        break
      case 'admin':
        console.log('Render admin dashboard')
        break
    }
  } else {
    console.log('Server Component - User not authenticated')
    // Redirect to login or show public content
  }
}

/**
 * Example 2: Server Action with Role Protection
 * Protecting Server Actions with role-based access control
 */
export async function exampleProtectedServerAction(data: { prescriptionData: Record<string, unknown> }) {
  'use server' // This would be used in actual Server Action
  
  // Protect the action - require TCM practitioner role and verification
  const protection = await serverProtectRoute({
    requiredRole: 'tcm_practitioner',
    requireVerification: true
  })
  
  if (!protection.authorized) {
    throw new Error(`Access denied: ${protection.reason}`)
  }
  
  console.log('Server Action - Authorized practitioner:', protection.user?.email)
  
  // Proceed with protected action
  const supabase = createServerSupabaseClient()
  
  // Example: Create prescription with user context
  const { data: prescription, error } = await supabase
    .from('prescriptions')
    .insert({
      practitioner_id: protection.user?.id,
      prescription_data: data.prescriptionData,
      created_at: new Date().toISOString()
    })
  
  if (error) {
    console.error('Failed to create prescription:', error)
    throw new Error('Failed to create prescription')
  }
  
  console.log('Prescription created successfully:', prescription)
  return prescription
}

/**
 * Example 3: Route Handler with Authentication
 * API Route with server-side authentication
 */
export async function exampleApiRouteAuth() {
  // This would be used in app/api/protected/route.ts
  
  const session = await getServerSession()
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const claims = await getServerUserClaims()
  
  if (!claims) {
    return Response.json({ error: 'Invalid session' }, { status: 401 })
  }
  
  // Example API response with user context
  return Response.json({
    message: 'Protected route accessed successfully',
    user: {
      role: claims.role,
      business: claims.business_name,
      verified: claims.verification_status === 'verified'
    },
    timestamp: new Date().toISOString()
  })
}

/**
 * Example 4: Middleware-Style Authentication Check
 * How to use server client in middleware or similar contexts
 */
export async function exampleMiddlewareAuth(pathname: string): Promise<{
  shouldRedirect: boolean
  redirectTo?: string
  user?: AuthUser
}> {
  try {
    const user = await getServerCurrentUser()
    
    // Public routes - allow access
    const publicRoutes = ['/login', '/signup', '/about', '/']
    if (publicRoutes.includes(pathname)) {
      return { shouldRedirect: false, user: user || undefined }
    }
    
    // Protected routes - require authentication
    if (!user) {
      return { 
        shouldRedirect: true, 
        redirectTo: '/login?redirect=' + encodeURIComponent(pathname)
      }
    }
    
    // Email confirmation required
    if (!user.email_confirmed_at) {
      return { 
        shouldRedirect: true, 
        redirectTo: '/confirm-email'
      }
    }
    
    // Role-based route protection
    if (pathname.startsWith('/admin')) {
      const isAdmin = user.user_metadata.role === 'admin'
      if (!isAdmin) {
        return { 
          shouldRedirect: true, 
          redirectTo: '/unauthorized'
        }
      }
    }
    
    if (pathname.startsWith('/practitioner')) {
      const isPractitioner = user.user_metadata.role === 'tcm_practitioner'
      const isVerified = user.user_metadata.verification_status === 'verified'
      
      if (!isPractitioner) {
        return { 
          shouldRedirect: true, 
          redirectTo: '/unauthorized'
        }
      }
      
      if (!isVerified) {
        return { 
          shouldRedirect: true, 
          redirectTo: '/verification-pending'
        }
      }
    }
    
    return { shouldRedirect: false, user }
  } catch (error) {
    console.error('Middleware auth check failed:', error)
    return { 
      shouldRedirect: true, 
      redirectTo: '/error'
    }
  }
}

/**
 * Example 5: Role-Based Data Fetching
 * Server-side data fetching based on user role
 */
export async function exampleRoleBasedDataFetch() {
  const user = await getServerCurrentUser()
  
  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }
  
  const supabase = createServerSupabaseClient()
  
  try {
    let query
    
    switch (user.user_metadata.role) {
      case 'admin':
        // Admin sees all data
        query = supabase
          .from('prescriptions')
          .select('*')
        break
        
      case 'tcm_practitioner':
        // Practitioner sees only their prescriptions
        query = supabase
          .from('prescriptions')
          .select('*')
          .eq('practitioner_id', user.id)
        break
        
      case 'pharmacy':
        // Pharmacy sees prescriptions assigned to them
        query = supabase
          .from('prescriptions')
          .select('*')
          .eq('pharmacy_id', user.id)
        break
        
      default:
        return { data: null, error: 'Invalid role' }
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Data fetch error:', error)
      return { data: null, error: error.message }
    }
    
    console.log(`Fetched ${data?.length || 0} prescriptions for ${user.user_metadata.role}`)
    return { data, error: null }
    
  } catch (error) {
    console.error('Server data fetch failed:', error)
    return { data: null, error: 'Server error' }
  }
}

/**
 * Example 6: Session Validation for Sensitive Operations
 * Comprehensive validation for sensitive Server Actions
 */
export async function exampleSensitiveOperation(operationData: Record<string, unknown>) {
  'use server' // This would be used in actual Server Action
  
  // Multi-factor validation for sensitive operations
  const protection = await serverProtectRoute({
    requireVerification: true,
    requireMFA: true
  })
  
  if (!protection.authorized) {
    throw new Error(`Sensitive operation denied: ${protection.reason}`)
  }
  
  // Additional session validation
  const session = await getServerSession()
  if (!session || session.expires_at! * 1000 < Date.now()) {
    throw new Error('Session expired')
  }
  
  console.log('Sensitive operation authorized for user:', protection.user?.email)
  
  // Proceed with sensitive operation
  const supabase = createServerSupabaseClient()
  
  try {
    // Example sensitive operation with audit trail
    const { data, error } = await supabase.rpc('perform_sensitive_operation', {
      user_id: protection.user?.id,
      operation_data: operationData,
      timestamp: new Date().toISOString()
    })
    
    if (error) {
      throw error
    }
    
    console.log('Sensitive operation completed successfully')
    return data
    
  } catch (error) {
    console.error('Sensitive operation failed:', error)
    throw new Error('Operation failed')
  }
}

/**
 * Example Usage in Server Components:
 * 
 * ```tsx
 * // app/dashboard/page.tsx
 * import { getServerCurrentUser, serverProtectRoute } from '@/lib/supabase/server'
 * import { redirect } from 'next/navigation'
 * 
 * export default async function DashboardPage() {
 *   const protection = await serverProtectRoute({
 *     requireVerification: true
 *   })
 * 
 *   if (!protection.authorized) {
 *     redirect('/login')
 *   }
 * 
 *   const user = protection.user!
 * 
 *   return (
 *     <div>
 *       <h1>Welcome, {user.user_metadata.business_name}</h1>
 *       <p>Role: {user.user_metadata.role}</p>
 *     </div>
 *   )
 * }
 * ```
 * 
 * Example Usage in Server Actions:
 * 
 * ```tsx
 * // app/prescriptions/actions.ts
 * 'use server'
 * 
 * import { serverProtectRoute } from '@/lib/supabase/server'
 * 
 * export async function createPrescription(formData: FormData) {
 *   const protection = await serverProtectRoute({
 *     requiredRole: 'tcm_practitioner',
 *     requireVerification: true
 *   })
 * 
 *   if (!protection.authorized) {
 *     throw new Error(protection.reason)
 *   }
 * 
 *   // Process prescription creation...
 * }
 * ```
 * 
 * Example Usage in API Routes:
 * 
 * ```tsx
 * // app/api/user/route.ts
 * import { getServerCurrentUser } from '@/lib/supabase/server'
 * 
 * export async function GET() {
 *   const user = await getServerCurrentUser()
 * 
 *   if (!user) {
 *     return Response.json({ error: 'Unauthorized' }, { status: 401 })
 *   }
 * 
 *   return Response.json({ user })
 * }
 * ```
 */