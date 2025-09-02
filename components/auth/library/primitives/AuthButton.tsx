/**
 * AuthButton Component
 * 
 * @implements Dev-Step 3.10: Component Library Extensions
 * @description Button component with loading states and medical platform styling
 */

import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { ComponentSize, ComponentVariant } from '../types'
import { cn } from '../../../../lib/utils'

export interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ComponentVariant
  size?: ComponentSize
  loading?: boolean
  loadingText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className,
  ...buttonProps
}, ref) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  // Variant classes
  const variantClasses = {
    primary: cn(
      'bg-sage-600 text-white hover:bg-sage-700',
      'focus:ring-2 focus:ring-sage-500 focus:ring-offset-2',
      'disabled:bg-sage-400 disabled:cursor-not-allowed'
    ),
    secondary: cn(
      'bg-cambridge-100 text-cambridge-800 hover:bg-cambridge-200',
      'focus:ring-2 focus:ring-cambridge-500 focus:ring-offset-2',
      'disabled:bg-cambridge-50 disabled:text-cambridge-400 disabled:cursor-not-allowed'
    ),
    ghost: cn(
      'bg-transparent text-gray-700 hover:bg-gray-100',
      'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
      'disabled:text-gray-400 disabled:cursor-not-allowed'
    ),
    danger: cn(
      'bg-red-600 text-white hover:bg-red-700',
      'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
      'disabled:bg-red-400 disabled:cursor-not-allowed'
    )
  }
  
  // Loading spinner component
  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
  
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md',
        'transition-colors focus:outline-none',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        loading && 'cursor-wait',
        className
      )}
      aria-busy={loading}
      {...buttonProps}
    >
      {/* Left icon or loading spinner */}
      {loading ? (
        <LoadingSpinner />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      
      {/* Button text */}
      {loading && loadingText ? (
        <span className={loading ? 'ml-2' : ''}>{loadingText}</span>
      ) : (
        <span className={leftIcon && !loading ? '' : loading ? 'ml-2' : ''}>
          {children}
        </span>
      )}
      
      {/* Right icon */}
      {rightIcon && !loading && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  )
})

AuthButton.displayName = 'AuthButton'