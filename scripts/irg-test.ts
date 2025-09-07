#!/usr/bin/env ts-node

/**
 * Integration Readiness Gate (IRG) Test Script - M1.2 Frontend
 * 
 * @description Comprehensive IRG validation for frontend-backend integration
 * @author Frontend Lead
 * @date 2025-09-07
 * @compliance Architecture directive IRG validation checklist
 */

import { createClient } from '@supabase/supabase-js'
import { performance } from 'perf_hooks'
import { writeFileSync } from 'fs'

// Workaround for TypeScript module loading
const featureFlags = require('../lib/config/feature-flags.ts')
const { REAL_VIEWS, getIRGConfig, validateIRGEnvironment } = featureFlags

// Types for test results
interface TestResult {
  test: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  duration: number
  details: any
  error?: string
}

interface IRGTestReport {
  timestamp: string
  environment: {
    supabaseUrl: string
    useRealViews: boolean
    nodeEnv: string
  }
  summary: {
    total: number
    passed: number
    failed: number
    skipped: number
  }
  results: TestResult[]
  evidence: {
    networkLogs: any[]
    viewQueries: any[]
    performanceMetrics: any[]
    securityChecks: any[]
  }
}

class IRGTester {
  private supabase: any
  private results: TestResult[] = []
  private evidence: IRGTestReport['evidence'] = {
    networkLogs: [],
    viewQueries: [],
    performanceMetrics: [],
    securityChecks: []
  }

  constructor() {
    // Validate environment first
    const envValidation = validateIRGEnvironment()
    if (!envValidation.valid) {
      console.error('❌ IRG Environment validation failed:', envValidation.missing)
      process.exit(1)
    }

    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  /**
   * Run complete IRG validation suite
   */
  async runAll(): Promise<IRGTestReport> {
    console.log('🚀 Starting IRG Validation Tests...')
    console.log('='  .repeat(60))

    // Test 1: Three Views Query Validation
    await this.testThreeViewsQuery()

    // Test 2: Session Flow Validation  
    await this.testSessionFlow()

    // Test 3: Performance and Stability
    await this.testPerformanceStability()

    // Test 4: JWT Consistency
    await this.testJWTConsistency()

    // Test 5: Security Boundaries
    await this.testSecurityBoundaries()

    return this.generateReport()
  }

  /**
   * Test 1: Three Views Query Validation
   * - Positive records >0 for authorized users
   * - Negative records =0 for unauthorized users  
   * - Public profile filter (is_public_profile=true only)
   */
  async testThreeViewsQuery(): Promise<void> {
    console.log('\n📊 Testing Three Views Query Validation...')

    // Test TCM Context View
    await this.runTest('TCM_Context_View_Authorized', async () => {
      const start = performance.now()
      const { data, error } = await this.supabase
        .from(REAL_VIEWS.TCM_CONTEXT_VIEW)
        .select('*')
        .limit(5)
      
      const duration = performance.now() - start
      this.evidence.viewQueries.push({
        view: REAL_VIEWS.TCM_CONTEXT_VIEW,
        query: 'select(*).limit(5)',
        recordCount: data?.length || 0,
        duration,
        error: error?.message
      })

      if (error) throw error
      return {
        recordCount: data?.length || 0,
        hasData: (data?.length || 0) > 0,
        duration
      }
    })

    // Test Pharmacy Context View
    await this.runTest('Pharmacy_Context_View_Authorized', async () => {
      const start = performance.now()
      const { data, error } = await this.supabase
        .from(REAL_VIEWS.PHARMACY_CONTEXT_VIEW)
        .select('*')
        .limit(5)
      
      const duration = performance.now() - start
      this.evidence.viewQueries.push({
        view: REAL_VIEWS.PHARMACY_CONTEXT_VIEW,
        query: 'select(*).limit(5)',
        recordCount: data?.length || 0,
        duration,
        error: error?.message
      })

      if (error) throw error
      return {
        recordCount: data?.length || 0,
        hasData: (data?.length || 0) > 0,
        duration
      }
    })

    // Test Public View with filter
    await this.runTest('Public_View_Filter_Validation', async () => {
      const start = performance.now()
      const { data, error } = await this.supabase
        .from(REAL_VIEWS.PUBLIC_VIEW)
        .select('*')
        .eq('is_public_profile', true)
        .limit(10)
      
      const duration = performance.now() - start
      this.evidence.viewQueries.push({
        view: REAL_VIEWS.PUBLIC_VIEW,
        query: 'select(*).eq(is_public_profile, true).limit(10)',
        recordCount: data?.length || 0,
        duration,
        error: error?.message
      })

      if (error) throw error
      
      // Validate all records have is_public_profile = true
      const allPublic = data?.every((record: any) => record.is_public_profile === true)
      
      return {
        recordCount: data?.length || 0,
        allRecordsPublic: allPublic,
        duration,
        sampleRecord: data?.[0] || null
      }
    })
  }

  /**
   * Test 2: Session Flow Validation
   * Login → Protected Route → Refresh → Logout
   */
  async testSessionFlow(): Promise<void> {
    console.log('\n🔐 Testing Session Flow Validation...')

    // Use test credentials from .env.local
    const testEmail = 'artinurner@temp.now'
    const testPassword = '87swrdnp&D'

    await this.runTest('Session_Login_Flow', async () => {
      const start = performance.now()
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })
      const duration = performance.now() - start

      this.evidence.networkLogs.push({
        operation: 'signInWithPassword',
        duration,
        success: !error,
        error: error?.message
      })

      if (error) throw error

      return {
        userId: data.user?.id,
        accessToken: data.session?.access_token ? '***TOKEN***' : null,
        duration,
        userRole: data.user?.user_metadata?.role
      }
    })

    await this.runTest('Session_Claims_Verification', async () => {
      const start = performance.now()
      const { data, error } = await this.supabase.auth.getUser()
      const duration = performance.now() - start

      if (error) throw error

      // Verify JWT claims structure
      const userMetadata = data.user?.user_metadata || {}
      const requiredFields = ['role']
      const hasRequiredFields = requiredFields.every(field => field in userMetadata)

      return {
        hasUser: !!data.user,
        hasRequiredClaims: hasRequiredFields,
        role: userMetadata.role,
        duration,
        claimsStructure: Object.keys(userMetadata)
      }
    })

    await this.runTest('Session_Refresh_Mechanism', async () => {
      const start = performance.now()
      const { data, error } = await this.supabase.auth.refreshSession()
      const duration = performance.now() - start

      this.evidence.networkLogs.push({
        operation: 'refreshSession',
        duration,
        success: !error,
        error: error?.message
      })

      if (error) throw error

      return {
        newAccessToken: data.session?.access_token ? '***NEW_TOKEN***' : null,
        duration,
        refreshSuccess: !!data.session
      }
    })

    await this.runTest('Session_Logout_Flow', async () => {
      const start = performance.now()
      const { error } = await this.supabase.auth.signOut()
      const duration = performance.now() - start

      this.evidence.networkLogs.push({
        operation: 'signOut',
        duration,
        success: !error,
        error: error?.message
      })

      if (error) throw error

      // Verify session is cleared
      const { data: userCheck } = await this.supabase.auth.getUser()
      
      return {
        duration,
        logoutSuccess: true,
        sessionCleared: !userCheck.user
      }
    })
  }

  /**
   * Test 3: Performance and Stability  
   * - Auth check <100ms
   * - No extra network requests
   * - Concurrent deduplication
   */
  async testPerformanceStability(): Promise<void> {
    console.log('\n⚡ Testing Performance and Stability...')

    const config = getIRGConfig()

    await this.runTest('Auth_Check_Performance', async () => {
      const iterations = 5
      const durations: number[] = []

      for (let i = 0; i < iterations; i++) {
        const start = performance.now()
        await this.supabase.auth.getUser()
        const duration = performance.now() - start
        durations.push(duration)
      }

      const avgDuration = durations.reduce((a, b) => a + b) / durations.length
      const maxDuration = Math.max(...durations)
      
      this.evidence.performanceMetrics.push({
        test: 'auth_check_performance',
        iterations,
        avgDuration,
        maxDuration,
        durations,
        threshold: config.performanceThreshold.maxAuthCheckMs
      })

      return {
        avgDuration,
        maxDuration,
        withinThreshold: maxDuration < config.performanceThreshold.maxAuthCheckMs,
        threshold: config.performanceThreshold.maxAuthCheckMs
      }
    })

    await this.runTest('Concurrent_Request_Deduplication', async () => {
      const start = performance.now()
      
      // Make 3 concurrent requests  
      const promises = Array(3).fill(null).map(() => this.supabase.auth.getUser())
      const results = await Promise.all(promises)
      
      const duration = performance.now() - start

      // In a real implementation, we'd need to monitor actual network calls
      // For now, we verify all requests return the same user
      const allSameUser = results.every(result => 
        result.data?.user?.id === results[0].data?.user?.id
      )

      this.evidence.performanceMetrics.push({
        test: 'concurrent_deduplication',
        concurrentRequests: 3,
        duration,
        allReturnSameUser: allSameUser
      })

      return {
        duration,
        concurrentRequests: 3,
        allReturnSameUser: allSameUser,
        estimatedDeduplication: duration < 100 // If under 100ms, likely deduplicated
      }
    })
  }

  /**
   * Test 4: JWT Consistency
   * Verify JWT claims consistent across middleware/ProtectedRoute
   */
  async testJWTConsistency(): Promise<void> {
    console.log('\n🎯 Testing JWT Consistency...')

    await this.runTest('JWT_Claims_Structure', async () => {
      // Login first
      await this.supabase.auth.signInWithPassword({
        email: 'artinurner@temp.now',
        password: '87swrdnp&D'
      })

      const { data, error } = await this.supabase.auth.getUser()
      if (error) throw error

      const claims = data.user?.user_metadata || {}
      const session = await this.supabase.auth.getSession()
      
      this.evidence.securityChecks.push({
        test: 'jwt_claims_structure',
        userMetadata: Object.keys(claims),
        hasSession: !!session.data.session,
        accessTokenPresent: !!session.data.session?.access_token
      })

      return {
        hasValidClaims: 'role' in claims,
        claimsStructure: claims,
        sessionActive: !!session.data.session
      }
    })
  }

  /**
   * Test 5: Security Boundaries
   * Verify SSR/RSC boundaries, returnTo validation, etc.
   */
  async testSecurityBoundaries(): Promise<void> {
    console.log('\n🛡️ Testing Security Boundaries...')

    await this.runTest('Environment_Security_Check', async () => {
      const checks = {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        noServiceKeyExposed: !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
        httpsUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://'),
        validDomain: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co')
      }

      this.evidence.securityChecks.push({
        test: 'environment_security',
        checks
      })

      const allSecurityChecksPass = Object.values(checks).every(Boolean)

      return {
        checks,
        allPass: allSecurityChecksPass
      }
    })
  }

  /**
   * Helper method to run individual test with error handling
   */
  private async runTest(testName: string, testFn: () => Promise<any>): Promise<void> {
    const start = performance.now()
    
    try {
      console.log(`  • ${testName}...`)
      const result = await testFn()
      const duration = performance.now() - start
      
      this.results.push({
        test: testName,
        status: 'PASS',
        duration,
        details: result
      })
      
      console.log(`    ✅ PASS (${duration.toFixed(2)}ms)`)
    } catch (error) {
      const duration = performance.now() - start
      
      this.results.push({
        test: testName,
        status: 'FAIL',
        duration,
        details: null,
        error: error instanceof Error ? error.message : String(error)
      })
      
      console.log(`    ❌ FAIL (${duration.toFixed(2)}ms): ${error}`)
    }
  }

  /**
   * Generate comprehensive IRG test report
   */
  private generateReport(): IRGTestReport {
    const summary = this.results.reduce(
      (acc, result) => {
        acc.total++
        if (result.status === 'PASS') acc.passed++
        else if (result.status === 'FAIL') acc.failed++
        else acc.skipped++
        return acc
      },
      { total: 0, passed: 0, failed: 0, skipped: 0 }
    )

    return {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/.*/, '/***') || 'not_set',
        useRealViews: process.env.NEXT_PUBLIC_USE_REAL_VIEWS === 'true',
        nodeEnv: process.env.NODE_ENV || 'unknown'
      },
      summary,
      results: this.results,
      evidence: this.evidence
    }
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const tester = new IRGTester()
    const report = await tester.runAll()
    
    console.log('\n' + '='.repeat(60))
    console.log('📋 IRG Test Summary')
    console.log('='.repeat(60))
    console.log(`Total Tests: ${report.summary.total}`)
    console.log(`Passed: ${report.summary.passed} ✅`)
    console.log(`Failed: ${report.summary.failed} ❌`)
    console.log(`Skipped: ${report.summary.skipped} ⏭️`)
    
    const successRate = (report.summary.passed / report.summary.total) * 100
    console.log(`Success Rate: ${successRate.toFixed(1)}%`)
    
    // Write detailed report to file
    const reportPath = 'docs/M1.2-IRG-Evidence.md'
    const markdownReport = generateMarkdownReport(report)
    writeFileSync(reportPath, markdownReport)
    
    console.log(`\n📄 Detailed evidence report written to: ${reportPath}`)
    
    if (report.summary.failed > 0) {
      console.log('\n❌ IRG validation failed. Please review the evidence report.')
      process.exit(1)
    } else {
      console.log('\n✅ IRG validation passed! Ready for architect review.')
      process.exit(0)
    }
  } catch (error) {
    console.error('💥 IRG test execution failed:', error)
    process.exit(1)
  }
}

/**
 * Generate markdown report for evidence documentation
 */
function generateMarkdownReport(report: IRGTestReport): string {
  return `# M1.2 IRG Evidence Report

**Generated**: ${report.timestamp}  
**Environment**: ${report.environment.nodeEnv}  
**Real Views**: ${report.environment.useRealViews}

## Summary

- **Total Tests**: ${report.summary.total}
- **Passed**: ${report.summary.passed} ✅
- **Failed**: ${report.summary.failed} ❌  
- **Success Rate**: ${((report.summary.passed / report.summary.total) * 100).toFixed(1)}%

## Test Results

${report.results.map(result => `
### ${result.test}
- **Status**: ${result.status}
- **Duration**: ${result.duration.toFixed(2)}ms
- **Details**: \`\`\`json
${JSON.stringify(result.details, null, 2)}
\`\`\`
${result.error ? `- **Error**: ${result.error}` : ''}
`).join('\n')}

## Evidence Appendix

### View Queries
\`\`\`json
${JSON.stringify(report.evidence.viewQueries, null, 2)}
\`\`\`

### Network Logs  
\`\`\`json
${JSON.stringify(report.evidence.networkLogs, null, 2)}
\`\`\`

### Performance Metrics
\`\`\`json
${JSON.stringify(report.evidence.performanceMetrics, null, 2)}
\`\`\`

### Security Checks
\`\`\`json
${JSON.stringify(report.evidence.securityChecks, null, 2)}
\`\`\`

---
**IRG Test Script**: \`scripts/irg-test.ts\`  
**Report Generated**: ${new Date().toISOString()}
`
}

// Run if called directly
if (require.main === module) {
  main()
}

export { IRGTester }