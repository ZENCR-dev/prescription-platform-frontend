/**
 * TCM Theme Login Example
 * 
 * @implements Dev-Step 3.11: TCM Cultural Design Layer
 * @description Login form with TCM cultural theme and decorative elements
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
import { HerbalPattern } from '../compounds/HerbalPattern'
import { MeridianDecor } from '../compounds/MeridianDecor'
import { useLanguage } from '../../hooks/useLanguage'

export function LoginExampleTCM() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()
  const { texts, language, toggleLanguage } = useLanguage()
  
  // Form validation configuration
  const validationConfig: FormValidationConfig = {
    fields: [
      {
        name: 'email',
        rules: [
          { type: 'required', message: texts.invalidEmail },
          { type: 'email', message: texts.invalidEmail }
        ]
      },
      {
        name: 'password',
        rules: [
          { type: 'required', message: texts.invalidPassword },
          { type: 'minLength', value: 8, message: texts.invalidPassword }
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
      
      // Mock validation
      if (values.email === 'doctor@tcm.com' && values.password === 'password123') {
        setSuccess(language === 'zh' ? '登录成功！正在跳转...' : 'Login successful! Redirecting...')
      } else {
        throw new Error(texts.loginFailed)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : texts.loginFailed)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-tcm-sage-50 via-white to-tcm-bamboo-100 flex items-center justify-center p-4">
      {/* Background decorations */}
      <MeridianDecor 
        position="background" 
        variant="flowing" 
        opacity={0.03}
      />
      
      <div className="w-full max-w-md relative">
        {/* Top decoration */}
        <HerbalPattern 
          position="top-right" 
          density={0.2} 
          opacity={0.08}
        />
        
        <AuthCard
          className="border-2 border-tcm-sage-200 shadow-xl bg-white/95 backdrop-blur"
          title={texts.welcomeBack}
          subtitle={texts.signInPrompt}
          headerIcon={
            <div className="w-20 h-20 bg-gradient-to-br from-tcm-sage-100 to-tcm-bamboo-100 rounded-full flex items-center justify-center border-2 border-tcm-sage-300">
              {/* TCM Logo SVG */}
              <svg className="w-10 h-10 text-tcm-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 7a2.5 2.5 0 012.5 2.5c0 1.38-1.12 2.5-2.5 2.5a2.5 2.5 0 01-2.5-2.5A2.5 2.5 0 0112 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 12a2.5 2.5 0 012.5 2.5c0 1.38-1.12 2.5-2.5 2.5a2.5 2.5 0 01-2.5-2.5A2.5 2.5 0 0112 12z" />
                <circle cx="9.5" cy="14.5" r="1" fill="currentColor" />
                <circle cx="14.5" cy="9.5" r="1" fill="currentColor" />
              </svg>
            </div>
          }
        >
          {/* Language toggle */}
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleLanguage}
              className="text-sm text-tcm-sage-600 hover:text-tcm-sage-700 font-medium"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
          </div>
          
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
                    label={texts.emailLabel}
                    placeholder={texts.emailPlaceholder}
                    required
                    fullWidth
                    className="border-tcm-sage-200 focus:border-tcm-bamboo-400"
                    leftIcon={
                      <svg className="w-5 h-5 text-tcm-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    label={texts.passwordLabel}
                    placeholder={texts.passwordPlaceholder}
                    required
                    fullWidth
                    className="border-tcm-sage-200 focus:border-tcm-bamboo-400"
                    leftIcon={
                      <svg className="w-5 h-5 text-tcm-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <input 
                      type="checkbox" 
                      className="rounded border-tcm-sage-300 text-tcm-sage-600 focus:ring-tcm-sage-500" 
                    />
                    <span className="ml-2 text-sm text-gray-600">{texts.rememberMe}</span>
                  </label>
                  
                  <a href="#" className="text-sm text-tcm-sage-600 hover:text-tcm-sage-700">
                    {texts.forgotPassword}
                  </a>
                </div>
                
                <AuthFormActions>
                  <AuthButton
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={loading}
                    loadingText={language === 'zh' ? '登录中...' : 'Signing in...'}
                    className="bg-gradient-to-r from-tcm-sage-500 to-tcm-bamboo-500 hover:from-tcm-sage-600 hover:to-tcm-bamboo-600 text-white"
                  >
                    {texts.signIn}
                  </AuthButton>
                </AuthFormActions>
                
                <AuthFormDivider text={texts.or} />
                
                {/* TCM Philosophy Quote */}
                <div className="text-center py-3 px-4 bg-tcm-herb-100 rounded-lg border border-tcm-herb-200">
                  <p className="text-sm text-tcm-sage-700 italic">
                    {texts.quote}
                  </p>
                  <p className="text-xs text-tcm-sage-600 mt-1">
                    — {texts.quoteSource}
                  </p>
                </div>
                
                <AuthFormActions>
                  <AuthButton
                    type="button"
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={() => console.log('Register clicked')}
                    className="border-tcm-sage-300 text-tcm-sage-700 hover:bg-tcm-sage-50"
                  >
                    {texts.createAccount}
                  </AuthButton>
                </AuthFormActions>
              </>
            )}
          </AuthForm>
        </AuthCard>
        
        {/* Bottom decoration */}
        <HerbalPattern 
          position="bottom-left" 
          density={0.15} 
          opacity={0.06}
        />
        
        {/* Compliance footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-tcm-sage-600">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {texts.secure}
            </span>
            <span>•</span>
            <span>{texts.hipaaCompliant}</span>
            <span>•</span>
            <span>{texts.privacyProtected}</span>
          </div>
          <p className="mt-2 text-xs text-tcm-sage-500">
            {texts.tcmPhilosophy} • {texts.healingArt}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginExampleTCM