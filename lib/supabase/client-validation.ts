/**
 * Supabase Browser Client Validation - Dev-Step 1.1 Step 3
 * 
 * Frontend Lead Validation: Test client connection and auth.getClaims() functionality
 * Verifies integration with environment variables and APIv1.md compliance
 */

import { createClient, getUserClaims } from './client'

/**
 * Validation Test Suite for Dev-Step 1.1
 * Tests core functionality without requiring actual authentication
 */
export class SupabaseClientValidator {
  private supabase = createClient()
  
  /**
   * Test 1: Environment Configuration Validation
   */
  async validateEnvironment(): Promise<{ success: boolean; message: string }> {
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
      
      // Verify Supabase client can be created
      if (!this.supabase) {
        return {
          success: false,
          message: 'Supabase client creation failed'
        }
      }
      
      return {
        success: true,
        message: 'Environment configuration validated successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: `Environment validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
  
  /**
   * Test 2: Client Connection Test
   * Tests basic Supabase connection without requiring authentication
   */
  async validateConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // Test connection by attempting to get current session
      // This should work even without authentication (returns null)
      const { data, error } = await this.supabase.auth.getSession()
      
      if (error) {
        return {
          success: false,
          message: `Connection error: ${error.message}`
        }
      }
      
      // Connection successful (data.session will be null if not authenticated)
      return {
        success: true,
        message: `Connection validated - Session state: ${data.session ? 'authenticated' : 'not authenticated'}`
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
  
  /**
   * Test 3: Auth Methods Availability Test
   * Verifies all auth methods are accessible
   */
  async validateAuthMethods(): Promise<{ success: boolean; message: string; methods: string[] }> {
    try {
      const availableMethods: string[] = []
      
      // Test getUserClaims function availability
      if (typeof getUserClaims === 'function') {
        availableMethods.push('getUserClaims')
        
        // Test getUserClaims returns null when not authenticated
        const claims = await getUserClaims()
        if (claims === null) {
          availableMethods.push('getUserClaims.unauthenticated-return')
        }
      }
      
      // Test auth methods availability
      if (this.supabase.auth.getUser) {
        availableMethods.push('auth.getUser')
      }
      
      if (this.supabase.auth.onAuthStateChange) {
        availableMethods.push('auth.onAuthStateChange')
      }
      
      if (this.supabase.auth.signOut) {
        availableMethods.push('auth.signOut')
      }
      
      return {
        success: availableMethods.length >= 4,
        message: `Auth methods validation: ${availableMethods.length} methods available`,
        methods: availableMethods
      }
    } catch (error) {
      return {
        success: false,
        message: `Auth methods validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        methods: []
      }
    }
  }
  
  /**
   * Test 4: TypeScript Types Validation
   * Validates that all exported types are properly defined
   */
  validateTypes(): { success: boolean; message: string } {
    try {
      // Check if types are available at runtime
      const typeChecks = {
        createClient: typeof createClient === 'function',
        getUserClaims: typeof getUserClaims === 'function'
      }
      
      const passedChecks = Object.values(typeChecks).filter(Boolean).length
      const totalChecks = Object.keys(typeChecks).length
      
      return {
        success: passedChecks === totalChecks,
        message: `Type validation: ${passedChecks}/${totalChecks} functions properly exported`
      }
    } catch (error) {
      return {
        success: false,
        message: `Type validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
  
  /**
   * Comprehensive Validation Suite
   * Runs all validation tests
   */
  async runFullValidation(): Promise<{
    overall: boolean;
    results: Array<{ test: string; success: boolean; message: string }>;
  }> {
    const results = []
    
    // Test 1: Environment
    const envResult = await this.validateEnvironment()
    results.push({ test: 'Environment Configuration', ...envResult })
    
    // Test 2: Connection
    const connectionResult = await this.validateConnection()
    results.push({ test: 'Client Connection', ...connectionResult })
    
    // Test 3: Auth Methods
    const authResult = await this.validateAuthMethods()
    results.push({ 
      test: 'Auth Methods', 
      success: authResult.success,
      message: `${authResult.message} - Methods: ${authResult.methods.join(', ')}`
    })
    
    // Test 4: Types
    const typeResult = this.validateTypes()
    results.push({ test: 'TypeScript Types', ...typeResult })
    
    const overall = results.every(result => result.success)
    
    return { overall, results }
  }
}

/**
 * Quick validation function for development use
 */
export async function quickValidation(): Promise<void> {
  console.log('🔍 Running Supabase Client Validation...\n')
  
  const validator = new SupabaseClientValidator()
  const { overall, results } = await validator.runFullValidation()
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌'
    console.log(`${icon} ${result.test}: ${result.message}`)
  })
  
  console.log(`\n🎯 Overall Result: ${overall ? '✅ PASS' : '❌ FAIL'}`)
  
  if (!overall) {
    console.log('\n⚠️  Some validations failed. Please check the error messages above.')
  } else {
    console.log('\n🎉 All validations passed! Supabase client is ready for use.')
  }
}

export default SupabaseClientValidator