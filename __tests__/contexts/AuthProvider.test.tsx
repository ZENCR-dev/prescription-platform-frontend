/**
 * AuthProvider Test Suite - M1.2 Dev-Step 4.1
 * 
 * @description Comprehensive testing for AuthProvider functionality
 * @tests onAuthStateChange response, session state sync, cache coordination, error handling
 * @verifies Integration with existing middleware.ts and getUserClaims system
 */

import React from 'react'
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import AuthProvider, { useAuth } from '@/contexts/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { getUserClaims } from '@/lib/supabase/client'
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js'

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
  getUserClaims: jest.fn()
}))

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockGetUserClaims = getUserClaims as jest.MockedFunction<typeof getUserClaims>

// Mock user data
const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    role: 'tcm_practitioner',
    license_number: 'TCM-12345',
    business_name: 'Test TCM Clinic',
    verification_status: 'verified'
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00Z',
  email_confirmed_at: '2023-01-01T00:00:00Z'
}

const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() / 1000 + 3600,
  token_type: 'bearer',
  user: mockUser
}

const mockUserClaims = {
  role: 'tcm_practitioner' as const,
  license_number: 'TCM-12345',
  business_name: 'Test TCM Clinic',
  verification_status: 'verified' as const,
  aal: 'aal1' as const
}

// Test component that uses AuthProvider
function TestComponent() {
  const { 
    session, 
    user, 
    userClaims, 
    isLoading, 
    isAuthenticated, 
    signOut, 
    refreshClaims, 
    hasRole, 
    isVerified, 
    hasMFA, 
    error, 
    clearError 
  } = useAuth()

  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="email">{user?.email || 'No email'}</div>
      <div data-testid="role">{userClaims?.role || 'No role'}</div>
      <div data-testid="verified">{isVerified.toString()}</div>
      <div data-testid="mfa">{hasMFA.toString()}</div>
      <div data-testid="has-tcm-role">{hasRole('tcm_practitioner').toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      
      <button onClick={() => signOut()} data-testid="signout-btn">Sign Out</button>
      <button onClick={() => refreshClaims('auth')} data-testid="refresh-btn">Refresh</button>
      <button onClick={() => clearError()} data-testid="clear-error-btn">Clear Error</button>
    </div>
  )
}

describe('AuthProvider', () => {
  let mockAuth: any
  let mockAuthStateChangeCallback: (event: AuthChangeEvent, session: Session | null) => void

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Setup auth state change callback capture
    mockAuthStateChangeCallback = jest.fn()
    
    mockAuth = {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockImplementation((callback) => {
        mockAuthStateChangeCallback = callback
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      }),
      signOut: jest.fn().mockResolvedValue({ error: null })
    }

    mockCreateClient.mockReturnValue({
      auth: mockAuth
    } as any)

    mockGetUserClaims.mockResolvedValue(null)
  })

  describe('Initialization', () => {
    it('should initialize with loading state', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Initially should be loading
      expect(screen.getByTestId('loading')).toHaveTextContent('true')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })
    })

    it('should handle initial session correctly', async () => {
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: mockSession }, 
        error: null 
      })
      mockGetUserClaims.mockResolvedValue(mockUserClaims)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
        expect(screen.getByTestId('email')).toHaveTextContent('test@example.com')
        expect(screen.getByTestId('role')).toHaveTextContent('tcm_practitioner')
        expect(screen.getByTestId('verified')).toHaveTextContent('true')
        expect(screen.getByTestId('has-tcm-role')).toHaveTextContent('true')
      })

      // Verify getUserClaims was called with UI cache type
      expect(mockGetUserClaims).toHaveBeenCalledWith('ui')
    })

    it('should handle initialization errors gracefully', async () => {
      const errorMessage = 'Session initialization failed'
      mockAuth.getSession.mockRejectedValue(new Error(errorMessage))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage)
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
      })
    })
  })

  describe('Auth State Changes', () => {
    it('should handle SIGNED_IN event', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })

      // Clear previous calls
      mockGetUserClaims.mockClear()
      mockGetUserClaims.mockResolvedValue(mockUserClaims)

      // Simulate sign in
      await act(async () => {
        await mockAuthStateChangeCallback('SIGNED_IN', mockSession)
      })

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
        expect(screen.getByTestId('email')).toHaveTextContent('test@example.com')
        expect(screen.getByTestId('role')).toHaveTextContent('tcm_practitioner')
      })

      // Verify getUserClaims was called with UI cache type for sign in
      expect(mockGetUserClaims).toHaveBeenCalledWith('ui')
    })

    it('should handle SIGNED_OUT event', async () => {
      // Start with authenticated state
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: mockSession }, 
        error: null 
      })
      mockGetUserClaims.mockResolvedValue(mockUserClaims)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
      })

      // Simulate sign out
      await act(async () => {
        await mockAuthStateChangeCallback('SIGNED_OUT', null)
      })

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
        expect(screen.getByTestId('email')).toHaveTextContent('No email')
        expect(screen.getByTestId('role')).toHaveTextContent('No role')
        expect(screen.getByTestId('verified')).toHaveTextContent('false')
      })
    })

    it('should handle USER_UPDATED event', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })

      // Clear previous calls and setup new claims
      mockGetUserClaims.mockClear()
      const updatedClaims = { ...mockUserClaims, verification_status: 'pending' as const }
      mockGetUserClaims.mockResolvedValue(updatedClaims)

      // Simulate user update
      await act(async () => {
        await mockAuthStateChangeCallback('USER_UPDATED', mockSession)
      })

      // Verify getUserClaims was called with auth cache type for user updates
      expect(mockGetUserClaims).toHaveBeenCalledWith('auth')
    })

    it('should handle TOKEN_REFRESHED event', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })

      // Clear previous calls
      mockGetUserClaims.mockClear()
      mockGetUserClaims.mockResolvedValue(mockUserClaims)

      // Simulate token refresh
      await act(async () => {
        await mockAuthStateChangeCallback('TOKEN_REFRESHED', mockSession)
      })

      // Verify getUserClaims was called with UI cache type for token refresh
      expect(mockGetUserClaims).toHaveBeenCalledWith('ui')
    })
  })

  describe('Authentication Actions', () => {
    it('should handle sign out', async () => {
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: mockSession }, 
        error: null 
      })
      mockGetUserClaims.mockResolvedValue(mockUserClaims)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
      })

      fireEvent.click(screen.getByTestId('signout-btn'))

      expect(mockAuth.signOut).toHaveBeenCalled()
    })

    it('should handle sign out errors', async () => {
      const errorMessage = 'Sign out failed'
      mockAuth.signOut.mockRejectedValue(new Error(errorMessage))
      
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: mockSession }, 
        error: null 
      })
      mockGetUserClaims.mockResolvedValue(mockUserClaims)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
      })

      fireEvent.click(screen.getByTestId('signout-btn'))

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage)
      })
    })

    it('should handle refresh claims', async () => {
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: mockSession }, 
        error: null 
      })
      mockGetUserClaims.mockResolvedValue(mockUserClaims)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
      })

      // Clear previous calls
      mockGetUserClaims.mockClear()
      mockGetUserClaims.mockResolvedValue(mockUserClaims)

      fireEvent.click(screen.getByTestId('refresh-btn'))

      // Verify getUserClaims was called with auth cache type
      expect(mockGetUserClaims).toHaveBeenCalledWith('auth')
    })

    it('should handle clear error', async () => {
      const errorMessage = 'Test error'
      mockAuth.getSession.mockRejectedValue(new Error(errorMessage))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage)
      })

      fireEvent.click(screen.getByTestId('clear-error-btn'))

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('No error')
      })
    })
  })

  describe('Role-based Access Control', () => {
    it('should correctly identify user roles', async () => {
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: mockSession }, 
        error: null 
      })
      mockGetUserClaims.mockResolvedValue(mockUserClaims)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('has-tcm-role')).toHaveTextContent('true')
        expect(screen.getByTestId('verified')).toHaveTextContent('true')
        expect(screen.getByTestId('mfa')).toHaveTextContent('false') // aal1 = no MFA
      })
    })

    it('should handle MFA status correctly', async () => {
      const mfaClaims = { ...mockUserClaims, aal: 'aal2' as const }
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: mockSession }, 
        error: null 
      })
      mockGetUserClaims.mockResolvedValue(mfaClaims)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('mfa')).toHaveTextContent('true') // aal2 = MFA enabled
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle getUserClaims errors', async () => {
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: mockSession }, 
        error: null 
      })
      mockGetUserClaims.mockRejectedValue(new Error('Claims fetch failed'))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Claims fetch failed')
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true') // Still authenticated
      })
    })

    it('should handle auth state change errors', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
      })

      // Simulate auth state change error
      mockGetUserClaims.mockRejectedValue(new Error('State change error'))

      await act(async () => {
        await mockAuthStateChangeCallback('SIGNED_IN', mockSession)
      })

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('State change error')
      })
    })
  })

  describe('Cleanup', () => {
    it('should cleanup subscriptions on unmount', () => {
      const mockUnsubscribe = jest.fn()
      mockAuth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } }
      })

      const { unmount } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })
})