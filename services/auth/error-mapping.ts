/**
 * Authentication Error Code Mapping - M1.2 IRG Integration
 * 
 * @description Maps backend error codes to frontend RegistrationErrorCode and user-friendly messages
 * @author Frontend Lead  
 * @date 2025-09-07
 * @integration Backend M1.3 error codes → Frontend UI messages
 */

import { RegistrationErrorCode } from './adapters/types'

/**
 * Backend error codes from M1.3 API specification
 * To be updated when APIdocs/APIv1.md is published
 */
export enum BackendErrorCode {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',
  AUTH_EMAIL_NOT_CONFIRMED = 'AUTH_EMAIL_NOT_CONFIRMED',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  
  // Registration errors
  REG_EMAIL_ALREADY_EXISTS = 'REG_EMAIL_ALREADY_EXISTS',
  REG_WEAK_PASSWORD = 'REG_WEAK_PASSWORD',
  REG_INVALID_EMAIL = 'REG_INVALID_EMAIL',
  REG_MISSING_REQUIRED_FIELD = 'REG_MISSING_REQUIRED_FIELD',
  
  // Role-specific errors
  TCM_INVALID_LICENSE = 'TCM_INVALID_LICENSE',
  TCM_LICENSE_EXPIRED = 'TCM_LICENSE_EXPIRED',
  TCM_LICENSE_SUSPENDED = 'TCM_LICENSE_SUSPENDED',
  PHARMACY_INVALID_LICENSE = 'PHARMACY_INVALID_LICENSE',
  ADMIN_INVALID_INVITE_CODE = 'ADMIN_INVALID_INVITE_CODE',
  
  // Permission errors
  ACCESS_DENIED = 'ACCESS_DENIED',
  ROLE_NOT_AUTHORIZED = 'ROLE_NOT_AUTHORIZED',
  VIEW_ACCESS_DENIED = 'VIEW_ACCESS_DENIED',
  
  // System errors
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  RLS_VIOLATION = 'RLS_VIOLATION',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Backend to Frontend error code mapping
 */
export const ERROR_CODE_MAPPING: Record<BackendErrorCode, RegistrationErrorCode> = {
  // Authentication mappings
  [BackendErrorCode.AUTH_INVALID_CREDENTIALS]: RegistrationErrorCode.REGISTRATION_FAILED,
  [BackendErrorCode.AUTH_USER_NOT_FOUND]: RegistrationErrorCode.REGISTRATION_FAILED,
  [BackendErrorCode.AUTH_EMAIL_NOT_CONFIRMED]: RegistrationErrorCode.REGISTRATION_FAILED,
  [BackendErrorCode.AUTH_SESSION_EXPIRED]: RegistrationErrorCode.REGISTRATION_FAILED,
  [BackendErrorCode.AUTH_TOKEN_INVALID]: RegistrationErrorCode.REGISTRATION_FAILED,
  
  // Registration mappings
  [BackendErrorCode.REG_EMAIL_ALREADY_EXISTS]: RegistrationErrorCode.EMAIL_ALREADY_EXISTS,
  [BackendErrorCode.REG_WEAK_PASSWORD]: RegistrationErrorCode.WEAK_PASSWORD,
  [BackendErrorCode.REG_INVALID_EMAIL]: RegistrationErrorCode.INVALID_EMAIL,
  [BackendErrorCode.REG_MISSING_REQUIRED_FIELD]: RegistrationErrorCode.MISSING_REQUIRED_FIELD,
  
  // Role-specific mappings
  [BackendErrorCode.TCM_INVALID_LICENSE]: RegistrationErrorCode.INVALID_LICENSE_NUMBER,
  [BackendErrorCode.TCM_LICENSE_EXPIRED]: RegistrationErrorCode.INVALID_LICENSE_NUMBER,
  [BackendErrorCode.TCM_LICENSE_SUSPENDED]: RegistrationErrorCode.INVALID_LICENSE_NUMBER,
  [BackendErrorCode.PHARMACY_INVALID_LICENSE]: RegistrationErrorCode.INVALID_LICENSE_NUMBER,
  [BackendErrorCode.ADMIN_INVALID_INVITE_CODE]: RegistrationErrorCode.INVALID_INVITE_CODE,
  
  // Permission mappings
  [BackendErrorCode.ACCESS_DENIED]: RegistrationErrorCode.REGISTRATION_FAILED,
  [BackendErrorCode.ROLE_NOT_AUTHORIZED]: RegistrationErrorCode.REGISTRATION_FAILED,
  [BackendErrorCode.VIEW_ACCESS_DENIED]: RegistrationErrorCode.REGISTRATION_FAILED,
  
  // System error mappings
  [BackendErrorCode.SERVER_ERROR]: RegistrationErrorCode.SERVER_ERROR,
  [BackendErrorCode.DATABASE_ERROR]: RegistrationErrorCode.SERVER_ERROR,
  [BackendErrorCode.NETWORK_TIMEOUT]: RegistrationErrorCode.NETWORK_ERROR,
  [BackendErrorCode.RLS_VIOLATION]: RegistrationErrorCode.SERVER_ERROR,
  
  // Unknown
  [BackendErrorCode.UNKNOWN_ERROR]: RegistrationErrorCode.UNKNOWN_ERROR
}

/**
 * User-friendly error messages with bilingual support
 */
export interface ErrorMessage {
  zh: string
  en: string
}

export const ERROR_MESSAGES: Record<RegistrationErrorCode, ErrorMessage> = {
  [RegistrationErrorCode.INVALID_EMAIL]: {
    zh: '请输入有效的邮箱地址',
    en: 'Please enter a valid email address'
  },
  [RegistrationErrorCode.WEAK_PASSWORD]: {
    zh: '密码强度不够，请使用至少8个字符，包含大小写字母和数字',
    en: 'Password is too weak. Please use at least 8 characters with uppercase, lowercase and numbers'
  },
  [RegistrationErrorCode.MISSING_REQUIRED_FIELD]: {
    zh: '请填写所有必填字段',
    en: 'Please fill in all required fields'
  },
  [RegistrationErrorCode.INVALID_LICENSE_NUMBER]: {
    zh: '执业证书编号无效或已过期，请联系管理员',
    en: 'Medical license number is invalid or expired. Please contact administrator'
  },
  [RegistrationErrorCode.INVALID_INVITE_CODE]: {
    zh: '邀请码无效，请联系系统管理员',
    en: 'Invalid invite code. Please contact system administrator'
  },
  [RegistrationErrorCode.EMAIL_ALREADY_EXISTS]: {
    zh: '该邮箱已被注册，请使用其他邮箱或尝试登录',
    en: 'This email is already registered. Please use another email or try logging in'
  },
  [RegistrationErrorCode.REGISTRATION_FAILED]: {
    zh: '注册失败，请检查信息后重试',
    en: 'Registration failed. Please check your information and try again'
  },
  [RegistrationErrorCode.NETWORK_ERROR]: {
    zh: '网络连接错误，请检查网络后重试',
    en: 'Network connection error. Please check your connection and try again'
  },
  [RegistrationErrorCode.TIMEOUT_ERROR]: {
    zh: '请求超时，请重试',
    en: 'Request timeout. Please try again'
  },
  [RegistrationErrorCode.SERVER_ERROR]: {
    zh: '服务器错误，请稍后重试或联系技术支持',
    en: 'Server error. Please try again later or contact technical support'
  },
  [RegistrationErrorCode.EDGE_FUNCTION_ERROR]: {
    zh: '服务调用失败，请稍后重试',
    en: 'Service call failed. Please try again later'
  },
  [RegistrationErrorCode.UNKNOWN_ERROR]: {
    zh: '未知错误，请联系技术支持',
    en: 'Unknown error. Please contact technical support'
  }
}

/**
 * Map backend error code to frontend error code
 */
export function mapBackendError(backendCode: string): RegistrationErrorCode {
  const mappedCode = ERROR_CODE_MAPPING[backendCode as BackendErrorCode]
  return mappedCode || RegistrationErrorCode.UNKNOWN_ERROR
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(
  errorCode: RegistrationErrorCode, 
  language: 'zh' | 'en' = 'zh',
  field?: string
): string {
  const message = ERROR_MESSAGES[errorCode]
  if (!message) {
    return language === 'zh' ? '未知错误' : 'Unknown error'
  }
  
  let text = message[language]
  
  // Add field-specific context if available
  if (field && errorCode === RegistrationErrorCode.MISSING_REQUIRED_FIELD) {
    const fieldNames = {
      email: { zh: '邮箱', en: 'email' },
      password: { zh: '密码', en: 'password' },
      fullName: { zh: '姓名', en: 'full name' },
      licenseNumber: { zh: '执业证书编号', en: 'license number' },
      pharmacyName: { zh: '药房名称', en: 'pharmacy name' },
      inviteCode: { zh: '邀请码', en: 'invite code' }
    }
    
    const fieldName = fieldNames[field as keyof typeof fieldNames]
    if (fieldName) {
      text = language === 'zh' 
        ? `请填写${fieldName.zh}`
        : `Please fill in ${fieldName.en}`
    }
  }
  
  return text
}

/**
 * Create comprehensive error response from backend error
 */
export interface MappedError {
  code: RegistrationErrorCode
  message: string
  originalBackendCode?: string
  field?: string
}

export function createMappedError(
  backendCode: string,
  language: 'zh' | 'en' = 'zh',
  field?: string,
  customMessage?: string
): MappedError {
  const frontendCode = mapBackendError(backendCode)
  const message = customMessage || getErrorMessage(frontendCode, language, field)
  
  return {
    code: frontendCode,
    message,
    originalBackendCode: backendCode,
    field
  }
}

/**
 * IRG-specific error handling
 * For integration testing and validation
 */
export const IRG_ERROR_TRACKING = {
  /**
   * Track error during IRG testing
   */
  trackError: (error: MappedError, context: string) => {
    if (process.env.NEXT_PUBLIC_IRG_VALIDATION === 'true') {
      console.log(`[IRG Error Tracking] ${context}:`, {
        frontendCode: error.code,
        backendCode: error.originalBackendCode,
        message: error.message,
        field: error.field,
        timestamp: new Date().toISOString()
      })
    }
  },

  /**
   * Validate error mapping completeness
   */
  validateMappings: (): { valid: boolean; missing: string[] } => {
    const backendCodes = Object.values(BackendErrorCode)
    const missing = backendCodes.filter(code => !ERROR_CODE_MAPPING[code])
    
    return {
      valid: missing.length === 0,
      missing
    }
  }
}

export default {
  BackendErrorCode,
  ERROR_CODE_MAPPING,
  ERROR_MESSAGES,
  mapBackendError,
  getErrorMessage,
  createMappedError,
  IRG_ERROR_TRACKING
}