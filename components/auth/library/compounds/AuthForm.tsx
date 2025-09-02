/**
 * AuthForm Component
 * 
 * @implements Dev-Step 3.10: Component Library Extensions
 * @description Form wrapper with integrated validation and error handling
 */

import React, { ReactNode, useCallback } from 'react'
import { FormValidationConfig } from '../types'
import { useFormValidation } from '../../../../hooks/useFormValidation'
import { ErrorBoundary, RetryableError } from '../../ErrorBoundary'
import { LoadingOverlay } from '../../LoadingOverlay'
import { cn } from '../../../../lib/utils'

export interface AuthFormProps {
  validation?: FormValidationConfig
  onSubmit: (values: Record<string, string | number | boolean>) => Promise<void> | void
  loading?: boolean
  error?: string | Error
  success?: string
  children: ReactNode | ((form: ReturnType<typeof useFormValidation>) => ReactNode)
  showLoadingOverlay?: boolean
  loadingText?: string
  onRetry?: () => Promise<void>
  className?: string
  'data-testid'?: string
  // Spread other form props
  id?: string
  name?: string
  noValidate?: boolean
  autoComplete?: string
  acceptCharset?: string
  action?: string
  encType?: string
  method?: string
  target?: string
}

export function AuthForm({
  validation,
  onSubmit,
  loading = false,
  error,
  success,
  children,
  showLoadingOverlay = false,
  loadingText = 'Processing...',
  onRetry,
  className,
  'data-testid': testId,
  // Form props
  id,
  name,
  noValidate = true,
  autoComplete,
  acceptCharset,
  action,
  encType,
  method,
  target
}: AuthFormProps) {
  // Use form validation hook (always call to satisfy React hooks rule)
  const form = useFormValidation(validation || { fields: [], onSubmit })
  
  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (form) {
      // Use form validation hook's submit handler
      await form.handleSubmit(e)
    } else {
      // Simple form submission without validation
      const formData = new FormData(e.currentTarget)
      const values: Record<string, string | number | boolean> = {}
      formData.forEach((value, key) => {
        values[key] = value.toString()
      })
      await onSubmit(values)
    }
  }, [form, onSubmit])
  
  // Render children with form context if function
  const renderChildren = (): ReactNode => {
    if (typeof children === 'function' && form) {
      return children(form)
    }
    return children as ReactNode
  }
  
  return (
    <ErrorBoundary>
      <form
        onSubmit={handleSubmit}
        className={cn('space-y-4', className)}
        data-testid={testId}
        id={id}
        name={name}
        noValidate={noValidate}
        autoComplete={autoComplete}
        acceptCharset={acceptCharset}
        action={action}
        encType={encType}
        method={method}
        target={target}
      >
        {/* Loading overlay */}
        {showLoadingOverlay && (
          <LoadingOverlay 
            isLoading={loading || form?.isSubmitting || false}
            message={loadingText} 
          />
        )}
        
        {/* Global error */}
        {error && (
          <RetryableError
            error={error}
            onRetry={onRetry || (async () => { window.location.reload() })}
            className="mb-4"
          />
        )}
        
        {/* Global success */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-emerald-800">{success}</p>
            </div>
          </div>
        )}
        
        {/* Form content */}
        {renderChildren()}
      </form>
    </ErrorBoundary>
  )
}

// Form field wrapper for consistent spacing and layout
export function AuthFormField({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={cn('space-y-1', className)}>
      {children}
    </div>
  )
}

// Form actions container for buttons
export function AuthFormActions({ 
  children, 
  className,
  align = 'right'
}: { 
  children: ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }
  
  return (
    <div className={cn('flex gap-3 pt-2', alignClasses[align], className)}>
      {children}
    </div>
  )
}

// Form divider for visual separation
export function AuthFormDivider({ 
  text,
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      {text && (
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">{text}</span>
        </div>
      )}
    </div>
  )
}