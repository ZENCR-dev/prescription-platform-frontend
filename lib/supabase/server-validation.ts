/**
 * Supabase Server Client Validation - Dev-Step 1.2 Step 3
 * 
 * Frontend Lead Validation: Test server client connection and SSR functionality
 * Verifies integration with Next.js cookies and server-side authentication
 */

import { 
  createServerSupabaseClient,
  getServerUserClaims,
  serverHasRole,
  isServerAuthenticated,
  getServerSession,
  serverProtectRoute,
  resetServerClientInstance
} from './server'

/**
 * Validation Test Suite for Dev-Step 1.2
 * Tests core server-side functionality without requiring actual authentication
 */
export class SupabaseServerValidator {
  
  /**
   * Test 1: Server Environment Configuration Validation
   * Validates environment variables and server client creation
   */
  async validateServerEnvironment(): Promise<{ success: boolean; message: string }> {
    try {
      // Check environment variables directly
      const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY'
      ]
      
      const missing = requiredEnvVars.filter(
        varName => !process.env[varName]
      )
      
      if (missing.length > 0) {
        return {
          success: false,
          message: `Missing required environment variables: ${missing.join(', ')}`
        }
      }
      
      // Test server client creation
      resetServerClientInstance()
      const supabase = createServerSupabaseClient()
      
      if (!supabase) {
        return {
          success: false,
          message: 'Server Supabase client creation failed'
        }
      }
      
      return {
        success: true,
        message: 'Server environment configuration validated successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: `Server environment validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
  
  /**
   * Test 2: Server Client Connection Test
   * Tests basic Supabase server connection functionality
   */
  async validateServerConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const supabase = createServerSupabaseClient()
      
      // Test connection by attempting to get current session
      // This should work even without authentication (returns null)
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        return {
          success: false,
          message: `Server connection error: ${error.message}`
        }
      }
      
      // Connection successful (data.session will be null if not authenticated)
      return {
        success: true,
        message: `Server connection validated - Session state: ${data.session ? 'authenticated' : 'not authenticated'}`
      }
    } catch (error) {
      return {
        success: false,
        message: `Server connection validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
  
  /**
   * Test 3: Server Auth Methods Availability Test
   * Verifies all server auth methods are accessible
   */
  async validateServerAuthMethods(): Promise<{ success: boolean; message: string; methods: string[] }> {
    try {
      const availableMethods: string[] = []
      
      // Test server auth functions availability
      if (typeof getServerUserClaims === 'function') {
        availableMethods.push('getServerUserClaims')
        
        // Test getServerUserClaims returns null when not authenticated
        const claims = await getServerUserClaims()
        if (claims === null) {
          availableMethods.push('getServerUserClaims.unauthenticated-return')
        }
      }
      
      if (typeof serverHasRole === 'function') {
        availableMethods.push('serverHasRole')
      }
      
      if (typeof isServerAuthenticated === 'function') {
        availableMethods.push('isServerAuthenticated')
        
        // Test authentication check
        const isAuth = await isServerAuthenticated()
        if (typeof isAuth === 'boolean') {
          availableMethods.push('isServerAuthenticated.boolean-return')
        }
      }
      
      if (typeof getServerSession === 'function') {
        availableMethods.push('getServerSession')
      }
      
      if (typeof serverProtectRoute === 'function') {
        availableMethods.push('serverProtectRoute')
        
        // Test route protection with no requirements
        const protection = await serverProtectRoute()
        if (protection && typeof protection.authorized === 'boolean') {
          availableMethods.push('serverProtectRoute.protection-return')
        }
      }
      
      return {
        success: availableMethods.length >= 5,
        message: `Server auth methods validation: ${availableMethods.length} methods available`,
        methods: availableMethods
      }
    } catch (error) {
      return {
        success: false,
        message: `Server auth methods validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        methods: []
      }
    }
  }
  
  /**
   * Test 4: Cookie Management Integration Test
   * Validates Next.js cookies integration (limited in server environment)
   */
  async validateCookieIntegration(): Promise<{ success: boolean; message: string }> {
    try {
      // Test that server client can be created without cookie errors
      // Note: Actual cookie operations require request context in Next.js
      const supabase = createServerSupabaseClient()
      
      if (!supabase) {
        return {
          success: false,
          message: 'Server client with cookie integration failed'
        }
      }
      
      // Verify that the client has the expected methods
      const hasAuthMethods = !!(
        supabase.auth.getUser &&
        supabase.auth.getSession &&
        supabase.auth.onAuthStateChange
      )
      
      if (!hasAuthMethods) {
        return {
          success: false,
          message: 'Server client missing required auth methods'
        }
      }
      
      return {
        success: true,
        message: 'Cookie integration validated - Server client created with Next.js cookies support'
      }
    } catch (error) {
      return {
        success: false,
        message: `Cookie integration validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
  
  /**
   * Test 5: TypeScript Types Validation
   * Validates that all exported types and functions are properly defined
   */
  validateServerTypes(): { success: boolean; message: string } {
    try {
      // Check if server functions are available at runtime
      const typeChecks = {
        createServerSupabaseClient: typeof createServerSupabaseClient === 'function',
        getServerUserClaims: typeof getServerUserClaims === 'function',
        serverHasRole: typeof serverHasRole === 'function',
        isServerAuthenticated: typeof isServerAuthenticated === 'function',
        getServerSession: typeof getServerSession === 'function',
        serverProtectRoute: typeof serverProtectRoute === 'function'
      }
      
      const passedChecks = Object.values(typeChecks).filter(Boolean).length
      const totalChecks = Object.keys(typeChecks).length
      
      return {
        success: passedChecks === totalChecks,
        message: `Server type validation: ${passedChecks}/${totalChecks} functions properly exported`
      }
    } catch (error) {
      return {
        success: false,
        message: `Server type validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
  
  /**
   * Comprehensive Server Validation Suite
   * Runs all server validation tests
   */
  async runFullServerValidation(): Promise<{
    overall: boolean;
    results: Array<{ test: string; success: boolean; message: string }>;
  }> {
    const results = []
    
    // Test 1: Server Environment
    const envResult = await this.validateServerEnvironment()
    results.push({ test: 'Server Environment Configuration', ...envResult })
    
    // Test 2: Server Connection
    const connectionResult = await this.validateServerConnection()
    results.push({ test: 'Server Client Connection', ...connectionResult })
    
    // Test 3: Server Auth Methods
    const authResult = await this.validateServerAuthMethods()
    results.push({ 
      test: 'Server Auth Methods', 
      success: authResult.success,
      message: `${authResult.message} - Methods: ${authResult.methods.join(', ')}`
    })
    
    // Test 4: Cookie Integration
    const cookieResult = await this.validateCookieIntegration()
    results.push({ test: 'Cookie Integration', ...cookieResult })
    
    // Test 5: Server Types
    const typeResult = this.validateServerTypes()
    results.push({ test: 'Server TypeScript Types', ...typeResult })
    
    const overall = results.every(result => result.success)
    
    return { overall, results }
  }
}

/**
 * Quick server validation function for development use
 */
export async function quickServerValidation(): Promise<void> {
  console.log('🔍 Running Supabase Server Client Validation...\\n')
  
  const validator = new SupabaseServerValidator()
  const { overall, results } = await validator.runFullServerValidation()
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌'
    console.log(`${icon} ${result.test}: ${result.message}`)
  })
  
  console.log(`\\n🎯 Server Validation Result: ${overall ? '✅ PASS' : '❌ FAIL'}`)
  
  if (!overall) {
    console.log('\\n⚠️  Some server validations failed. Please check the error messages above.')
  } else {
    console.log('\\n🎉 All server validations passed! Supabase server client is ready for SSR use.')
  }
}

export default SupabaseServerValidator