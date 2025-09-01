/**
 * Supabase Direct Adapter Implementation
 * 
 * @implements Dev-Step 3.8: Current implementation using direct Supabase Auth
 * @description Adapter that directly calls Supabase Auth for registration
 * @migration Will be replaced by EdgeFunctionAdapter when backend provides validation
 */

import { supabase } from '@/lib/supabase/client'
import {
  RegistrationAdapter,
  RegistrationData,
  RegistrationResult,
  ValidationResult,
  ValidationError,
  RegistrationError,
  RegistrationErrorCode,
  AdapterConfig
} from './types'

export class SupabaseDirectAdapter implements RegistrationAdapter {
  private config: Required<AdapterConfig>
  
  constructor(config?: AdapterConfig) {
    this.config = {
      timeout: config?.timeout ?? 30000,           // 30 seconds default
      retryAttempts: config?.retryAttempts ?? 2,   // 2 retry attempts
      retryDelay: config?.retryDelay ?? 1000,      // 1 second between retries
      validateLocally: config?.validateLocally ?? true
    }
  }
  
  /**
   * Local validation (client-side)
   * Will be supplemented by server-side validation in EdgeFunctionAdapter
   */
  async validate(data: RegistrationData): Promise<ValidationResult> {
    const errors: ValidationError[] = []
    
    // Email validation
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push({
        field: 'email',
        code: RegistrationErrorCode.INVALID_EMAIL,
        message: 'Please enter a valid email address'
      })
    }
    
    // Password validation
    if (!data.password || data.password.length < 8) {
      errors.push({
        field: 'password',
        code: RegistrationErrorCode.WEAK_PASSWORD,
        message: 'Password must be at least 8 characters'
      })
    }
    
    // Full name validation
    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.push({
        field: 'fullName',
        code: RegistrationErrorCode.MISSING_REQUIRED_FIELD,
        message: 'Please enter your full name'
      })
    }
    
    // Role-specific validation
    if (data.role === 'tcm_practitioner' && !data.licenseNumber) {
      errors.push({
        field: 'licenseNumber',
        code: RegistrationErrorCode.MISSING_REQUIRED_FIELD,
        message: 'License number is required for TCM practitioners'
      })
    }
    
    if (data.role === 'pharmacy' && !data.pharmacyName) {
      errors.push({
        field: 'pharmacyName',
        code: RegistrationErrorCode.MISSING_REQUIRED_FIELD,
        message: 'Pharmacy name is required'
      })
    }
    
    if (data.role === 'admin' && !data.inviteCode) {
      errors.push({
        field: 'inviteCode',
        code: RegistrationErrorCode.MISSING_REQUIRED_FIELD,
        message: 'Invite code is required for admin registration'
      })
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  /**
   * Submit registration to Supabase Auth
   * With retry logic and error mapping
   */
  async submit(data: RegistrationData): Promise<RegistrationResult> {
    // Validate locally first if configured
    if (this.config.validateLocally) {
      const validation = await this.validate(data)
      if (!validation.isValid) {
        return {
          success: false,
          error: {
            code: RegistrationErrorCode.MISSING_REQUIRED_FIELD,
            message: validation.errors[0].message,
            field: validation.errors[0].field
          }
        }
      }
    }
    
    // Prepare user metadata
    const userMetadata = this.prepareUserMetadata(data)
    
    // Attempt registration with retry logic
    let lastError: RegistrationError | undefined
    
    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const result = await this.attemptRegistration(data.email, data.password, userMetadata)
        
        if (result.success) {
          return result
        }
        
        lastError = result.error
        
        // Don't retry on validation errors
        if (this.isValidationError(lastError?.code)) {
          return result
        }
        
        // Wait before retry
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay)
        }
      } catch (error) {
        lastError = this.mapError(error)
        
        // Wait before retry
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay)
        }
      }
    }
    
    return {
      success: false,
      error: lastError || {
        code: RegistrationErrorCode.UNKNOWN_ERROR,
        message: 'Registration failed after multiple attempts'
      }
    }
  }
  
  /**
   * Get adapter type identifier
   */
  getType(): string {
    return 'supabase-direct'
  }
  
  /**
   * Check if Supabase client is configured and available
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Check if Supabase client is initialized
      const { data: { session } } = await supabase.auth.getSession()
      return true // If we can call getSession, client is available
    } catch {
      return false
    }
  }
  
  /**
   * Private helper methods
   */
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  private prepareUserMetadata(data: RegistrationData): Record<string, any> {
    const metadata: Record<string, any> = {
      role: data.role,
      full_name: data.fullName
    }
    
    if (data.phone) {
      metadata.phone = data.phone
    }
    
    // Add role-specific metadata
    switch (data.role) {
      case 'tcm_practitioner':
        if (data.licenseNumber) {
          metadata.license_number = data.licenseNumber
        }
        break
      case 'pharmacy':
        if (data.pharmacyName) {
          metadata.business_name = data.pharmacyName
        }
        break
      case 'admin':
        if (data.inviteCode) {
          metadata.invite_code = data.inviteCode
        }
        break
    }
    
    return metadata
  }
  
  private async attemptRegistration(
    email: string,
    password: string,
    metadata: Record<string, any>
  ): Promise<RegistrationResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) {
      return {
        success: false,
        error: this.mapSupabaseError(error)
      }
    }
    
    if (!data.user) {
      return {
        success: false,
        error: {
          code: RegistrationErrorCode.REGISTRATION_FAILED,
          message: 'Registration failed - no user returned'
        }
      }
    }
    
    return {
      success: true,
      user: data.user,
      requiresEmailVerification: !data.user.email_confirmed_at
    }
  }
  
  private mapSupabaseError(error: any): RegistrationError {
    // Map common Supabase Auth errors to our error codes
    const message = error.message?.toLowerCase() || ''
    
    if (message.includes('already registered') || message.includes('already exists')) {
      return {
        code: RegistrationErrorCode.EMAIL_ALREADY_EXISTS,
        message: 'This email is already registered',
        originalError: error
      }
    }
    
    if (message.includes('invalid email') || message.includes('email')) {
      return {
        code: RegistrationErrorCode.INVALID_EMAIL,
        message: 'Invalid email address',
        field: 'email',
        originalError: error
      }
    }
    
    if (message.includes('password') || message.includes('weak')) {
      return {
        code: RegistrationErrorCode.WEAK_PASSWORD,
        message: 'Password is too weak',
        field: 'password',
        originalError: error
      }
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        code: RegistrationErrorCode.NETWORK_ERROR,
        message: 'Network error - please check your connection',
        originalError: error
      }
    }
    
    // Default error
    return {
      code: RegistrationErrorCode.REGISTRATION_FAILED,
      message: error.message || 'Registration failed',
      originalError: error
    }
  }
  
  private mapError(error: any): RegistrationError {
    if (error.code && error.message) {
      return error as RegistrationError
    }
    
    return {
      code: RegistrationErrorCode.UNKNOWN_ERROR,
      message: error.message || 'An unexpected error occurred',
      originalError: error
    }
  }
  
  private isValidationError(code?: RegistrationErrorCode): boolean {
    if (!code) return false
    
    return [
      RegistrationErrorCode.INVALID_EMAIL,
      RegistrationErrorCode.WEAK_PASSWORD,
      RegistrationErrorCode.MISSING_REQUIRED_FIELD,
      RegistrationErrorCode.INVALID_LICENSE_NUMBER,
      RegistrationErrorCode.INVALID_INVITE_CODE,
      RegistrationErrorCode.EMAIL_ALREADY_EXISTS
    ].includes(code)
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}