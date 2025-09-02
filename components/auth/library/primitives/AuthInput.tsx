/**
 * AuthInput Component
 * 
 * @implements Dev-Step 3.10: Component Library Extensions
 * @description Input component with integrated validation and medical platform styling
 */

import React, { forwardRef, InputHTMLAttributes, ReactNode, useEffect } from 'react'
import { CommonComponentProps } from '../types'
import { useFieldValidation, ValidationConfig } from '../../../../hooks/useFieldValidation'
import { ValidationFeedback } from '../../ValidationFeedback'
import { cn } from '../../../../lib/utils'

export interface AuthInputProps extends 
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
  CommonComponentProps {
  label?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  validation?: ValidationConfig
  onValidationChange?: (isValid: boolean, error?: string) => void
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(({
  label,
  hint,
  error: externalError,
  success,
  loading: externalLoading,
  disabled,
  required,
  leftIcon,
  rightIcon,
  validation,
  onValidationChange,
  size = 'md',
  fullWidth = false,
  className,
  onBlur,
  onChange,
  value,
  defaultValue,
  type = 'text',
  ...inputProps
}, ref) => {
  // Use validation hook (always call it to satisfy React hooks rule)
  const fieldValidation = useFieldValidation(validation || { rules: [] })
  
  // Determine validation state
  const isValidating = fieldValidation?.isValidating || externalLoading
  const error = fieldValidation?.error || externalError
  const isValid = success || (fieldValidation?.isValid && !error)
  
  // Notify parent of validation changes
  useEffect(() => {
    if (onValidationChange && validation) {
      onValidationChange(fieldValidation.isValid, fieldValidation.error)
    }
  }, [fieldValidation.isValid, fieldValidation.error, onValidationChange, validation])
  
  // Handle change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    fieldValidation?.validate(e.target.value)
  }
  
  // Handle blur event
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e)
    fieldValidation?.validate(e.target.value)
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-5 text-lg'
  }
  
  // Border color based on state
  const borderColor = error 
    ? 'border-red-400 focus:border-red-500' 
    : isValid 
    ? 'border-emerald-400 focus:border-emerald-500'
    : 'border-gray-200 focus:border-cambridge-500'
  
  return (
    <div className={cn('space-y-1', fullWidth && 'w-full', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        {/* Input field */}
        <input
          ref={ref}
          type={type}
          disabled={disabled || isValidating}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            'w-full rounded-md border transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-cambridge-500/20',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            sizeClasses[size],
            borderColor,
            leftIcon && 'pl-10',
            rightIcon && 'pr-10'
          )}
          aria-invalid={!!error}
          aria-describedby={hint ? `${inputProps.id}-hint` : undefined}
          {...inputProps}
        />
        
        {/* Right icon or validation indicator */}
        {(rightIcon || isValidating || error || isValid) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {isValidating ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : error ? (
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : isValid ? (
              <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : rightIcon ? (
              rightIcon
            ) : null}
          </div>
        )}
      </div>
      
      {/* Hint text */}
      {hint && !error && !success && (
        <p id={`${inputProps.id}-hint`} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      
      {/* Validation feedback */}
      {(error || success) && (
        <ValidationFeedback
          error={error}
          success={success}
          showIcon={false}
        />
      )}
    </div>
  )
})

AuthInput.displayName = 'AuthInput'