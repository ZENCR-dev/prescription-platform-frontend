/**
 * Validation Feedback Component
 * 
 * @implements Dev-Step 3.9: Enhanced UI States - Visual validation feedback
 * @description Provides visual feedback for form field validation
 */

import React from 'react'

export interface ValidationFeedbackProps {
  isValid?: boolean
  isValidating?: boolean
  error?: string
  success?: string
  warning?: string
  info?: string
  feedback?: 'success' | 'warning' | 'error' | 'info'
  showIcon?: boolean
  className?: string
}

export function ValidationFeedback({
  isValid,
  isValidating,
  error,
  success,
  warning,
  info,
  feedback,
  showIcon = true,
  className = ''
}: ValidationFeedbackProps) {
  // Determine message and type
  const message = error || warning || success || info
  let type = feedback
  
  if (!type) {
    if (error) type = 'error'
    else if (warning) type = 'warning'
    else if (success || isValid) type = 'success'
    else if (info) type = 'info'
  }
  
  // Don't show anything if no message and not validating
  if (!message && !isValidating && !isValid) return null
  
  // Loading state
  if (isValidating) {
    return (
      <div className={`flex items-center mt-1 text-xs ${className}`}>
        <svg className="animate-spin h-3 w-3 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-gray-500">Validating...</span>
      </div>
    )
  }
  
  // Color and icon based on type
  const styles = {
    success: {
      text: 'text-emerald-600',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    error: {
      text: 'text-red-600',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    warning: {
      text: 'text-amber-600',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    info: {
      text: 'text-blue-600',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }
  
  const style = type ? styles[type] : styles.info
  
  // Show checkmark for valid state even without message
  if (isValid && !message && type === 'success') {
    return (
      <div className={`flex items-center mt-1 ${className}`}>
        <span className={style.text}>{style.icon}</span>
      </div>
    )
  }
  
  if (!message) return null
  
  return (
    <div className={`flex items-start mt-1 text-xs ${style.text} ${className}`}>
      {showIcon && (
        <span className="mr-1 flex-shrink-0 mt-0.5">
          {style.icon}
        </span>
      )}
      <span>{message}</span>
    </div>
  )
}

// Field wrapper with validation feedback
export interface ValidatedFieldProps {
  children: React.ReactNode
  label?: string
  required?: boolean
  isValid?: boolean
  isValidating?: boolean
  error?: string
  success?: string
  warning?: string
  info?: string
  feedback?: 'success' | 'warning' | 'error' | 'info'
  className?: string
}

export function ValidatedField({
  children,
  label,
  required,
  isValid,
  isValidating,
  error,
  success,
  warning,
  info,
  feedback,
  className = ''
}: ValidatedFieldProps) {
  // Determine border color based on validation state
  let borderClass = 'border-gray-200 focus-within:border-cambridge-500'
  
  if (error || feedback === 'error') {
    borderClass = 'border-red-400 focus-within:border-red-500'
  } else if (warning || feedback === 'warning') {
    borderClass = 'border-amber-400 focus-within:border-amber-500'
  } else if ((success || isValid) && !isValidating) {
    borderClass = 'border-emerald-400 focus-within:border-emerald-500'
  }
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-gray-600 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={`relative transition-colors ${borderClass}`}>
        {children}
        
        {/* Inline validation icon */}
        {!isValidating && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            {(error || feedback === 'error') && (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {(success || isValid) && !error && (
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {warning && !error && !success && (
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
        )}
        
        {/* Loading spinner */}
        {isValidating && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="animate-spin h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      
      {/* Validation feedback message */}
      <ValidationFeedback
        isValid={isValid}
        isValidating={isValidating}
        error={error}
        success={success}
        warning={warning}
        info={info}
        feedback={feedback}
      />
    </div>
  )
}

// Password strength indicator
export interface PasswordStrengthProps {
  strength: number // 0-5
  className?: string
}

export function PasswordStrength({ strength, className = '' }: PasswordStrengthProps) {
  const strengthLabels = [
    'Very Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong',
    'Very Strong'
  ]
  
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500'
  ]
  
  return (
    <div className={className}>
      <div className="flex gap-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < strength ? strengthColors[strength] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${strength < 2 ? 'text-red-600' : strength < 4 ? 'text-amber-600' : 'text-emerald-600'}`}>
        {strengthLabels[strength]}
      </p>
    </div>
  )
}