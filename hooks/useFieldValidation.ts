/**
 * Field Validation Hook
 * 
 * @implements Dev-Step 3.9: Enhanced UI States - Real-time field validation
 * @description Provides real-time field validation with debouncing and i18n support
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { useLanguage } from '@/components/auth/hooks/useLanguage'

// Validation rule types
export type ValidationRule = 
  | { type: 'required'; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'custom'; validate: (value: any) => boolean | string; message?: string }
  | { type: 'passwordStrength'; message?: string }
  | { type: 'licenseNumber'; message?: string }
  | { type: 'phoneNumber'; message?: string }

export interface ValidationConfig {
  rules: ValidationRule[]
  debounceMs?: number
  showVisualFeedback?: boolean
  i18nMessages?: Record<string, string>
}

export interface ValidationResult {
  isValid: boolean
  isValidating: boolean
  error?: string
  feedback?: 'success' | 'warning' | 'error' | 'info'
  strength?: number // For password strength
}

// Password strength calculation
const calculatePasswordStrength = (password: string): number => {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  return Math.min(strength, 5) // Max strength 5
}

// License number validation (18 digits for TCM practitioner)
const validateLicenseNumber = (value: string): boolean => {
  return /^\d{18}$/.test(value)
}

// Phone number validation (Chinese mobile)
const validatePhoneNumber = (value: string): boolean => {
  return /^1[3-9]\d{9}$/.test(value)
}

// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function useFieldValidation(config: ValidationConfig) {
  const [result, setResult] = useState<ValidationResult>({
    isValid: true,
    isValidating: false,
  })
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const { language } = useLanguage()
  
  // Default validation messages
  const defaultMessages = {
    en: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      minLength: 'Must be at least {value} characters',
      maxLength: 'Must be no more than {value} characters',
      pattern: 'Invalid format',
      passwordWeak: 'Password is too weak',
      passwordFair: 'Password could be stronger',
      passwordGood: 'Good password',
      passwordStrong: 'Strong password!',
      licenseInvalid: 'License number must be 18 digits',
      phoneInvalid: 'Please enter a valid phone number',
    },
    zh: {
      required: '此字段为必填项',
      email: '请输入有效的电子邮箱地址',
      minLength: '至少需要 {value} 个字符',
      maxLength: '不能超过 {value} 个字符',
      pattern: '格式无效',
      passwordWeak: '密码太弱',
      passwordFair: '密码强度一般',
      passwordGood: '密码强度良好',
      passwordStrong: '密码强度很强！',
      licenseInvalid: '执业证书编号必须是18位数字',
      phoneInvalid: '请输入有效的手机号码',
    }
  }
  
  const messages = {
    ...defaultMessages[language],
    ...config.i18nMessages
  }
  
  // Main validation function
  const validateValue = useCallback((value: any): ValidationResult => {
    if (!config.rules || config.rules.length === 0) {
      return { isValid: true, isValidating: false }
    }
    
    for (const rule of config.rules) {
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return {
              isValid: false,
              isValidating: false,
              error: rule.message || messages.required,
              feedback: 'error'
            }
          }
          break
          
        case 'email':
          if (value && !validateEmail(value)) {
            return {
              isValid: false,
              isValidating: false,
              error: rule.message || messages.email,
              feedback: 'error'
            }
          }
          break
          
        case 'minLength':
          if (value && value.length < rule.value) {
            return {
              isValid: false,
              isValidating: false,
              error: (rule.message || messages.minLength).replace('{value}', rule.value.toString()),
              feedback: 'error'
            }
          }
          break
          
        case 'maxLength':
          if (value && value.length > rule.value) {
            return {
              isValid: false,
              isValidating: false,
              error: (rule.message || messages.maxLength).replace('{value}', rule.value.toString()),
              feedback: 'error'
            }
          }
          break
          
        case 'pattern':
          if (value && !rule.value.test(value)) {
            return {
              isValid: false,
              isValidating: false,
              error: rule.message || messages.pattern,
              feedback: 'error'
            }
          }
          break
          
        case 'custom':
          const customResult = rule.validate(value)
          if (customResult !== true) {
            return {
              isValid: false,
              isValidating: false,
              error: typeof customResult === 'string' ? customResult : (rule.message || 'Validation failed'),
              feedback: 'error'
            }
          }
          break
          
        case 'passwordStrength':
          if (value) {
            const strength = calculatePasswordStrength(value)
            if (strength < 2) {
              return {
                isValid: false,
                isValidating: false,
                error: messages.passwordWeak,
                feedback: 'error',
                strength
              }
            } else if (strength === 2) {
              return {
                isValid: true,
                isValidating: false,
                error: messages.passwordFair,
                feedback: 'warning',
                strength
              }
            } else if (strength === 3) {
              return {
                isValid: true,
                isValidating: false,
                error: messages.passwordGood,
                feedback: 'success',
                strength
              }
            } else {
              return {
                isValid: true,
                isValidating: false,
                error: messages.passwordStrong,
                feedback: 'success',
                strength
              }
            }
          }
          break
          
        case 'licenseNumber':
          if (value && !validateLicenseNumber(value)) {
            return {
              isValid: false,
              isValidating: false,
              error: rule.message || messages.licenseInvalid,
              feedback: 'error'
            }
          }
          break
          
        case 'phoneNumber':
          if (value && !validatePhoneNumber(value)) {
            return {
              isValid: false,
              isValidating: false,
              error: rule.message || messages.phoneInvalid,
              feedback: 'error'
            }
          }
          break
      }
    }
    
    // All validations passed
    return {
      isValid: true,
      isValidating: false,
      feedback: config.showVisualFeedback ? 'success' : undefined
    }
  }, [config.rules, config.showVisualFeedback, messages])
  
  // Validate with debouncing
  const validate = useCallback((value: any) => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    // Set validating state immediately
    setResult(prev => ({ ...prev, isValidating: true }))
    
    // Debounce the actual validation
    debounceTimer.current = setTimeout(() => {
      const validationResult = validateValue(value)
      setResult(validationResult)
    }, config.debounceMs || 300)
  }, [config.debounceMs, validateValue])
  
  // Immediate validation without debouncing
  const validateImmediate = useCallback((value: any) => {
    const validationResult = validateValue(value)
    setResult(validationResult)
    return validationResult
  }, [validateValue])
  
  // Clear validation state
  const clearValidation = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    setResult({
      isValid: true,
      isValidating: false
    })
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])
  
  return {
    ...result,
    validate,
    validateImmediate,
    clearValidation
  }
}

// Export utility validation functions for direct use
export const validators = {
  email: validateEmail,
  phoneNumber: validatePhoneNumber,
  licenseNumber: validateLicenseNumber,
  passwordStrength: calculatePasswordStrength
}