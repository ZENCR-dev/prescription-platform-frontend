'use client'

/**
 * AuthProvider - M1.2 Dev-Step 4.1 Session Management & Protection
 * 
 * @implements Global authentication state management with onAuthStateChange
 * @integrates Existing lib/supabase/client.ts multi-tier caching system
 * @coordinates Real-time session updates with server-side middleware.ts
 * 
 * Architecture:
 * - Leverages existing getUserClaims() with intelligent caching
 * - Provides React context for component-level auth state access
 * - Coordinates with existing onAuthStateChange server sync mechanism
 * - Minimal performance overhead through cache coordination
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { getUserClaims, type UserClaims, type UserRole } from '@/lib/supabase/client'

// AuthContext interface defining the global authentication state
export interface AuthContextType {
  // Core authentication state
  session: Session | null
  user: User | null
  userClaims: UserClaims | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Authentication methods
  signOut: () => Promise<void>
  refreshClaims: (cacheType?: 'ui' | 'auth' | 'mfa') => Promise<UserClaims | null>
  
  // Role-based access helpers
  hasRole: (role: UserRole) => boolean
  isVerified: boolean
  hasMFA: boolean
  
  // Error state
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userClaims, setUserClaims] = useState<UserClaims | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  // Clear error state
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Refresh user claims with cache coordination
  const refreshClaims = useCallback(async (cacheType: 'ui' | 'auth' | 'mfa' = 'ui'): Promise<UserClaims | null> => {
    try {
      clearError()
      // Use existing getUserClaims with intelligent caching
      const claims = await getUserClaims(cacheType)
      setUserClaims(claims)
      return claims
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh user claims'
      setError(errorMessage)
      console.error('[AuthProvider] Error refreshing claims:', err)
      return null
    }
  }, [clearError])

  // Initialize auth state and set up real-time listeners
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        clearError()

        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }

        if (!mounted) return

        // Update session and user state
        setSession(initialSession)
        setUser(initialSession?.user ?? null)

        // Load user claims if authenticated
        if (initialSession?.user) {
          await refreshClaims('ui') // Use UI cache TTL for initial load
        } else {
          setUserClaims(null)
        }

      } catch (err) {
        if (!mounted) return
        const errorMessage = err instanceof Error ? err.message : 'Authentication initialization failed'
        setError(errorMessage)
        console.error('[AuthProvider] Initialization error:', err)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // Set up auth state change listener
    // Note: This coordinates with existing onAuthStateChange in client.ts for server sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: import('@supabase/supabase-js').AuthChangeEvent, newSession: Session | null) => {
      if (!mounted) return

      try {
        console.log('[AuthProvider] Auth state change:', event, { hasSession: !!newSession })
        
        // Update session and user state
        setSession(newSession)
        setUser(newSession?.user ?? null)
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            if (newSession?.user) {
              // Refresh claims when user signs in or token refreshes
              await refreshClaims('ui')
            }
            break
            
          case 'SIGNED_OUT':
            // Clear all auth state on sign out
            setUserClaims(null)
            clearError()
            break
            
          case 'USER_UPDATED':
            // Refresh claims when user metadata updates
            if (newSession?.user) {
              await refreshClaims('auth') // Use auth cache TTL for user updates
            }
            break
        }
        
      } catch (err) {
        if (!mounted) return
        const errorMessage = err instanceof Error ? err.message : 'Auth state change handling failed'
        setError(errorMessage)
        console.error('[AuthProvider] Auth state change error:', err)
      }
    })

    // Initialize authentication
    initializeAuth()

    // Cleanup function
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [refreshClaims, clearError, supabase.auth])

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      clearError()
      setIsLoading(true)
      
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        throw signOutError
      }
      
      // Auth state will be cleared via onAuthStateChange listener
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed'
      setError(errorMessage)
      console.error('[AuthProvider] Sign out error:', err)
      // Don't re-throw - allow UI to show error state instead
    } finally {
      setIsLoading(false)
    }
  }, [clearError, supabase.auth])

  // Role-based access helpers
  const hasRole = useCallback((role: UserRole): boolean => {
    return userClaims?.role === role
  }, [userClaims])

  const isVerified = userClaims?.verification_status === 'verified'
  const hasMFA = userClaims?.aal === 'aal2'
  const isAuthenticated = !!session && !!user

  // Context value
  const contextValue: AuthContextType = {
    // Core state
    session,
    user,
    userClaims,
    isLoading,
    isAuthenticated,
    
    // Methods
    signOut,
    refreshClaims,
    
    // Helpers
    hasRole,
    isVerified,
    hasMFA,
    
    // Error handling
    error,
    clearError
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Additional hook for accessing specific auth properties
export function useAuthUser() {
  const { user, userClaims, isAuthenticated } = useAuth()
  return { user, userClaims, isAuthenticated }
}

export function useAuthRole() {
  const { userClaims, hasRole, isVerified, hasMFA } = useAuth()
  return { 
    role: userClaims?.role || null, 
    hasRole, 
    isVerified, 
    hasMFA 
  }
}

export function useAuthSession() {
  const { session, isLoading, error, clearError } = useAuth()
  return { session, isLoading, error, clearError }
}