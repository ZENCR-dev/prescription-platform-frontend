/**
 * Registration Adapter Types and Interfaces
 * 
 * @implements Dev-Step 3.8: Adapter Pattern for Edge Function Migration
 * @description Unified interfaces for registration service adapters
 * @pattern Adapter Pattern with Strategy Pattern for runtime switching
 */

import { User } from '@supabase/supabase-js'

/**
 * User role types matching backend user_metadata schema
 */
export type UserRole = 'tcm_practitioner' | 'pharmacy' | 'admin'

/**
 * Registration form data structure
 */
export interface RegistrationData {
  email: string
  password: string
  fullName: string
  phone?: string
  role: UserRole
  // Role-specific fields
  licenseNumber?: string  // For tcm_practitioner
  pharmacyName?: string   // For pharmacy
  inviteCode?: string     // For admin
}

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string
  code: string
  message: string
}

/**
 * Registration result structure
 */
export interface RegistrationResult {
  success: boolean
  user?: User
  error?: RegistrationError
  requiresEmailVerification?: boolean
}

/**
 * Registration error details
 */
export interface RegistrationError {
  code: RegistrationErrorCode
  message: string
  field?: string
  originalError?: any
}

/**
 * Standardized error codes for consistent error handling
 */
export enum RegistrationErrorCode {
  // Validation errors
  INVALID_EMAIL = 'INVALID_EMAIL',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_LICENSE_NUMBER = 'INVALID_LICENSE_NUMBER',
  INVALID_INVITE_CODE = 'INVALID_INVITE_CODE',
  
  // Registration errors
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  REGISTRATION_FAILED = 'REGISTRATION_FAILED',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Server errors
  SERVER_ERROR = 'SERVER_ERROR',
  EDGE_FUNCTION_ERROR = 'EDGE_FUNCTION_ERROR',
  
  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Adapter configuration options
 */
export interface AdapterConfig {
  timeout?: number        // Request timeout in milliseconds
  retryAttempts?: number  // Number of retry attempts
  retryDelay?: number     // Delay between retries in milliseconds
  validateLocally?: boolean // Perform local validation before submission
}

/**
 * Registration Adapter Interface
 * All adapters must implement this interface
 */
export interface RegistrationAdapter {
  /**
   * Validate registration data
   * Can be client-side or server-side validation
   */
  validate(data: RegistrationData): Promise<ValidationResult>
  
  /**
   * Submit registration request
   * Returns user object if successful
   */
  submit(data: RegistrationData): Promise<RegistrationResult>
  
  /**
   * Get adapter type identifier
   */
  getType(): string
  
  /**
   * Check if adapter is available/configured
   */
  isAvailable(): Promise<boolean>
}

/**
 * Factory function type for creating adapters
 */
export type AdapterFactory = (config?: AdapterConfig) => RegistrationAdapter