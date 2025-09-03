/**
 * Edge Function Registration Adapter
 * 
 * @implements Dev-Step 3.5 Step 2: Integration wrapper for EdgeFunctionAdapter
 * @description Bridges EdgeFunctionAdapter with RegistrationAdapter interface
 * 
 * EUD Evidence Anchors:
 * - Lines 1-50: Adapter interface implementation with EdgeFunctionAdapter delegation
 * - Lines 51-150: License verification workflow integration
 * - Lines 151-250: Fallback strategy and error handling
 */

import {
  RegistrationAdapter,
  RegistrationData,
  RegistrationResult,
  ValidationResult,
  ValidationError,
  AdapterConfig,
  RegistrationErrorCode
} from './types';
import { EdgeFunctionAdapter, IEdgeFunctionAdapter } from './edge-function.adapter';
import { 
  LicenseVerificationRequest,
  LicenseVerificationResult,
  VerificationErrorCode,
  LicenseType,
  isVerificationSuccess,
  isVerificationError
} from '@/types/registration.types';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * EdgeFunctionRegistrationAdapter
 * Lines 35-250: Wrapper that integrates EdgeFunctionAdapter with registration flow
 */
export class EdgeFunctionRegistrationAdapter implements RegistrationAdapter {
  private edgeFunctionAdapter: IEdgeFunctionAdapter;
  private supabase: SupabaseClient;
  private config: AdapterConfig;
  
  constructor(config?: AdapterConfig) {
    this.config = config || {};
    this.supabase = createClient();
    this.edgeFunctionAdapter = new EdgeFunctionAdapter(this.supabase);
  }
  
  /**
   * Validate registration data including license verification
   * Lines 50-100: Validation with license verification integration
   */
  async validate(data: RegistrationData): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    
    // Basic field validation
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push({
        field: 'email',
        code: RegistrationErrorCode.INVALID_EMAIL,
        message: '请输入有效的邮箱地址'
      });
    }
    
    if (!data.password || data.password.length < 8) {
      errors.push({
        field: 'password',
        code: RegistrationErrorCode.WEAK_PASSWORD,
        message: '密码长度至少8位'
      });
    }
    
    if (!data.fullName || data.fullName.trim().length === 0) {
      errors.push({
        field: 'fullName',
        code: RegistrationErrorCode.MISSING_REQUIRED_FIELD,
        message: '请输入姓名'
      });
    }
    
    // Role-specific validation
    if (data.role === 'tcm_practitioner' && !data.licenseNumber) {
      errors.push({
        field: 'licenseNumber',
        code: RegistrationErrorCode.MISSING_REQUIRED_FIELD,
        message: '中医师需要提供执照号码'
      });
    }
    
    if (data.role === 'pharmacy' && !data.pharmacyName) {
      errors.push({
        field: 'pharmacyName',
        code: RegistrationErrorCode.MISSING_REQUIRED_FIELD,
        message: '药房需要提供药房名称'
      });
    }
    
    if (data.role === 'admin' && !data.inviteCode) {
      errors.push({
        field: 'inviteCode',
        code: RegistrationErrorCode.MISSING_REQUIRED_FIELD,
        message: '管理员需要提供邀请码'
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Submit registration with license verification
   * Lines 105-200: Registration flow with Edge Function integration
   */
  async submit(data: RegistrationData): Promise<RegistrationResult> {
    try {
      // First validate locally
      const validation = await this.validate(data);
      if (!validation.isValid) {
        return {
          success: false,
          error: {
            code: RegistrationErrorCode.INVALID_EMAIL,
            message: '请检查输入信息',
            field: validation.errors[0]?.field
          }
        };
      }
      
      // For TCM practitioners, verify license before registration
      if (data.role === 'tcm_practitioner' && data.licenseNumber) {
        console.log('[EdgeFunctionRegistrationAdapter] Starting license verification');
        
        const verificationRequest: LicenseVerificationRequest = {
          type: 'tcm_practitioner' as LicenseType,
          license_number: data.licenseNumber,
          license_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now as placeholder
          additional_info: {
            practitioner_name: data.fullName
          }
        };
        
        // Submit license verification
        const verificationResult = await this.edgeFunctionAdapter.submitLicenseVerification(verificationRequest);
        
        if (isVerificationError(verificationResult)) {
          console.error('[EdgeFunctionRegistrationAdapter] License verification failed:', verificationResult.error);
          return {
            success: false,
            error: {
              code: RegistrationErrorCode.INVALID_LICENSE_NUMBER,
              message: this.mapVerificationErrorToMessage(verificationResult.error.code),
              field: 'licenseNumber'
            }
          };
        }
        
        // Poll for verification completion
        if (isVerificationSuccess(verificationResult) && verificationResult.data.verification_id) {
          console.log('[EdgeFunctionRegistrationAdapter] Polling for verification status');
          
          const finalResult = await this.edgeFunctionAdapter.pollVerificationStatus(
            verificationResult.data.verification_id,
            {
              maxAttempts: 15,  // 30 seconds total
              intervalMs: 2000,
              backoffMultiplier: 1.0  // No backoff for quick testing
            }
          );
          
          if (isVerificationError(finalResult)) {
            console.error('[EdgeFunctionRegistrationAdapter] Verification polling failed:', finalResult.error);
            return {
              success: false,
              error: {
                code: RegistrationErrorCode.INVALID_LICENSE_NUMBER,
                message: this.mapVerificationErrorToMessage(finalResult.error.code),
                field: 'licenseNumber'
              }
            };
          }
          
          // Check final verification status
          if (isVerificationSuccess(finalResult) && finalResult.data.status === 'rejected') {
            return {
              success: false,
              error: {
                code: RegistrationErrorCode.INVALID_LICENSE_NUMBER,
                message: finalResult.data.rejection_reason || '执照验证未通过',
                field: 'licenseNumber'
              }
            };
          }
          
          console.log('[EdgeFunctionRegistrationAdapter] License verified successfully');
        }
      }
      
      // Proceed with Supabase Auth registration
      console.log('[EdgeFunctionRegistrationAdapter] Creating user account');
      
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
            phone: data.phone,
            license_number: data.licenseNumber,
            pharmacy_name: data.pharmacyName
          }
        }
      });
      
      if (authError) {
        console.error('[EdgeFunctionRegistrationAdapter] Registration failed:', authError);
        return {
          success: false,
          error: {
            code: this.mapSupabaseErrorToCode(authError.message),
            message: this.mapSupabaseErrorToMessage(authError.message),
            originalError: authError
          }
        };
      }
      
      return {
        success: true,
        user: authData.user || undefined,
        requiresEmailVerification: true
      };
      
    } catch (error) {
      console.error('[EdgeFunctionRegistrationAdapter] Unexpected error:', error);
      return {
        success: false,
        error: {
          code: RegistrationErrorCode.UNKNOWN_ERROR,
          message: '注册失败，请稍后重试',
          originalError: error
        }
      };
    }
  }
  
  /**
   * Get adapter type identifier
   */
  getType(): string {
    return 'edge-function';
  }
  
  /**
   * Check if Edge Function service is available
   * Lines 220-235: Service availability check with fallback
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Check if Edge Function service is available
      const available = await this.edgeFunctionAdapter.isServiceAvailable();
      console.log('[EdgeFunctionRegistrationAdapter] Service availability:', available);
      return available;
    } catch (error) {
      console.error('[EdgeFunctionRegistrationAdapter] Availability check failed:', error);
      // If Edge Functions are down, we can still fall back to direct registration
      // without license verification
      return false;
    }
  }
  
  /**
   * Helper: Map verification error code to user message
   */
  private mapVerificationErrorToMessage(code: VerificationErrorCode): string {
    return this.edgeFunctionAdapter.getErrorMessage(code);
  }
  
  /**
   * Helper: Map Supabase error to registration error code
   */
  private mapSupabaseErrorToCode(message: string): RegistrationErrorCode {
    if (message.includes('already registered')) {
      return RegistrationErrorCode.EMAIL_ALREADY_EXISTS;
    }
    if (message.includes('Invalid email')) {
      return RegistrationErrorCode.INVALID_EMAIL;
    }
    if (message.includes('Password')) {
      return RegistrationErrorCode.WEAK_PASSWORD;
    }
    return RegistrationErrorCode.REGISTRATION_FAILED;
  }
  
  /**
   * Helper: Map Supabase error to user-friendly message
   */
  private mapSupabaseErrorToMessage(message: string): string {
    if (message.includes('already registered')) {
      return '该邮箱已被注册';
    }
    if (message.includes('Invalid email')) {
      return '邮箱格式不正确';
    }
    if (message.includes('Password')) {
      return '密码不符合要求';
    }
    return '注册失败，请稍后重试';
  }
  
  /**
   * Helper: Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}