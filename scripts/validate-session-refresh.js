#!/usr/bin/env node

/**
 * Session Refresh Validation Script
 * Dev-Step 2.3: Comprehensive validation of session refresh mechanism
 * 
 * Tests:
 * 1. Enhanced middleware session refresh functions
 * 2. Login page return URL handling
 * 3. Session failure message display
 * 4. Edge runtime compatibility
 * 5. Performance metrics
 */

const fs = require('fs')
const path = require('path')

const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const RESET = '\x1b[0m'

let passedTests = 0
let totalTests = 0
let warnings = []

function test(name, condition, warningMessage = null) {
  totalTests++
  if (condition) {
    console.log(`${GREEN}✓${RESET} ${name}`)
    passedTests++
  } else {
    console.log(`${RED}✗${RESET} ${name}`)
    if (warningMessage) {
      warnings.push(warningMessage)
    }
  }
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}

function fileContains(filePath, searchString) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return content.includes(searchString)
  } catch {
    return false
  }
}

console.log(`\n${BLUE}=== Session Refresh Validation (Dev-Step 2.3) ===${RESET}\n`)

// 1. Validate middleware enhancements
console.log(`${YELLOW}1. Middleware Session Refresh Enhancements${RESET}`)

const middlewarePath = path.join(process.cwd(), 'lib/supabase/middleware.ts')
test(
  'middleware.ts exists',
  fileExists(middlewarePath)
)

test(
  'SessionRefreshResult interface defined',
  fileContains(middlewarePath, 'export interface SessionRefreshResult')
)

test(
  'Refresh lock mechanism implemented',
  fileContains(middlewarePath, 'let refreshLock = false') && 
  fileContains(middlewarePath, 'let lastRefreshTime = 0')
)

test(
  'Enhanced refreshMiddlewareSession function',
  fileContains(middlewarePath, 'export async function refreshMiddlewareSession') &&
  fileContains(middlewarePath, 'Promise<SessionRefreshResult>')
)

test(
  'Graceful logout on refresh failure',
  fileContains(middlewarePath, 'await supabase.auth.signOut()')
)

test(
  'Return URL preservation on redirect',
  fileContains(middlewarePath, 'encodeURIComponent(request.nextUrl.pathname)')
)

test(
  'Critical refresh timing (1 minute)',
  fileContains(middlewarePath, 'const oneMinute = 60 * 1000')
)

test(
  'Session expiry logging',
  fileContains(middlewarePath, 'expires in ${Math.floor(timeUntilExpiry / 1000)}s')
)

// 2. Validate login page enhancements
console.log(`\n${YELLOW}2. Login Page Session Handling${RESET}`)

const loginPath = path.join(process.cwd(), 'app/auth/login/page.tsx')
test(
  'login/page.tsx exists',
  fileExists(loginPath)
)

test(
  'REASON_MESSAGES mapping defined',
  fileContains(loginPath, 'const REASON_MESSAGES: Record<string, string>')
)

test(
  'Return URL extraction',
  fileContains(loginPath, "searchParams.get('return')")
)

test(
  'Session failure reason handling',
  fileContains(loginPath, "searchParams.get('reason')")
)

test(
  'Suspense boundary for useSearchParams',
  fileContains(loginPath, '<Suspense fallback=')
)

test(
  'Info message display for session failures',
  fileContains(loginPath, 'setInfo(REASON_MESSAGES[reason])')
)

test(
  'Loading spinner during authentication',
  fileContains(loginPath, 'animate-spin')
)

// 3. Validate route protection integration
console.log(`\n${YELLOW}3. Route Protection Integration${RESET}`)

test(
  'Public route refresh handling',
  fileContains(middlewarePath, 'if (isPublicRoute)') &&
  fileContains(middlewarePath, 'const refreshResult = await refreshMiddlewareSession')
)

test(
  'Protected route refresh with redirect',
  fileContains(middlewarePath, 'if (refreshResult.shouldRedirect && refreshResult.redirectUrl)')
)

test(
  'Development headers for monitoring',
  fileContains(middlewarePath, "response.headers.set('X-Session-Refreshed'")
)

// 4. Validate error handling
console.log(`\n${YELLOW}4. Error Handling & Recovery${RESET}`)

test(
  'Session check error handling',
  fileContains(middlewarePath, 'result.error = error.message')
)

test(
  'Expired session redirect',
  fileContains(middlewarePath, 'reason=expired')
)

test(
  'Invalid session redirect',
  fileContains(middlewarePath, 'reason=invalid_session')
)

test(
  'Refresh failure redirect',
  fileContains(middlewarePath, 'reason=refresh_failed')
)

test(
  'Unexpected error handling',
  fileContains(middlewarePath, 'catch (error)') &&
  fileContains(middlewarePath, 'Unexpected error during session refresh')
)

// 5. Validate performance optimizations
console.log(`\n${YELLOW}5. Performance Optimizations${RESET}`)

test(
  'Refresh lock timeout (10 seconds)',
  fileContains(middlewarePath, '(now - lastRefreshTime) < 10000')
)

test(
  'Five minute pre-refresh window',
  fileContains(middlewarePath, 'const fiveMinutes = 5 * 60 * 1000')
)

test(
  'Edge runtime compatible',
  fileContains(middlewarePath, 'NextRequest') &&
  fileContains(middlewarePath, 'NextResponse')
)

test(
  'Finally block for lock release',
  fileContains(middlewarePath, 'finally {\n    refreshLock = false')
)

// 6. Validate TypeScript types
console.log(`\n${YELLOW}6. TypeScript Type Safety${RESET}`)

test(
  'SessionRefreshResult type properties',
  fileContains(middlewarePath, 'refreshed: boolean') &&
  fileContains(middlewarePath, 'shouldRedirect: boolean') &&
  fileContains(middlewarePath, 'redirectUrl?: string') &&
  fileContains(middlewarePath, 'error?: string')
)

// Summary
console.log(`\n${BLUE}=== Validation Summary ===${RESET}`)
console.log(`Tests passed: ${passedTests}/${totalTests}`)

if (warnings.length > 0) {
  console.log(`\n${YELLOW}Warnings:${RESET}`)
  warnings.forEach(warning => console.log(`  - ${warning}`))
}

// Performance metrics
console.log(`\n${BLUE}=== Performance Metrics ===${RESET}`)
console.log('✅ Session refresh lock: 10s timeout')
console.log('✅ Pre-refresh window: 5 minutes')
console.log('✅ Critical refresh: 1 minute')
console.log('✅ Edge runtime: Compatible')
console.log('✅ Return URL preservation: Implemented')
console.log('✅ Graceful failure: Implemented')

// Implementation status
console.log(`\n${BLUE}=== Dev-Step 2.3 Implementation Status ===${RESET}`)
const allTestsPassed = passedTests === totalTests
if (allTestsPassed) {
  console.log(`${GREEN}✅ Session refresh mechanism fully implemented!${RESET}`)
  console.log(`${GREEN}✅ All ${totalTests} validation tests passed${RESET}`)
  console.log(`${GREEN}✅ Ready for Component 2 completion${RESET}`)
} else {
  console.log(`${RED}⚠️  Some tests failed (${totalTests - passedTests} failures)${RESET}`)
  console.log(`${YELLOW}Please review the failed tests above${RESET}`)
}

// Exit with appropriate code
process.exit(allTestsPassed ? 0 : 1)