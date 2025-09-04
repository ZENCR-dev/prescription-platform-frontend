/**
 * Form Validation Hook
 * 
 * @implements Dev-Step 3.9: Enhanced UI States - Form-level validation orchestration
 * @description Manages validation state for entire forms with field tracking
 */

import { useState, useCallback, useRef } from 'react'
import { ValidationRule, ValidationResult } from './useFieldValidation'

export interface FieldConfig {
  name: string
  rules: ValidationRule[]
  debounceMs?: number
}

export interface FormValidationState {
  fields: Record<string, ValidationResult>
  isFormValid: boolean
  touchedFields: Set<string>
  submitAttempts: number
  isSubmitting: boolean
}

export interface FormValidationConfig {
  fields: FieldConfig[]
  onSubmit?: (values: Record<string, any>) => Promise<void> | void
  validateOnBlur?: boolean
  validateOnChange?: boolean
  showErrorsOnSubmit?: boolean
}

export function useFormValidation(config: FormValidationConfig) {
  const [state, setState] = useState<FormValidationState>({
    fields: {},
    isFormValid: true,
    touchedFields: new Set(),
    submitAttempts: 0,
    isSubmitting: false
  })
  
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})
  const fieldValues = useRef<Record<string, any>>({})
  
  // Validate a single field
  const validateField = useCallback((fieldName: string, value: any): ValidationResult => {
    const fieldConfig = config.fields.find(f => f.name === fieldName)
    if (!fieldConfig) {
      return { isValid: true, isValidating: false }
    }
    
    // Store field value
    fieldValues.current[fieldName] = value
    
    // Validate against rules
    for (const rule of fieldConfig.rules) {
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return {
              isValid: false,
              isValidating: false,
              error: rule.message || 'This field is required',
              feedback: 'error'
            }
          }
          break
          
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return {
              isValid: false,
              isValidating: false,
              error: rule.message || 'Please enter a valid email',
              feedback: 'error'
            }
          }
          break
          
        case 'minLength':
          if (value && value.length < rule.value) {
            return {
              isValid: false,
              isValidating: false,
              error: rule.message || `Must be at least ${rule.value} characters`,
              feedback: 'error'
            }
          }
          break
          
        case 'maxLength':
          if (value && value.length > rule.value) {
            return {
              isValid: false,
              isValidating: false,
              error: rule.message || `Must be no more than ${rule.value} characters`,
              feedback: 'error'
            }
          }
          break
          
        case 'pattern':
          if (value && !rule.value.test(value)) {
            return {
              isValid: false,
              isValidating: false,
              error: rule.message || 'Invalid format',
              feedback: 'error'
            }
          }
          break
          
        case 'custom':
          const result = rule.validate(value)
          if (result !== true) {
            return {
              isValid: false,
              isValidating: false,
              error: typeof result === 'string' ? result : rule.message || 'Validation failed',
              feedback: 'error'
            }
          }
          break
      }
    }
    
    return { isValid: true, isValidating: false, feedback: 'success' }
  }, [config.fields])
  
  // Validate field with debouncing
  const validateFieldDebounced = useCallback((fieldName: string, value: any) => {
    const fieldConfig = config.fields.find(f => f.name === fieldName)
    if (!fieldConfig) return
    
    // Clear existing timer
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName])
    }
    
    // Set validating state
    setState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: { ...prev.fields[fieldName], isValidating: true }
      }
    }))
    
    // Debounce validation
    debounceTimers.current[fieldName] = setTimeout(() => {
      const result = validateField(fieldName, value)
      setState(prev => {
        const newFields = { ...prev.fields, [fieldName]: result }
        const isFormValid = Object.values(newFields).every(field => field.isValid !== false)
        return {
          ...prev,
          fields: newFields,
          isFormValid
        }
      })
    }, fieldConfig.debounceMs || 300)
  }, [config.fields, validateField])
  
  // Handle field change
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    fieldValues.current[fieldName] = value
    
    if (config.validateOnChange !== false) {
      validateFieldDebounced(fieldName, value)
    }
  }, [config.validateOnChange, validateFieldDebounced])
  
  // Handle field blur
  const handleFieldBlur = useCallback((fieldName: string) => {
    setState(prev => ({
      ...prev,
      touchedFields: new Set(prev.touchedFields).add(fieldName)
    }))
    
    if (config.validateOnBlur !== false) {
      const value = fieldValues.current[fieldName]
      const result = validateField(fieldName, value)
      setState(prev => {
        const newFields = { ...prev.fields, [fieldName]: result }
        const isFormValid = Object.values(newFields).every(field => field.isValid !== false)
        return {
          ...prev,
          fields: newFields,
          isFormValid
        }
      })
    }
  }, [config.validateOnBlur, validateField])
  
  // Validate all fields
  const validateAllFields = useCallback((): boolean => {
    const results: Record<string, ValidationResult> = {}
    let isValid = true
    
    for (const fieldConfig of config.fields) {
      const value = fieldValues.current[fieldConfig.name]
      const result = validateField(fieldConfig.name, value)
      results[fieldConfig.name] = result
      if (!result.isValid) {
        isValid = false
      }
    }
    
    setState(prev => ({
      ...prev,
      fields: results,
      isFormValid: isValid,
      touchedFields: new Set(config.fields.map(f => f.name))
    }))
    
    return isValid
  }, [config.fields, validateField])
  
  // Show all errors
  const showAllErrors = useCallback(() => {
    validateAllFields()
    setState(prev => ({
      ...prev,
      touchedFields: new Set(config.fields.map(f => f.name))
    }))
  }, [config.fields, validateAllFields])
  
  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    setState(prev => ({
      ...prev,
      submitAttempts: prev.submitAttempts + 1,
      isSubmitting: true
    }))
    
    // Validate all fields
    const isValid = validateAllFields()
    
    if (!isValid) {
      setState(prev => ({
        ...prev,
        isSubmitting: false
      }))
      
      if (config.showErrorsOnSubmit !== false) {
        showAllErrors()
      }
      
      return false
    }
    
    // Call onSubmit if provided
    if (config.onSubmit) {
      try {
        await config.onSubmit(fieldValues.current)
        setState(prev => ({
          ...prev,
          isSubmitting: false
        }))
        return true
      } catch (error) {
        setState(prev => ({
          ...prev,
          isSubmitting: false
        }))
        throw error
      }
    }
    
    setState(prev => ({
      ...prev,
      isSubmitting: false
    }))
    return true
  }, [config, validateAllFields, showAllErrors])
  
  // Reset form
  const resetForm = useCallback(() => {
    fieldValues.current = {}
    setState({
      fields: {},
      isFormValid: true,
      touchedFields: new Set(),
      submitAttempts: 0,
      isSubmitting: false
    })
    
    // Clear all timers
    Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer))
    debounceTimers.current = {}
  }, [])
  
  // Get field error (only if touched or submitted)
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    const field = state.fields[fieldName]
    const isTouched = state.touchedFields.has(fieldName)
    const hasSubmitted = state.submitAttempts > 0
    
    if (field && !field.isValid && (isTouched || hasSubmitted)) {
      return field.error
    }
    
    return undefined
  }, [state.fields, state.touchedFields, state.submitAttempts])
  
  // Get field validation state
  const getFieldState = useCallback((fieldName: string) => {
    const field = state.fields[fieldName] || { isValid: true, isValidating: false }
    const isTouched = state.touchedFields.has(fieldName)
    const hasSubmitted = state.submitAttempts > 0
    
    return {
      ...field,
      isTouched,
      hasSubmitted,
      showError: !field.isValid && (isTouched || hasSubmitted)
    }
  }, [state.fields, state.touchedFields, state.submitAttempts])
  
  // Set field value programmatically
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    fieldValues.current[fieldName] = value
    handleFieldChange(fieldName, value)
  }, [handleFieldChange])
  
  // Get all field values
  const getValues = useCallback(() => {
    return { ...fieldValues.current }
  }, [])
  
  return {
    // State
    ...state,
    
    // Field handlers
    handleFieldChange,
    handleFieldBlur,
    setFieldValue,
    
    // Form handlers
    handleSubmit,
    resetForm,
    
    // Validation
    validateField,
    validateAllFields,
    showAllErrors,
    
    // Getters
    getFieldError,
    getFieldState,
    getValues
  }
}