'use client'

/**
 * Logout Button Component - M1.2 Authentication UI
 * 
 * @implements Frontend Lead Dev-Step 3.8 - Error handling & user feedback
 * @design Provides secure logout functionality with user feedback
 * @features Bilingual support, Loading states, Error handling, Session cleanup
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
// Note: useLanguage could be used for logout text localization if needed

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  showText?: boolean
  onLogoutStart?: () => void
  onLogoutComplete?: () => void
  onLogoutError?: (error: string) => void
}

export default function LogoutButton({
  variant = 'ghost',
  className = '',
  showText = true,
  onLogoutStart,
  onLogoutComplete,
  onLogoutError
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleLogout = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setError('')
    onLogoutStart?.()
      
    try {
      // Sign out from Supabase
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        const errorMessage = signOutError.message || '登出失败，请重试'
        setError(errorMessage)
        onLogoutError?.(errorMessage)
        console.error('Logout error:', signOutError)
        return
      }
      
      // Clear any cached data
      try {
        localStorage.removeItem('rememberEmail')
        // Clear any other cached auth data if needed
      } catch (storageError) {
        console.warn('Failed to clear localStorage:', storageError)
        // Non-critical error, continue with logout
      }
      
      // Success callback
      onLogoutComplete?.()
      
      // Refresh router to clear auth state
      router.refresh()
      
      // Navigate to home page
      router.push('/')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(errorMessage)
      onLogoutError?.(errorMessage)
      console.error('Unexpected logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Button styles based on variant
  const getButtonStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md text-sm`
      case 'secondary':
        return `${baseStyles} px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-md text-sm`
      case 'ghost':
      default:
        return `${baseStyles} px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md text-sm`
    }
  }
  
  return (
    <div className="relative">
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`${getButtonStyles()} ${className}`}
        title={isLoading ? '正在登出...' : '安全登出'}
      >
        {/* Logout Icon */}
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        )}
        
        {/* Button Text */}
        {showText && (
          <span>
            {isLoading ? '登出中...' : '登出'}
          </span>
        )}
      </button>
      
      {/* Error Display */}
      {error && (
        <div className="absolute top-full mt-2 right-0 bg-red-50 border border-red-200 text-red-600 text-xs rounded px-3 py-2 shadow-sm whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  )
}