/**
 * Loading Overlay Component
 * 
 * @implements Dev-Step 3.9: Enhanced UI States - Professional loading states
 * @description Medical platform-grade loading overlay with semantic hints
 */

import React from 'react'
import { useLanguage } from './hooks/useLanguage'

export interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  semanticHint?: 'credentials' | 'verification' | 'processing' | 'registration' | 'login'
  showProgress?: boolean
  progress?: number // 0-100
  className?: string
}

// Medical-specific loading messages
const loadingMessages = {
  en: {
    credentials: 'Verifying practitioner credentials...',
    verification: 'Securing your medical practice account...',
    processing: 'Processing your request...',
    registration: 'Creating your professional account...',
    login: 'Authenticating your credentials...',
    default: 'Loading...'
  },
  zh: {
    credentials: '验证执业资格中...',
    verification: '保护您的医疗账户中...',
    processing: '处理请求中...',
    registration: '创建专业账户中...',
    login: '验证登录信息中...',
    default: '加载中...'
  }
}

export function LoadingOverlay({
  isLoading,
  message,
  semanticHint,
  showProgress = false,
  progress = 0,
  className = ''
}: LoadingOverlayProps) {
  const { language } = useLanguage()
  
  if (!isLoading) return null
  
  // Get appropriate message based on semantic hint or custom message
  const displayMessage = message || 
    (semanticHint ? loadingMessages[language][semanticHint] : loadingMessages[language].default)
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity ${className}`}>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
        {/* Medical pulse animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Taiji-inspired spinner */}
            <svg 
              className="w-16 h-16 animate-spin text-sage-600" 
              viewBox="0 0 100 100"
            >
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                opacity="0.1"
              />
              <path 
                d="M50,5 A45,45 0 0,1 50,95 A22.5,22.5 0 0,0 50,50 A22.5,22.5 0 0,1 50,5" 
                fill="currentColor" 
                opacity="0.3"
              />
              <circle cx="50" cy="27.5" r="6" fill="currentColor" opacity="0.3"/>
              <circle cx="50" cy="72.5" r="6" fill="white"/>
            </svg>
            
            {/* Pulse effect */}
            <div className="absolute inset-0 animate-ping">
              <div className="w-16 h-16 rounded-full bg-sage-600 opacity-20"></div>
            </div>
          </div>
        </div>
        
        {/* Loading message */}
        <p className="text-center text-gray-700 font-light text-sm mb-2">
          {displayMessage}
        </p>
        
        {/* Progress bar (if enabled) */}
        {showProgress && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sage-500 to-cambridge-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            {progress > 0 && (
              <p className="text-center text-xs text-gray-500 mt-1">
                {Math.round(progress)}%
              </p>
            )}
          </div>
        )}
        
        {/* Medical compliance note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          {language === 'en' 
            ? 'Your data is encrypted and secure'
            : '您的数据已加密并安全保护'}
        </p>
      </div>
    </div>
  )
}

// Skeleton loader component for initial page loads
export interface SkeletonLoaderProps {
  variant?: 'form' | 'button' | 'text' | 'card'
  lines?: number
  animate?: boolean
  className?: string
}

export function SkeletonLoader({
  variant = 'text',
  lines = 1,
  animate = true,
  className = ''
}: SkeletonLoaderProps) {
  const animationClass = animate ? 'animate-pulse' : ''
  
  switch (variant) {
    case 'form':
      return (
        <div className={`space-y-4 ${className}`}>
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className={`h-3 w-20 bg-gray-200 rounded mb-2 ${animationClass}`}></div>
              <div className={`h-10 bg-gray-200 rounded ${animationClass}`}></div>
            </div>
          ))}
          <div className={`h-12 bg-sage-200 rounded ${animationClass}`}></div>
        </div>
      )
      
    case 'button':
      return (
        <div className={`h-12 bg-sage-200 rounded ${animationClass} ${className}`}></div>
      )
      
    case 'card':
      return (
        <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
          <div className={`h-4 w-32 bg-gray-200 rounded mb-4 ${animationClass}`}></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-3 bg-gray-200 rounded ${animationClass}`}></div>
            ))}
          </div>
        </div>
      )
      
    case 'text':
    default:
      return (
        <div className={`space-y-2 ${className}`}>
          {[...Array(lines)].map((_, i) => (
            <div 
              key={i} 
              className={`h-3 bg-gray-200 rounded ${animationClass}`}
              style={{ width: `${Math.random() * 40 + 60}%` }}
            ></div>
          ))}
        </div>
      )
  }
}