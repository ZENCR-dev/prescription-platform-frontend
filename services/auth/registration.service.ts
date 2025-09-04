/**
 * Registration Service with Adapter Pattern
 * 
 * @implements Dev-Step 3.8: Main registration service with factory pattern
 * @description Service layer that provides unified registration interface
 * @pattern Factory Pattern for adapter selection based on configuration
 */

import { SupabaseDirectAdapter } from './adapters/supabase-direct.adapter'
import { EdgeFunctionRegistrationAdapter } from './adapters/edge-function-registration.adapter'
import {
  RegistrationAdapter,
  RegistrationData,
  RegistrationResult,
  ValidationResult,
  AdapterConfig,
  RegistrationErrorCode
} from './adapters/types'

/**
 * Adapter types enum
 */
export enum AdapterType {
  SUPABASE_DIRECT = 'supabase-direct',
  EDGE_FUNCTION = 'edge-function'
}

/**
 * Registration Service Configuration
 */
export interface RegistrationServiceConfig {
  adapterType?: AdapterType
  adapterConfig?: AdapterConfig
  autoSelectAdapter?: boolean  // Automatically select best available adapter
}

/**
 * Main Registration Service
 * Provides unified interface for registration regardless of underlying adapter
 */
export class RegistrationService {
  private adapter: RegistrationAdapter | null = null
  private config: RegistrationServiceConfig
  private adapterPromise: Promise<RegistrationAdapter> | null = null
  
  constructor(config?: RegistrationServiceConfig) {
    this.config = {
      adapterType: config?.adapterType || AdapterType.EDGE_FUNCTION, // Default to Edge Function
      adapterConfig: config?.adapterConfig,
      autoSelectAdapter: config?.autoSelectAdapter ?? true
    }
    
    // Initialize adapter asynchronously
    this.initializeAdapter()
  }
  
  /**
   * Initialize adapter asynchronously
   */
  private async initializeAdapter(): Promise<void> {
    this.adapterPromise = this.createAdapter()
    this.adapter = await this.adapterPromise
  }
  
  /**
   * Ensure adapter is initialized before use
   */
  private async ensureAdapter(): Promise<RegistrationAdapter> {
    if (this.adapter) {
      return this.adapter
    }
    
    if (this.adapterPromise) {
      this.adapter = await this.adapterPromise
      return this.adapter
    }
    
    // Should not happen, but handle as fallback
    await this.initializeAdapter()
    return this.adapter!
  }
  
  /**
   * Factory method to create appropriate adapter
   */
  private async createAdapter(): Promise<RegistrationAdapter> {
    // If auto-select is enabled, try to use best available adapter
    if (this.config.autoSelectAdapter) {
      return await this.selectBestAdapter()
    }
    
    // Otherwise use configured adapter type
    switch (this.config.adapterType) {
      case AdapterType.EDGE_FUNCTION:
        return new EdgeFunctionRegistrationAdapter(this.config.adapterConfig)
      case AdapterType.SUPABASE_DIRECT:
      default:
        return new SupabaseDirectAdapter(this.config.adapterConfig)
    }
  }
  
  /**
   * Automatically select the best available adapter
   * Priority: Edge Function > Supabase Direct
   * 
   * @implements Dev-Step 3.5: 5xx degradation strategy
   * EUD Evidence: Lines 79-100 fallback mechanism implementation
   */
  private async selectBestAdapter(): Promise<RegistrationAdapter> {
    // Try Edge Function adapter first for better license validation
    const edgeAdapter = new EdgeFunctionRegistrationAdapter(this.config.adapterConfig)
    
    try {
      // Check if Edge Function service is available
      const isAvailable = await edgeAdapter.isAvailable()
      
      if (isAvailable) {
        console.log('[RegistrationService] Using Edge Function adapter for enhanced validation')
        return edgeAdapter
      } else {
        console.warn('[RegistrationService] Edge Function service unavailable, falling back to direct adapter')
      }
    } catch (error) {
      console.error('[RegistrationService] Edge Function availability check failed:', error)
    }
    
    // Fallback to Supabase Direct adapter for 5xx degradation
    console.log('[RegistrationService] Using Supabase Direct adapter (fallback mode)')
    return new SupabaseDirectAdapter(this.config.adapterConfig)
  }
  
  /**
   * Validate registration data
   */
  async validate(data: RegistrationData): Promise<ValidationResult> {
    try {
      const adapter = await this.ensureAdapter()
      return await adapter.validate(data)
    } catch (error) {
      console.error('Validation error:', error)
      return {
        isValid: false,
        errors: [{
          field: 'validation',
          code: RegistrationErrorCode.UNKNOWN_ERROR,
          message: 'Validation failed'
        }]
      }
    }
  }
  
  /**
   * Submit registration
   */
  async register(data: RegistrationData): Promise<RegistrationResult> {
    try {
      const adapter = await this.ensureAdapter()
      console.log(`[RegistrationService] Registering with adapter: ${adapter.getType()}`)
      return await adapter.submit(data)
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: {
          code: RegistrationErrorCode.UNKNOWN_ERROR,
          message: 'Registration failed - please try again'
        }
      }
    }
  }
  
  /**
   * Get current adapter type
   */
  async getAdapterType(): Promise<string> {
    const adapter = await this.ensureAdapter()
    return adapter.getType()
  }
  
  /**
   * Check if service is available
   */
  async isAvailable(): Promise<boolean> {
    const adapter = await this.ensureAdapter()
    return await adapter.isAvailable()
  }
  
  /**
   * Switch to a different adapter at runtime
   * Useful for A/B testing or gradual migration
   */
  async switchAdapter(type: AdapterType): Promise<void> {
    this.config.adapterType = type
    this.config.autoSelectAdapter = false // Disable auto-select when manually switching
    await this.initializeAdapter()
    const adapter = await this.ensureAdapter()
    console.log(`[RegistrationService] Switched to adapter: ${adapter.getType()}`)
  }
}

/**
 * Singleton instance for app-wide use
 */
let serviceInstance: RegistrationService | null = null

/**
 * Get or create registration service instance
 */
export function getRegistrationService(config?: RegistrationServiceConfig): RegistrationService {
  if (!serviceInstance) {
    serviceInstance = new RegistrationService(config)
  }
  return serviceInstance
}

/**
 * Reset service instance (useful for testing)
 */
export function resetRegistrationService(): void {
  serviceInstance = null
}

/**
 * Export types for consumer use
 */
export type {
  RegistrationData,
  RegistrationResult,
  ValidationResult,
  ValidationError,
  RegistrationError
} from './adapters/types'

export { RegistrationErrorCode } from './adapters/types'