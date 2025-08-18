import { describe, it, expect } from '@jest/globals'
import fs from 'fs'
import path from 'path'

describe('Next.js 14 Foundation Setup', () => {
  it('should have Next.js configuration file', () => {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js')
    expect(fs.existsSync(nextConfigPath)).toBe(true)
  })

  it('should have TypeScript configuration', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
    expect(fs.existsSync(tsconfigPath)).toBe(true)
    
    // Verify strict mode is enabled
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'))
    expect(tsconfig.compilerOptions.strict).toBe(true)
  })

  it('should have app directory structure', () => {
    const appDirPath = path.join(process.cwd(), 'app')
    expect(fs.existsSync(appDirPath)).toBe(true)
    
    // Check for layout file
    const layoutPath = path.join(appDirPath, 'layout.tsx')
    expect(fs.existsSync(layoutPath)).toBe(true)
  })

  it('should have environment configuration', () => {
    const envPath = path.join(process.cwd(), '.env.local')
    expect(fs.existsSync(envPath)).toBe(true)
  })

  it('should have proper package.json configuration', () => {
    const packagePath = path.join(process.cwd(), 'package.json')
    expect(fs.existsSync(packagePath)).toBe(true)
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    expect(packageJson.dependencies.next).toMatch(/^14/)
    expect(packageJson.dependencies['@supabase/supabase-js']).toBeDefined()
  })
})