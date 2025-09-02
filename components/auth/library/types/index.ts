/**
 * Authentication Component Library Type Definitions
 * 
 * @implements Dev-Step 3.10: Component Library Extensions
 * @description Shared types for authentication component library
 */

import { ValidationRule, ValidationResult } from '../../../../hooks/useFieldValidation'
import { FormValidationConfig } from '../../../../hooks/useFormValidation'

// Re-export validation types for convenience
export type { ValidationRule, ValidationResult, FormValidationConfig }

/**
 * Common component variant types
 */
export type ComponentSize = 'sm' | 'md' | 'lg'
export type ComponentVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type CardVariant = 'default' | 'elevated' | 'bordered'
export type LayoutVariant = 'centered' | 'split' | 'sidebar'

/**
 * Language options for internationalization
 */
export type Language = 'en' | 'zh'

/**
 * Common props shared across components
 */
export interface CommonComponentProps {
  className?: string
  loading?: boolean
  disabled?: boolean
  error?: string
  success?: string
  'data-testid'?: string
}

/**
 * Icon component props
 */
export interface IconProps {
  className?: string
  size?: number
}

/**
 * Link type for footer and navigation
 */
export interface Link {
  label: string
  href: string
  external?: boolean
}

/**
 * Option type for select components
 */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

/**
 * Form field configuration
 */
export interface FieldConfig {
  name: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  rules?: ValidationRule[]
  defaultValue?: string | number | boolean
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  primaryColor?: string
  secondaryColor?: string
  errorColor?: string
  successColor?: string
  warningColor?: string
}

/**
 * Medical platform specific props
 */
export interface MedicalPlatformProps {
  role?: 'tcm_practitioner' | 'pharmacy' | 'admin'
  complianceText?: string
  licenseInfo?: string
}