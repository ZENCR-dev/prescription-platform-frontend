/**
 * Authentication Component Library
 * 
 * @implements Dev-Step 3.10: Component Library Extensions
 * @description Unified exports for authentication component library
 */

// Primitive components
export { AuthInput } from './primitives/AuthInput'
export { AuthButton } from './primitives/AuthButton'

// Compound components
export { 
  AuthCard,
  AuthCardHeader,
  AuthCardContent,
  AuthCardFooter
} from './compounds/AuthCard'

export { 
  AuthForm,
  AuthFormField,
  AuthFormActions,
  AuthFormDivider
} from './compounds/AuthForm'

// TCM Decorative components (Dev-Step 3.11)
export { HerbalPattern } from './compounds/HerbalPattern'
export { MeridianDecor } from './compounds/MeridianDecor'

// Type exports
export type {
  // Common types
  ComponentSize,
  ComponentVariant,
  CardVariant,
  LayoutVariant,
  Language,
  CommonComponentProps,
  IconProps,
  Link,
  SelectOption,
  FieldConfig,
  ThemeConfig,
  MedicalPlatformProps,
  
  // Validation types (re-exported)
  ValidationRule,
  ValidationResult,
  FormValidationConfig
} from './types'

// Component prop types
export type { AuthInputProps } from './primitives/AuthInput'
export type { AuthButtonProps } from './primitives/AuthButton'
export type { AuthCardProps } from './compounds/AuthCard'
export type { AuthFormProps } from './compounds/AuthForm'
export type { HerbalPatternProps } from './compounds/HerbalPattern'
export type { MeridianDecorProps } from './compounds/MeridianDecor'