/**
 * AuthCard Component
 * 
 * @implements Dev-Step 3.10: Component Library Extensions
 * @description Card container for authentication forms with medical platform styling
 */

import React, { ReactNode } from 'react'
import { CardVariant } from '../types'
import { cn } from '../../../../lib/utils'

export interface AuthCardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  variant?: CardVariant
  className?: string
  headerIcon?: ReactNode
  'data-testid'?: string
}

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  variant = 'default',
  className,
  headerIcon,
  'data-testid': testId
}: AuthCardProps) {
  // Variant classes
  const variantClasses = {
    default: 'bg-white shadow-sm',
    elevated: 'bg-white shadow-lg',
    bordered: 'bg-white border-2 border-gray-200'
  }
  
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden',
        variantClasses[variant],
        className
      )}
      data-testid={testId}
    >
      {/* Header */}
      {(title || subtitle || headerIcon) && (
        <div className="px-6 py-4 border-b border-gray-100">
          {headerIcon && (
            <div className="flex justify-center mb-4">
              {headerIcon}
            </div>
          )}
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 text-center">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="px-6 py-6">
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  )
}

// Compound components for better composition
export function AuthCardHeader({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

export function AuthCardContent({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={cn('px-6 py-6', className)}>
      {children}
    </div>
  )
}

export function AuthCardFooter({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={cn('px-6 py-4 bg-gray-50 border-t border-gray-100', className)}>
      {children}
    </div>
  )
}