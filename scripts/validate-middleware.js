#!/usr/bin/env node

/**
 * Middleware Validation Script
 * 
 * Validates that the Next.js App Router structure and middleware integration
 * are correctly configured for Dev-Step 2.1
 */

const fs = require('fs')
const path = require('path')

console.log('🧪 Dev-Step 2.1: Base middleware.ts validation')
console.log('================================================')

const validationResults = {
  passed: 0,
  failed: 0,
  tests: []
}

function test(description, assertion) {
  try {
    const result = assertion()
    if (result) {
      console.log(`✅ ${description}`)
      validationResults.passed++
      validationResults.tests.push({ description, status: 'PASS' })
    } else {
      console.log(`❌ ${description}`)
      validationResults.failed++
      validationResults.tests.push({ description, status: 'FAIL' })
    }
  } catch (error) {
    console.log(`❌ ${description} - ERROR: ${error.message}`)
    validationResults.failed++
    validationResults.tests.push({ description, status: 'ERROR', error: error.message })
  }
}

// Test 1: Next.js App Router Structure
test('Next.js app/ directory exists', () => {
  return fs.existsSync('./app') && fs.statSync('./app').isDirectory()
})

test('Root layout.tsx exists', () => {
  return fs.existsSync('./app/layout.tsx')
})

test('Root page.tsx exists (home page)', () => {
  return fs.existsSync('./app/page.tsx')
})

test('Auth login page exists', () => {
  return fs.existsSync('./app/auth/login/page.tsx')
})

test('Auth register page exists', () => {
  return fs.existsSync('./app/auth/register/page.tsx')
})

test('Protected dashboard page exists', () => {
  return fs.existsSync('./app/dashboard/page.tsx')
})

test('Protected profile page exists', () => {
  return fs.existsSync('./app/profile/page.tsx')
})

// Test 2: Middleware Integration
test('Root middleware.ts exists', () => {
  return fs.existsSync('./middleware.ts')
})

test('Middleware exports Component 1 client', () => {
  const middlewareContent = fs.readFileSync('./middleware.ts', 'utf8')
  return middlewareContent.includes("export { default } from './lib/supabase/middleware'")
})

test('Middleware config matcher is configured', () => {
  const middlewareContent = fs.readFileSync('./middleware.ts', 'utf8')
  return middlewareContent.includes('export const config') && 
         middlewareContent.includes('matcher:')
})

// Test 3: Component 1 Integration
test('Component 1 middleware client exists', () => {
  return fs.existsSync('./lib/supabase/middleware.ts')
})

test('Component 1 browser client exists', () => {
  return fs.existsSync('./lib/supabase/client.ts')
})

test('Component 1 server client exists', () => {
  return fs.existsSync('./lib/supabase/server.ts')
})

// Test 4: Build Configuration
test('TypeScript configuration exists', () => {
  return fs.existsSync('./tsconfig.json')
})

test('Package.json has required scripts', () => {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  return packageJson.scripts && 
         packageJson.scripts.build && 
         packageJson.scripts.dev &&
         packageJson.scripts['type-check']
})

test('Required dependencies installed', () => {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
  return deps['@supabase/ssr'] && 
         deps['@supabase/supabase-js'] &&
         deps['next'] &&
         deps['typescript']
})

// Test 5: Route Structure Validation
test('Public routes use correct Next.js patterns', () => {
  const homeContent = fs.readFileSync('./app/page.tsx', 'utf8')
  const loginContent = fs.readFileSync('./app/auth/login/page.tsx', 'utf8')
  
  return homeContent.includes('export default function') &&
         loginContent.includes("'use client'")
})

test('Protected routes have proper structure', () => {
  const dashboardContent = fs.readFileSync('./app/dashboard/page.tsx', 'utf8')
  const profileContent = fs.readFileSync('./app/profile/page.tsx', 'utf8')
  
  return dashboardContent.includes("'use client'") &&
         profileContent.includes("'use client'")
})

console.log('\n📊 Validation Summary')
console.log('====================')
console.log(`✅ Tests passed: ${validationResults.passed}`)
console.log(`❌ Tests failed: ${validationResults.failed}`)
console.log(`📊 Success rate: ${Math.round((validationResults.passed / (validationResults.passed + validationResults.failed)) * 100)}%`)

if (validationResults.failed === 0) {
  console.log('\n🎉 All validations passed! Dev-Step 2.1 infrastructure is correctly implemented.')
  process.exit(0)
} else {
  console.log('\n⚠️  Some validations failed. Please review the failed tests above.')
  process.exit(1)
}