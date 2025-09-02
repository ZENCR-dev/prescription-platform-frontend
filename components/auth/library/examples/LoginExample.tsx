/**
 * Login Form Example using Auth Component Library
 * 
 * @implements Dev-Step 3.10: Component Library Extensions
 * @description Example implementation showing library usage
 */

import React, { useState } from 'react'
import {
  AuthCard,
  AuthForm,
  AuthFormField,
  AuthFormActions,
  AuthFormDivider,
  AuthInput,
  AuthButton,
  FormValidationConfig
} from '../index'

export function LoginExample() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()
  
  // Form validation configuration
  const validationConfig: FormValidationConfig = {
    fields: [
      {
        name: 'email',
        rules: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email address' }
        ]
      },
      {
        name: 'password',
        rules: [
          { type: 'required', message: 'Password is required' },
          { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' }
        ]
      }
    ]
  }
  
  // Handle form submission
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    setLoading(true)
    setError(undefined)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check credentials (mock)
      if (values.email === 'doctor@tcm.com' && values.password === 'password123') {
        setSuccess('Login successful! Redirecting...')
        // Redirect logic here
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthCard
          title="Welcome Back"
          subtitle="Sign in to your TCM practitioner account"
          headerIcon={
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          }
        >
          <AuthForm
            validation={validationConfig}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            success={success}
          >
            {(form) => (
              <>
                <AuthFormField>
                  <AuthInput
                    type="email"
                    label="Email Address"
                    placeholder="doctor@tcm.com"
                    required
                    fullWidth
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    }
                    {...form.getFieldState('email')}
                    onChange={(e) => form.handleFieldChange('email', e.target.value)}
                    onBlur={() => form.handleFieldBlur('email')}
                  />
                </AuthFormField>
                
                <AuthFormField>
                  <AuthInput
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    required
                    fullWidth
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                    {...form.getFieldState('password')}
                    onChange={(e) => form.handleFieldChange('password', e.target.value)}
                    onBlur={() => form.handleFieldBlur('password')}
                  />
                </AuthFormField>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-sage-600 focus:ring-sage-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  
                  <a href="#" className="text-sm text-sage-600 hover:text-sage-700">
                    Forgot password?
                  </a>
                </div>
                
                <AuthFormActions>
                  <AuthButton
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={loading}
                    loadingText="Signing in..."
                  >
                    Sign In
                  </AuthButton>
                </AuthFormActions>
                
                <AuthFormDivider text="OR" />
                
                <AuthFormActions>
                  <AuthButton
                    type="button"
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={() => console.log('Register clicked')}
                  >
                    Create New Account
                  </AuthButton>
                </AuthFormActions>
              </>
            )}
          </AuthForm>
        </AuthCard>
        
        {/* Compliance footer */}
        <p className="mt-4 text-center text-xs text-gray-500">
          By signing in, you agree to comply with medical data protection regulations
        </p>
      </div>
    </div>
  )
}

export default LoginExample