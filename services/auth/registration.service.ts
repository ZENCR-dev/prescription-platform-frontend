/**
 * Registration Service with Adapter Pattern
 * 
 * @implements Dev-Step 3.8: Main registration service with factory pattern
 * @description Service layer that provides unified registration interface
 * @pattern Factory Pattern for adapter selection based on configuration
 */

import { SupabaseDirectAdapter } from './adapters/supabase-direct.adapter'
import { EdgeFunctionAdapter } from './adapters/edge-function.adapter'
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
  private adapter: RegistrationAdapter
  private config: RegistrationServiceConfig
  
  constructor(config?: RegistrationServiceConfig) {
    this.config = {
      adapterType: config?.adapterType || AdapterType.SUPABASE_DIRECT,
      adapterConfig: config?.adapterConfig,
      autoSelectAdapter: config?.autoSelectAdapter ?? true
    }
    
    // Initialize adapter
    this.adapter = this.createAdapter()
  }
  
  /**
   * Factory method to create appropriate adapter
   */
  private createAdapter(): RegistrationAdapter {
    // If auto-select is enabled, try to use best available adapter
    if (this.config.autoSelectAdapter) {
      return this.selectBestAdapter()
    }
    
    // Otherwise use configured adapter type
    switch (this.config.adapterType) {
      case AdapterType.EDGE_FUNCTION:
        return new EdgeFunctionAdapter(this.config.adapterConfig)
      case AdapterType.SUPABASE_DIRECT:
      default:
        return new SupabaseDirectAdapter(this.config.adapterConfig)
    }
  }
  
  /**
   * Automatically select the best available adapter
   * Priority: Edge Function > Supabase Direct
   */
  private selectBestAdapter(): RegistrationAdapter {
    // Check if Edge Function adapter is available
    const edgeAdapter = new EdgeFunctionAdapter(this.config.adapterConfig)
    
    // For now, always use Supabase Direct since Edge Functions aren't ready
    // When backend provides Edge Functions, this will check availability
    // and prefer Edge Functions for better validation
    
    // TODO: Uncomment when Edge Functions are ready
    // if (await edgeAdapter.isAvailable()) {
    //   console.log('Using Edge Function adapter for registration')
    //   return edgeAdapter
    // }
    
    console.log('Using Supabase Direct adapter for registration')
    return new SupabaseDirectAdapter(this.config.adapterConfig)
  }
  
  /**
   * Validate registration data
   */
  async validate(data: RegistrationData): Promise<ValidationResult> {
    try {
      return await this.adapter.validate(data)
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
      console.log(`Registering with adapter: ${this.adapter.getType()}`)
      return await this.adapter.submit(data)
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
  getAdapterType(): string {
    return this.adapter.getType()
  }
  
  /**
   * Check if service is available
   */
  async isAvailable(): Promise<boolean> {
    return await this.adapter.isAvailable()
  }
  
  /**
   * Switch to a different adapter at runtime
   * Useful for A/B testing or gradual migration
   */
  switchAdapter(type: AdapterType): void {
    this.config.adapterType = type
    this.adapter = this.createAdapter()
    console.log(`Switched to adapter: ${this.adapter.getType()}`)
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