import { type ClassValue, clsx } from 'clsx'

/**
 * Utility function to merge CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength (medical platform requirements)
 */
export function isValidPassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Format error messages for display
 */
export function formatErrorMessage(error: Error | string): string {
  if (typeof error === 'string') return error
  
  // Handle Supabase auth errors
  if (error.message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.'
  }
  
  if (error.message.includes('Email not confirmed')) {
    return 'Please check your email and confirm your account before signing in.'
  }
  
  if (error.message.includes('Too many requests')) {
    return 'Too many login attempts. Please wait a few minutes before trying again.'
  }
  
  return error.message || 'An unexpected error occurred'
}

/**
 * Generate anonymous prescription code (GDPR/HIPAA compliant)
 */
export function generatePrescriptionCode(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `RX-${timestamp}-${random}`.toUpperCase()
}

/**
 * Sanitize and validate user input for medical platform
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * Check if running in production environment
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Format date for medical records (ISO format)
 */
export function formatMedicalDate(date: Date): string {
  return date.toISOString().split('T')[0]
}