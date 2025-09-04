'use client'

/**
 * AuthDebug - Dev-Step 4.1 Development Testing Component
 * 
 * @description Simple debug component for testing AuthProvider integration
 * @usage Add to any page for authentication state debugging
 * @note This is for development testing only - remove in production
 */

import React from 'react'
import { useAuth } from '@/contexts'

export default function AuthDebug() {
  const { 
    isLoading, 
    isAuthenticated, 
    user, 
    userClaims, 
    error, 
    signOut, 
    refreshClaims 
  } = useAuth()

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-100 p-3 rounded-lg shadow-lg text-xs max-w-sm">
        <div className="font-mono">🔄 Auth loading...</div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-100 p-3 rounded-lg shadow-lg text-xs max-w-sm">
      <div className="font-bold mb-2">Auth Debug</div>
      <div className="space-y-1 font-mono">
        <div>Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}</div>
        {user && <div>Email: {user.email}</div>}
        {userClaims && (
          <>
            <div>Role: {userClaims.role}</div>
            <div>Verified: {userClaims.verification_status}</div>
          </>
        )}
        {error && <div className="text-red-600">Error: {error}</div>}
        
        {isAuthenticated && (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => refreshClaims()}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
            >
              Refresh
            </button>
            <button 
              onClick={() => signOut()}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}