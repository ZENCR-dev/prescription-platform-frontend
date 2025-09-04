'use client'

/**
 * AuthStatus - Dev-Step 4.1 AuthProvider Integration Demo
 * 
 * @description Demo component showing AuthProvider usage patterns
 * @usage Can be used in any page to display current authentication status
 * 
 * Examples of AuthProvider integration:
 * - useAuth() - Full auth context access
 * - useAuthUser() - User and claims access
 * - useAuthRole() - Role-based access control
 * - useAuthSession() - Session and loading state
 */

import React from 'react'
import { useAuth, useAuthUser, useAuthRole, useAuthSession } from '@/contexts'

interface AuthStatusProps {
  showDetails?: boolean
  className?: string
}

export default function AuthStatus({ showDetails = false, className = '' }: AuthStatusProps) {
  // Different ways to access auth context
  const { isAuthenticated, signOut, refreshClaims } = useAuth()
  const { user, userClaims } = useAuthUser()
  const { role, isVerified, hasMFA } = useAuthRole()
  const { isLoading, error, clearError } = useAuthSession()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const handleRefreshClaims = async () => {
    try {
      await refreshClaims('auth') // Use auth cache TTL for manual refresh
    } catch (err) {
      console.error('Refresh claims error:', err)
    }
  }

  if (isLoading) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-gray-600">Loading authentication status...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600 mb-2">Authentication Error: {error}</p>
        <button 
          onClick={clearError}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Clear Error
        </button>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <p className="text-yellow-800">Not authenticated</p>
        <p className="text-yellow-600 text-sm mt-1">Please log in to access protected features</p>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-green-800">Authenticated</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleRefreshClaims}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Refresh
          </button>
          <button 
            onClick={handleSignOut}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-green-700">
          <span className="font-medium">Email:</span> {user?.email}
        </p>
        <p className="text-green-700">
          <span className="font-medium">Role:</span> {role || 'Unknown'}
        </p>
        
        <div className="flex gap-4 mt-2">
          <span className={`px-2 py-1 rounded text-xs ${isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isVerified ? 'Verified' : 'Pending Verification'}
          </span>
          <span className={`px-2 py-1 rounded text-xs ${hasMFA ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
            {hasMFA ? 'MFA Enabled' : 'MFA Disabled'}
          </span>
        </div>

        {showDetails && userClaims && (
          <details className="mt-3">
            <summary className="cursor-pointer text-green-600 hover:text-green-800">
              User Claims Details
            </summary>
            <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
              {JSON.stringify(userClaims, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}