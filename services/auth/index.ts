/**
 * Auth Services Export
 * 
 * @implements Dev-Step 3.8: Centralized auth service exports
 * @description Single entry point for auth-related services
 */

export {
  RegistrationService,
  getRegistrationService,
  resetRegistrationService,
  AdapterType
} from './registration.service'

export type {
  RegistrationData,
  RegistrationResult,
  ValidationResult,
  ValidationError,
  RegistrationError,
  RegistrationServiceConfig
} from './registration.service'

export { RegistrationErrorCode } from './adapters/types'

export type { UserRole } from './adapters/types'