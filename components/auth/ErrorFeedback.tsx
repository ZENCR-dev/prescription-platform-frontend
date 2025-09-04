'use client'

/**
 * Enhanced Error Feedback Component - M1.2 Authentication UI
 * 
 * @implements Frontend Lead Dev-Step 3.8 - Error handling & user feedback
 * @design Provides comprehensive error feedback with recovery actions
 * @features Bilingual support, Error categorization, Recovery suggestions, Auto-dismiss
 */

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from './hooks/useLanguage'

export interface ErrorInfo {
  message: string
  code?: string
  type: 'error' | 'warning' | 'info' | 'success'
  recoveryAction?: {
    label: string
    action: () => void
  }
  autoDismiss?: boolean
  dismissAfter?: number // milliseconds
}

interface ErrorFeedbackProps {
  error: ErrorInfo | null
  onDismiss?: () => void
  className?: string
}

export default function ErrorFeedback({ error, onDismiss, className = '' }: ErrorFeedbackProps) {
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  
  // Handle dismiss action
  const handleDismiss = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      setShouldShow(false)
      onDismiss?.()
    }, 300)
  }, [onDismiss])
  
  // Handle error visibility and auto-dismiss
  useEffect(() => {
    if (error) {
      setShouldShow(true)
      // Small delay for smooth animation
      const showTimer = setTimeout(() => setIsVisible(true), 10)
      
      // Auto-dismiss if enabled
      if (error.autoDismiss) {
        const dismissTimer = setTimeout(() => {
          handleDismiss()
        }, error.dismissAfter || 5000)
        
        return () => {
          clearTimeout(showTimer)
          clearTimeout(dismissTimer)
        }
      }
      
      return () => clearTimeout(showTimer)
    } else {
      setIsVisible(false)
      const hideTimer = setTimeout(() => setShouldShow(false), 300)
      return () => clearTimeout(hideTimer)
    }
  }, [error, handleDismiss])
  
  
  if (!error || !shouldShow) return null
  
  // Get appropriate styling based on error type
  const getStyles = () => {
    switch (error.type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-600',
          button: 'text-red-600 hover:text-red-800'
        }
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-600',
          button: 'text-yellow-600 hover:text-yellow-800'
        }
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-600',
          button: 'text-blue-600 hover:text-blue-800'
        }
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: 'text-green-600',
          button: 'text-green-600 hover:text-green-800'
        }
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: 'text-gray-600',
          button: 'text-gray-600 hover:text-gray-800'
        }
    }
  }
  
  const styles = getStyles()
  
  // Get appropriate icon based on error type
  const getIcon = () => {
    switch (error.type) {
      case 'error':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'warning':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'success':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'info':
      default:
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }
  
  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}
        ${className}
      `}
    >
      <div className={`p-4 border rounded-lg ${styles.container}`}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Error Message */}
            <p className="text-sm font-medium">
              {error.message}
            </p>
            
            {/* Error Code */}
            {error.code && (
              <p className="text-xs opacity-75 mt-1">
                {language === 'zh' ? '错误代码' : 'Error Code'}: {error.code}
              </p>
            )}
            
            {/* Recovery Action */}
            {error.recoveryAction && (
              <button
                onClick={error.recoveryAction.action}
                className={`text-sm font-medium underline mt-2 ${styles.button}`}
              >
                {error.recoveryAction.label}
              </button>
            )}
          </div>
          
          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 p-1 rounded-md transition-colors ${styles.button}`}
            aria-label={language === 'zh' ? '关闭' : 'Dismiss'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Enhanced Error Handling Utilities
 * Provides standardized error handling patterns for authentication components
 */
export class AuthErrorHandler {
  static createErrorInfo(
    error: unknown,
    defaultMessage: string,
    language: 'zh' | 'en' = 'zh'
  ): ErrorInfo {
    if (error && typeof error === 'object' && 'message' in error) {
      const authError = error as { message: string; code?: string }
      
      return {
        message: AuthErrorHandler.translateError(authError.message, language) || defaultMessage,
        code: authError.code,
        type: 'error',
        autoDismiss: false
      }
    }
    
    return {
      message: defaultMessage,
      type: 'error',
      autoDismiss: false
    }
  }
  
  static translateError(errorMessage: string, language: 'zh' | 'en'): string | null {
    const errorTranslations: Record<string, Record<'zh' | 'en', string>> = {
      'Invalid login credentials': {
        zh: '登录凭据无效，请检查邮箱和密码',
        en: 'Invalid login credentials'
      },
      'Email not confirmed': {
        zh: '邮箱尚未验证，请查收确认邮件',
        en: 'Email not confirmed'
      },
      'Too many requests': {
        zh: '请求过于频繁，请稍后重试',
        en: 'Too many requests, please try again later'
      },
      'Network error': {
        zh: '网络连接失败，请检查网络设置',
        en: 'Network connection failed'
      },
      'User already registered': {
        zh: '该邮箱已被注册，请使用其他邮箱',
        en: 'User already registered'
      },
      'Password should be at least 8 characters': {
        zh: '密码长度至少为8个字符',
        en: 'Password should be at least 8 characters'
      },
      'Signup requires a valid password': {
        zh: '注册需要有效密码',
        en: 'Signup requires a valid password'
      }
    }
    
    // Try exact match first
    if (errorTranslations[errorMessage]) {
      return errorTranslations[errorMessage][language]
    }
    
    // Try partial matches for common patterns
    for (const [key, translations] of Object.entries(errorTranslations)) {
      if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
        return translations[language]
      }
    }
    
    return null
  }
  
  static createNetworkError(language: 'zh' | 'en'): ErrorInfo {
    return {
      message: language === 'zh' ? '网络连接失败，请检查网络设置后重试' : 'Network connection failed, please check your connection and try again',
      type: 'error',
      code: 'NETWORK_ERROR',
      autoDismiss: false,
      recoveryAction: {
        label: language === 'zh' ? '重试' : 'Retry',
        action: () => window.location.reload()
      }
    }
  }
  
  static createSuccessInfo(message: string): ErrorInfo {
    return {
      message,
      type: 'success',
      autoDismiss: true,
      dismissAfter: 3000
    }
  }
  
  static createWarningInfo(message: string): ErrorInfo {
    return {
      message,
      type: 'warning',
      autoDismiss: true,
      dismissAfter: 5000
    }
  }
}