// @ts-nocheck
/**
 * Unit Tests for Registration Service
 * 
 * @implements Dev-Step 3.8: Test adapter pattern implementation
 * @description Comprehensive unit tests for registration service and adapters
 */

import {
  getRegistrationService,
  resetRegistrationService,
  RegistrationData,
  RegistrationErrorCode,
  AdapterType
} from '../index'

describe('RegistrationService', () => {
  beforeEach(() => {
    // Reset service instance before each test
    resetRegistrationService()
  })

  describe('Service Creation', () => {
    it('should create a service instance', () => {
      const service = getRegistrationService()
      expect(service).toBeDefined()
      expect(service.getAdapterType).toBeDefined()
      expect(service.validate).toBeDefined()
      expect(service.register).toBeDefined()
    })

    it('should return singleton instance', () => {
      const service1 = getRegistrationService()
      const service2 = getRegistrationService()
      expect(service1).toBe(service2)
    })

    it('should reset instance when requested', () => {
      const service1 = getRegistrationService()
      resetRegistrationService()
      const service2 = getRegistrationService()
      expect(service1).not.toBe(service2)
    })
  })

  describe('Adapter Selection', () => {
    it('should use SupabaseDirectAdapter by default', () => {
      const service = getRegistrationService()
      expect(service.getAdapterType()).toBe('supabase-direct')
    })

    it('should allow adapter switching', () => {
      const service = getRegistrationService()
      service.switchAdapter(AdapterType.SUPABASE_DIRECT)
      expect(service.getAdapterType()).toBe('supabase-direct')
    })
  })

  describe('Validation', () => {
    let service: ReturnType<typeof getRegistrationService>

    beforeEach(() => {
      service = getRegistrationService()
    })

    it('should validate valid TCM practitioner data', async () => {
      const data: RegistrationData = {
        email: 'doctor@tcm.com',
        password: 'SecurePass123!',
        fullName: 'Dr. Zhang Wei',
        role: 'tcm_practitioner',
        licenseNumber: '110000202412345678'
      }

      const result = await service.validate(data)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate valid pharmacy data', async () => {
      const data: RegistrationData = {
        email: 'pharmacy@example.com',
        password: 'SecurePass123!',
        fullName: 'Manager Wang',
        role: 'pharmacy',
        pharmacyName: 'Tongrentang Pharmacy'
      }

      const result = await service.validate(data)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate valid admin data', async () => {
      const data: RegistrationData = {
        email: 'admin@platform.com',
        password: 'SecurePass123!',
        fullName: 'Admin User',
        role: 'admin',
        inviteCode: 'ADMIN-2024-VALID'
      }

      const result = await service.validate(data)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid email', async () => {
      const data: RegistrationData = {
        email: 'invalid-email',
        password: 'SecurePass123!',
        fullName: 'Test User',
        role: 'tcm_practitioner',
        licenseNumber: '123456'
      }

      const result = await service.validate(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          code: RegistrationErrorCode.INVALID_EMAIL
        })
      )
    })

    it('should reject weak password', async () => {
      const data: RegistrationData = {
        email: 'test@example.com',
        password: 'weak',
        fullName: 'Test User',
        role: 'pharmacy',
        pharmacyName: 'Test Pharmacy'
      }

      const result = await service.validate(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'password',
          code: RegistrationErrorCode.WEAK_PASSWORD
        })
      )
    })

    it('should require license number for TCM practitioner', async () => {
      const data: RegistrationData = {
        email: 'doctor@tcm.com',
        password: 'SecurePass123!',
        fullName: 'Dr. Zhang',
        role: 'tcm_practitioner'
        // Missing licenseNumber
      }

      const result = await service.validate(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'licenseNumber',
          code: RegistrationErrorCode.MISSING_REQUIRED_FIELD
        })
      )
    })

    it('should require pharmacy name for pharmacy role', async () => {
      const data: RegistrationData = {
        email: 'pharmacy@example.com',
        password: 'SecurePass123!',
        fullName: 'Manager',
        role: 'pharmacy'
        // Missing pharmacyName
      }

      const result = await service.validate(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'pharmacyName',
          code: RegistrationErrorCode.MISSING_REQUIRED_FIELD
        })
      )
    })

    it('should require invite code for admin role', async () => {
      const data: RegistrationData = {
        email: 'admin@platform.com',
        password: 'SecurePass123!',
        fullName: 'Admin',
        role: 'admin'
        // Missing inviteCode
      }

      const result = await service.validate(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'inviteCode',
          code: RegistrationErrorCode.MISSING_REQUIRED_FIELD
        })
      )
    })

    it('should validate multiple errors', async () => {
      const data: RegistrationData = {
        email: 'bad',
        password: '123',
        fullName: 'A',
        role: 'tcm_practitioner'
        // Missing license
      }

      const result = await service.validate(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })
  })

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      const service = getRegistrationService()
      const data = {} as RegistrationData // Invalid data

      const result = await service.validate(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })
})

// Export for test runner
export {}