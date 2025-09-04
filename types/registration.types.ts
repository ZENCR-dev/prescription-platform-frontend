/**
 * Registration Types and State Machine Definitions
 * 
 * @implements Dev-Step 3.5: Edge Function Integration
 * @description Type definitions for license verification state machine and responses
 */

// License verification state machine states
export type VerificationState = 'pending' | 'verifying' | 'verified' | 'rejected';

// License type enumeration
export type LicenseType = 'tcm_practitioner' | 'pharmacy';

// Error codes from Edge Function API
export enum VerificationErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EXPIRED_LICENSE = 'EXPIRED_LICENSE',
  INVALID_LICENSE_FORMAT = 'INVALID_LICENSE_FORMAT',
  STATE_ERROR = 'STATE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED'
}

// HTTP status codes mapping
export const ErrorStatusMap: Record<VerificationErrorCode, number> = {
  [VerificationErrorCode.VALIDATION_ERROR]: 400,
  [VerificationErrorCode.EXPIRED_LICENSE]: 400,
  [VerificationErrorCode.INVALID_LICENSE_FORMAT]: 400,
  [VerificationErrorCode.STATE_ERROR]: 409,
  [VerificationErrorCode.INTERNAL_ERROR]: 500,
  [VerificationErrorCode.NOT_FOUND]: 404,
  [VerificationErrorCode.UNAUTHORIZED]: 401,
  [VerificationErrorCode.FORBIDDEN]: 403,
  [VerificationErrorCode.METHOD_NOT_ALLOWED]: 405
};

// License verification request payload
export interface LicenseVerificationRequest {
  type: LicenseType;
  license_number: string;
  license_expiry: string; // ISO 8601 date
  // user_id is NOT included - extracted from JWT on backend
  additional_info?: {
    practitioner_name?: string;
    clinic_name?: string;
    pharmacy_name?: string;
    business_registration?: string;
  };
}

// Verification details in response
export interface VerificationDetails {
  expiry_date: string;
  issuing_authority?: string;
  verification_method?: string;
}

// License verification success response
export interface LicenseVerificationResponse {
  success: true;
  data: {
    verification_id: string;
    type: LicenseType;
    license_number: string; // Note: Should not be logged
    status: VerificationState;
    submitted_at: string;
    verified_at?: string;
    rejected_at?: string;
    rejection_reason?: string;
    verification_details?: VerificationDetails;
  };
  timestamp: string;
}

// License verification error response
export interface LicenseVerificationError {
  success: false;
  error: {
    code: VerificationErrorCode;
    message: string;
    field?: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

// Union type for all possible responses
export type LicenseVerificationResult = LicenseVerificationResponse | LicenseVerificationError;

// Status query response (GET endpoint)
export interface VerificationStatusResponse {
  success: true;
  data: {
    verification_id: string;
    type: LicenseType;
    license_number: string; // Note: Should not be logged
    status: VerificationState;
    submitted_at: string;
    verified_at?: string;
    rejected_at?: string;
    rejection_reason?: string;
  };
  timestamp: string;
}

// Error mapping to user-friendly messages
export const ErrorMessageMap: Record<VerificationErrorCode, string> = {
  [VerificationErrorCode.VALIDATION_ERROR]: '提交的信息有误，请检查后重试',
  [VerificationErrorCode.EXPIRED_LICENSE]: '执照已过期，请提供有效期内的执照',
  [VerificationErrorCode.INVALID_LICENSE_FORMAT]: '执照号码格式不正确',
  [VerificationErrorCode.STATE_ERROR]: '当前状态不允许此操作',
  [VerificationErrorCode.INTERNAL_ERROR]: '系统错误，请稍后重试',
  [VerificationErrorCode.NOT_FOUND]: '未找到验证记录',
  [VerificationErrorCode.UNAUTHORIZED]: '请先登录',
  [VerificationErrorCode.FORBIDDEN]: '没有权限执行此操作',
  [VerificationErrorCode.METHOD_NOT_ALLOWED]: '不支持的请求方法'
};

// Polling configuration
export interface PollingConfig {
  maxAttempts: number;
  intervalMs: number;
  backoffMultiplier: number;
}

// Default polling configuration
export const DEFAULT_POLLING_CONFIG: PollingConfig = {
  maxAttempts: 30, // 30 attempts
  intervalMs: 2000, // Start with 2 seconds
  backoffMultiplier: 1.5 // Exponential backoff
};

// Mock verification rules for testing
export const MockVerificationRules = {
  TCM_APPROVED_PREFIX: 'TCM-1',
  TCM_REJECTED_PREFIX: 'TCM-9',
  PHARMACY_APPROVED_PREFIX: 'PHARM-2',
  PHARMACY_REJECTED_PREFIX: 'PHARM-8'
} as const;

// State transition validation
export function isValidStateTransition(from: VerificationState, to: VerificationState): boolean {
  const validTransitions: Record<VerificationState, VerificationState[]> = {
    'pending': ['verifying'],
    'verifying': ['verified', 'rejected'],
    'verified': [], // Terminal state
    'rejected': []  // Terminal state
  };
  
  return validTransitions[from]?.includes(to) ?? false;
}

// Check if state is terminal
export function isTerminalState(state: VerificationState): boolean {
  return state === 'verified' || state === 'rejected';
}

// Type guard for success response
export function isVerificationSuccess(
  result: LicenseVerificationResult
): result is LicenseVerificationResponse {
  return result.success === true;
}

// Type guard for error response
export function isVerificationError(
  result: LicenseVerificationResult
): result is LicenseVerificationError {
  return result.success === false;
}

// Sanitize sensitive data for logging
export function sanitizeForLogging<T extends Record<string, any>>(data: T): Partial<T> {
  const sensitiveFields = ['license_number', 'user_id', 'access_token'];
  const sanitized = { ...data };
  
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      // @ts-ignore
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}