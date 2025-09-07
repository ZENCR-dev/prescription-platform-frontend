/**
 * Profile Service - M1.2 IRG Integration
 * 
 * @description Profile data service with real view integration
 * @author Frontend Lead
 * @date 2025-09-07
 * @integration Backend M1.3 views → Frontend profile data
 */

import { createBrowserClient } from '@supabase/ssr'
import { FEATURE_FLAGS, getViewName, isIRGMode } from '../../lib/config/feature-flags'
import { UserRole } from '../auth/adapters/types'

export interface ProfileData {
  id: string
  email: string
  full_name: string
  role: UserRole
  license_number?: string
  business_name?: string
  verification_status?: 'pending' | 'verified' | 'rejected'
  profile_status?: 'incomplete' | 'complete' | 'pending_review'
  is_public_profile?: boolean
  created_at: string
  updated_at: string
}

export interface ProfileServiceResult<T> {
  data: T | null
  error: string | null
  fromCache?: boolean
  queryDuration?: number
}

class ProfileService {
  private supabase: any
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()

  constructor() {
    this.supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  /**
   * Get user profile by role using appropriate view
   */
  async getUserProfile(userId: string, role: UserRole): Promise<ProfileServiceResult<ProfileData>> {
    const startTime = performance.now()
    const cacheKey = `profile_${userId}_${role}`
    
    // Check cache first
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      return {
        data: cached,
        error: null,
        fromCache: true,
        queryDuration: performance.now() - startTime
      }
    }

    try {
      const viewName = getViewName(role)
      
      if (isIRGMode()) {
        console.log(`[IRG] Querying view: ${viewName} for user: ${userId}`)
      }

      const { data, error } = await this.supabase
        .from(viewName)
        .select('*')
        .eq('id', userId)
        .single()

      const queryDuration = performance.now() - startTime

      if (error) {
        console.error(`Profile query error for view ${viewName}:`, error)
        return {
          data: null,
          error: error.message,
          queryDuration
        }
      }

      // Cache the result
      this.setCache(cacheKey, data, 300000) // 5 minutes TTL

      // Log for IRG evidence
      if (isIRGMode()) {
        console.log(`[IRG] Profile query success:`, {
          viewName,
          userId: userId.substring(0, 8) + '***', // Partial ID for privacy
          recordFound: !!data,
          queryDuration
        })
      }

      return {
        data,
        error: null,
        queryDuration
      }

    } catch (error) {
      const queryDuration = performance.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      console.error('Profile service error:', errorMessage)
      
      return {
        data: null,
        error: errorMessage,
        queryDuration
      }
    }
  }

  /**
   * Get public profiles (for directory/search)
   */
  async getPublicProfiles(limit: number = 20): Promise<ProfileServiceResult<ProfileData[]>> {
    const startTime = performance.now()
    const cacheKey = `public_profiles_${limit}`
    
    // Check cache first
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      return {
        data: cached,
        error: null,
        fromCache: true,
        queryDuration: performance.now() - startTime
      }
    }

    try {
      const viewName = getViewName('public')
      
      if (isIRGMode()) {
        console.log(`[IRG] Querying public view: ${viewName}`)
      }

      const { data, error } = await this.supabase
        .from(viewName)
        .select('*')
        .eq('is_public_profile', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      const queryDuration = performance.now() - startTime

      if (error) {
        console.error(`Public profiles query error for view ${viewName}:`, error)
        return {
          data: null,
          error: error.message,
          queryDuration
        }
      }

      // Cache the result
      this.setCache(cacheKey, data, 180000) // 3 minutes TTL for public data

      // Validate all records have is_public_profile = true
      const invalidRecords = data?.filter((record: any) => record.is_public_profile !== true) || []
      
      if (invalidRecords.length > 0 && isIRGMode()) {
        console.warn(`[IRG] Invalid public records found:`, invalidRecords.length)
      }

      // Log for IRG evidence
      if (isIRGMode()) {
        console.log(`[IRG] Public profiles query success:`, {
          viewName,
          recordCount: data?.length || 0,
          allValidPublicRecords: invalidRecords.length === 0,
          queryDuration
        })
      }

      return {
        data,
        error: null,
        queryDuration
      }

    } catch (error) {
      const queryDuration = performance.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      console.error('Public profiles service error:', errorMessage)
      
      return {
        data: null,
        error: errorMessage,
        queryDuration
      }
    }
  }

  /**
   * Test view access permissions (IRG validation)
   */
  async testViewAccess(role: UserRole): Promise<ProfileServiceResult<{ hasAccess: boolean; recordCount: number }>> {
    const startTime = performance.now()
    
    try {
      const viewName = getViewName(role)
      
      if (isIRGMode()) {
        console.log(`[IRG] Testing view access: ${viewName} for role: ${role}`)
      }

      const { data, error } = await this.supabase
        .from(viewName)
        .select('id')
        .limit(1)

      const queryDuration = performance.now() - startTime

      if (error) {
        // Access denied or view doesn't exist
        if (isIRGMode()) {
          console.log(`[IRG] View access denied:`, {
            viewName,
            role,
            error: error.message,
            queryDuration
          })
        }

        return {
          data: { hasAccess: false, recordCount: 0 },
          error: error.message,
          queryDuration
        }
      }

      const hasAccess = true
      const recordCount = data?.length || 0

      if (isIRGMode()) {
        console.log(`[IRG] View access granted:`, {
          viewName,
          role,
          hasAccess,
          recordCount,
          queryDuration
        })
      }

      return {
        data: { hasAccess, recordCount },
        error: null,
        queryDuration
      }

    } catch (error) {
      const queryDuration = performance.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      return {
        data: { hasAccess: false, recordCount: 0 },
        error: errorMessage,
        queryDuration
      }
    }
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() > cached.timestamp + cached.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics (IRG monitoring)
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Singleton instance
let profileServiceInstance: ProfileService | null = null

export function getProfileService(): ProfileService {
  if (!profileServiceInstance) {
    profileServiceInstance = new ProfileService()
  }
  return profileServiceInstance
}

export default ProfileService