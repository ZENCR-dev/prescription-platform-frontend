import { describe, it, expect } from '@jest/globals'
import { supabase } from '../lib/supabase'

describe('Supabase Connection Test', () => {
  it('should connect to Supabase successfully', async () => {
    try {
      // Test basic connection by getting session
      const { data, error } = await supabase.auth.getSession()
      
      // Connection successful if no network errors
      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.session).toBeNull() // Should be null for unauthenticated user
    } catch (error) {
      // If there's a network error, the test should fail
      fail(`Supabase connection failed: ${error}`)
    }
  })

  it('should have auth client configured', () => {
    expect(supabase.auth).toBeDefined()
    expect(typeof supabase.auth.signInWithPassword).toBe('function')
    expect(typeof supabase.auth.signUp).toBe('function')
    expect(typeof supabase.auth.signOut).toBe('function')
  })

  it('should have database client configured', () => {
    expect(supabase).toHaveProperty('from')
    expect(typeof supabase.from).toBe('function')
  })

  it('should have storage client configured', () => {
    expect(supabase).toHaveProperty('storage')
    expect(supabase.storage).toBeDefined()
  })
})