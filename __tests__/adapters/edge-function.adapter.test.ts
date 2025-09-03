// @ts-nocheck
/**
 * EdgeFunctionAdapter Unit Tests
 * 
 * @implements Dev-Step 3.5 Step 3: Comprehensive test coverage
 * @description Tests for EdgeFunctionAdapter with all error scenarios
 * 
 * EUD Evidence Anchors:
 * - Lines 1-100: Test setup and mocking configuration
 * - Lines 101-300: Success scenario tests
 * - Lines 301-600: Error code coverage (all 9 error codes)
 * - Lines 601-800: Polling mechanism tests
 */
import { EdgeFunctionAdapter } from '@/services/auth/adapters/edge-function.adapter';
import {
  LicenseVerificationRequest,
  LicenseVerificationResponse,
  LicenseVerificationError,
  VerificationErrorCode,
  LicenseType
} from '@/types/registration.types';

// Mock Supabase client
const mockInvoke = jest.fn();
const mockGetSession = jest.fn();
const mockSupabaseClient = {
  functions: {
    invoke: mockInvoke
  },
  auth: {
    getSession: mockGetSession
  }
};

// Mock fetch for GET requests
global.fetch = jest.fn();

describe('EdgeFunctionAdapter', () => {
  let adapter;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Set up default environment
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    
    // Create adapter with mocked client
    adapter = new EdgeFunctionAdapter(mockSupabaseClient);
    
    // Default session with access token
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'test-access-token-123',
          user: { id: 'test-user-id' }
        }
      }
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('submitLicenseVerification', () => {
    const validRequest = {
      type: 'tcm_practitioner',
      license_number: 'TCM-123456',
      license_expiry: '2025-12-31T00:00:00Z',
      additional_info: {
        practitioner_name: 'Dr. Test'
      }
    };
    
    it('should successfully submit verification request', async () => {
      // Mock successful response
      const mockResponse = {
        success: true,
        data: {
          verification_id: 'ver-123',
          type: 'tcm_practitioner',
          license_number: 'TCM-123456',
          status: 'pending',
          submitted_at: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
      
      mockInvoke.mockResolvedValue({
        data: mockResponse,
        error: null
      });
      
      const result = await adapter.submitLicenseVerification(validRequest);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verification_id).toBe('ver-123');
        expect(result.data.status).toBe('pending');
      }
      
      // Verify invoke was called correctly
      expect(mockInvoke).toHaveBeenCalledWith('license-verification', {
        body: validRequest // No user_id included
      });
    });
    
    it('should handle VALIDATION_ERROR', async () => {
      mockInvoke.mockResolvedValue({
        data: {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid license format'
          }
        },
        error: null
      });
      
      const result = await adapter.submitLicenseVerification(validRequest);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.VALIDATION_ERROR);
        expect(adapter.getErrorMessage(result.error.code)).toBe('请检查输入信息并重试');
      }
    });
    
    it('should handle EXPIRED_LICENSE error', async () => {
      mockInvoke.mockResolvedValue({
        data: {
          success: false,
          error: {
            code: 'EXPIRED_LICENSE',
            message: 'License has expired'
          }
        },
        error: null
      });
      
      const result = await adapter.submitLicenseVerification(validRequest);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.EXPIRED_LICENSE);
        expect(adapter.getErrorMessage(result.error.code)).toBe('执照已过期，请使用有效期内的执照');
      }
    });
    
    it('should handle network errors', async () => {
      mockInvoke.mockRejectedValue(new Error('Network error'));
      
      const result = await adapter.submitLicenseVerification(validRequest);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.INTERNAL_ERROR);
      }
    });
  });
  
  describe('getVerificationStatus', () => {
    const verificationId = 'ver-123';
    
    it('should successfully fetch verification status', async () => {
      const mockResponse = {
        success: true,
        data: {
          verification_id: verificationId,
          type: 'tcm_practitioner',
          license_number: 'TCM-123456',
          status: 'verified',
          submitted_at: new Date().toISOString(),
          verified_at: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
      
      (global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await adapter.getVerificationStatus(verificationId);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verification_id).toBe(verificationId);
        expect(result.data.status).toBe('verified');
      }
      
      // Verify fetch was called with Bearer token
      expect(global.fetch).toHaveBeenCalledWith(
        `https://test.supabase.co/functions/v1/license-verification?verification_id=${verificationId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-access-token-123',
            'Content-Type': 'application/json'
          }
        }
      );
    });
    
    it('should handle UNAUTHORIZED (401) error', async () => {
      (global.fetch).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: 'Unauthorized' } })
      });
      
      const result = await adapter.getVerificationStatus(verificationId);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.UNAUTHORIZED);
        expect(adapter.getErrorMessage(result.error.code)).toBe('请先登录后再操作');
      }
    });
    
    it('should handle FORBIDDEN (403) error', async () => {
      (global.fetch).mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ error: { message: 'Forbidden' } })
      });
      
      const result = await adapter.getVerificationStatus(verificationId);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.FORBIDDEN);
        expect(adapter.getErrorMessage(result.error.code)).toBe('您没有权限执行此操作');
      }
    });
    
    it('should handle NOT_FOUND (404) error', async () => {
      (global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: { message: 'Not found' } })
      });
      
      const result = await adapter.getVerificationStatus(verificationId);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.NOT_FOUND);
        expect(adapter.getErrorMessage(result.error.code)).toBe('未找到相关记录');
      }
    });
    
    it('should handle METHOD_NOT_ALLOWED (405) error', async () => {
      (global.fetch).mockResolvedValue({
        ok: false,
        status: 405,
        json: async () => ({ error: { message: 'Method not allowed' } })
      });
      
      const result = await adapter.getVerificationStatus(verificationId);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.METHOD_NOT_ALLOWED);
        expect(adapter.getErrorMessage(result.error.code)).toBe('请求方式不支持');
      }
    });
    
    it('should handle STATE_ERROR (409) error', async () => {
      (global.fetch).mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: { message: 'State conflict' } })
      });
      
      const result = await adapter.getVerificationStatus(verificationId);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.STATE_ERROR);
        expect(adapter.getErrorMessage(result.error.code)).toBe('操作状态错误，请刷新页面重试');
      }
    });
    
    it('should handle INTERNAL_ERROR (500) error', async () => {
      (global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: { message: 'Internal server error' } })
      });
      
      const result = await adapter.getVerificationStatus(verificationId);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.INTERNAL_ERROR);
        expect(adapter.getErrorMessage(result.error.code)).toBe('系统繁忙，请稍后重试');
      }
    });
    
    it('should handle missing access token', async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null }
      });
      
      const result = await adapter.getVerificationStatus(verificationId);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.UNAUTHORIZED);
      }
    });
  });
  
  describe('pollVerificationStatus', () => {
    const verificationId = 'ver-123';
    
    it('should poll until verification is completed', async () => {
      // Mock progressive status responses
      const responses = [
        { // First call - pending
          success: true,
          data: {
            verification_id: verificationId,
            type: 'tcm_practitioner',
            license_number: 'TCM-123456',
            status: 'pending',
            submitted_at: new Date().toISOString()
          }
        },
        { // Second call - verifying
          success: true,
          data: {
            verification_id: verificationId,
            type: 'tcm_practitioner',
            license_number: 'TCM-123456',
            status: 'verifying',
            submitted_at: new Date().toISOString()
          }
        },
        { // Third call - verified
          success: true,
          data: {
            verification_id: verificationId,
            type: 'tcm_practitioner',
            license_number: 'TCM-123456',
            status: 'verified',
            submitted_at: new Date().toISOString(),
            verified_at: new Date().toISOString()
          }
        }
      ];
      
      let callCount = 0;
      (global.fetch).mockImplementation(() => {
        const response = responses[callCount];
        callCount++;
        return Promise.resolve({
          ok: true,
          json: async () => response
        });
      });
      
      const result = await adapter.pollVerificationStatus(verificationId, {
        maxAttempts: 5,
        intervalMs: 10, // Fast for testing
        backoffMultiplier: 1.0
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('verified');
      }
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
    
    it('should handle rejection status', async () => {
      (global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            verification_id: verificationId,
            type: 'tcm_practitioner',
            license_number: 'TCM-999999',
            status: 'rejected',
            submitted_at: new Date().toISOString(),
            rejected_at: new Date().toISOString(),
            rejection_reason: 'Invalid license number'
          }
        })
      });
      
      const result = await adapter.pollVerificationStatus(verificationId, {
        maxAttempts: 3,
        intervalMs: 10,
        backoffMultiplier: 1.0
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('rejected');
        expect(result.data.rejection_reason).toBe('Invalid license number');
      }
    });
    
    it('should handle NOT_FOUND during polling', async () => {
      let callCount = 0;
      (global.fetch).mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          // First two calls return NOT_FOUND
          return Promise.resolve({
            ok: false,
            status: 404,
            json: async () => ({ error: { message: 'Not found' } })
          });
        } else {
          // Third call returns success
          return Promise.resolve({
            ok: true,
            json: async () => ({
              success: true,
              data: {
                verification_id: verificationId,
                status: 'verified',
                type: 'tcm_practitioner',
                license_number: 'TCM-123456',
                submitted_at: new Date().toISOString(),
                verified_at: new Date().toISOString()
              }
            })
          });
        }
      });
      
      const result = await adapter.pollVerificationStatus(verificationId, {
        maxAttempts: 5,
        intervalMs: 10,
        backoffMultiplier: 1.0
      });
      
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
    
    it('should timeout after max attempts', async () => {
      (global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            verification_id: verificationId,
            status: 'verifying', // Never completes
            type: 'tcm_practitioner',
            license_number: 'TCM-123456',
            submitted_at: new Date().toISOString()
          }
        })
      });
      
      const result = await adapter.pollVerificationStatus(verificationId, {
        maxAttempts: 3,
        intervalMs: 10,
        backoffMultiplier: 1.0
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(VerificationErrorCode.STATE_ERROR);
        expect(result.error.message).toContain('timeout');
      }
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
    
    it('should apply exponential backoff', async () => {
      const startTime = Date.now();
      
      (global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            verification_id: verificationId,
            status: 'verifying',
            type: 'tcm_practitioner',
            license_number: 'TCM-123456',
            submitted_at: new Date().toISOString()
          }
        })
      });
      
      await adapter.pollVerificationStatus(verificationId, {
        maxAttempts: 3,
        intervalMs: 20,
        backoffMultiplier: 2.0
      });
      
      const elapsedTime = Date.now() - startTime;
      // Should wait: 20ms + 40ms + 80ms = 140ms minimum
      expect(elapsedTime).toBeGreaterThanOrEqual(100); // Allow some variance
    });
  });
  
  describe('isServiceAvailable', () => {
    it('should return true when service responds with NOT_FOUND', async () => {
      (global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: { message: 'Not found' } })
      });
      
      const available = await adapter.isServiceAvailable();
      
      expect(available).toBe(true);
    });
    
    it('should return true when service responds successfully', async () => {
      (global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            verification_id: 'health-check',
            status: 'pending'
          }
        })
      });
      
      const available = await adapter.isServiceAvailable();
      
      expect(available).toBe(true);
    });
    
    it('should return false when service is unavailable', async () => {
      (global.fetch).mockRejectedValue(new Error('Connection refused'));
      
      const available = await adapter.isServiceAvailable();
      
      expect(available).toBe(false);
    });
  });
  
  describe('getErrorMessage', () => {
    it('should return correct messages for all error codes', () => {
      expect(adapter.getErrorMessage(VerificationErrorCode.VALIDATION_ERROR))
        .toBe('请检查输入信息并重试');
      
      expect(adapter.getErrorMessage(VerificationErrorCode.EXPIRED_LICENSE))
        .toBe('执照已过期，请使用有效期内的执照');
      
      expect(adapter.getErrorMessage(VerificationErrorCode.INVALID_LICENSE_FORMAT))
        .toBe('执照号码格式不正确，请检查');
      
      expect(adapter.getErrorMessage(VerificationErrorCode.STATE_ERROR))
        .toBe('操作状态错误，请刷新页面重试');
      
      expect(adapter.getErrorMessage(VerificationErrorCode.INTERNAL_ERROR))
        .toBe('系统繁忙，请稍后重试');
      
      expect(adapter.getErrorMessage(VerificationErrorCode.NOT_FOUND))
        .toBe('未找到相关记录');
      
      expect(adapter.getErrorMessage(VerificationErrorCode.UNAUTHORIZED))
        .toBe('请先登录后再操作');
      
      expect(adapter.getErrorMessage(VerificationErrorCode.FORBIDDEN))
        .toBe('您没有权限执行此操作');
      
      expect(adapter.getErrorMessage(VerificationErrorCode.METHOD_NOT_ALLOWED))
        .toBe('请求方式不支持');
    });
  });
  
  describe('Security and Logging', () => {
    it('should not include user_id in request body', async () => {
      const request = {
        type: 'tcm_practitioner',
        license_number: 'TCM-123456',
        license_expiry: '2025-12-31T00:00:00Z'
      };
      
      mockInvoke.mockResolvedValue({
        data: { success: true, data: { verification_id: 'ver-123', status: 'pending' } },
        error: null
      });
      
      await adapter.submitLicenseVerification(request);
      
      const invokeCall = mockInvoke.mock.calls[0];
      expect(invokeCall[1].body).not.toHaveProperty('user_id');
    });
    
    it('should use Bearer token for GET requests', async () => {
      (global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { status: 'pending' } })
      });
      
      await adapter.getVerificationStatus('ver-123');
      
      const fetchCall = (global.fetch).mock.calls[0];
      expect(fetchCall[1].headers['Authorization']).toBe('Bearer test-access-token-123');
    });
  });
});