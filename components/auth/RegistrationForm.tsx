'use client'

/**
 * Registration Form Component - M1.2 Authentication UI
 * 
 * @implements Frontend Lead Dev-Step 3.5 & 3.8
 * @design Based on registration.html prototype with TCM elements
 * @features Bilingual support, Role-based fields, Adapter Pattern integration
 * @migration Uses Registration Service with adapter pattern for Edge Function readiness
 */

import { useState, FormEvent } from 'react'
import { useLanguage } from './hooks/useLanguage'
import { useRouter } from 'next/navigation'
import { 
  getRegistrationService, 
  RegistrationData,
  RegistrationErrorCode 
} from '@/services/auth'

type UserRole = 'tcm_practitioner' | 'pharmacy' | 'admin'

export default function RegistrationForm() {
  const router = useRouter()
  const { toggleLanguage, texts, toggleButtonText } = useLanguage()
  
  // Form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('tcm_practitioner')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [pharmacyName, setPharmacyName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Handle form submission using Registration Service
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // Basic validation for password confirmation
      if (password !== confirmPassword) {
        setError(texts.passwordMismatch)
        setIsLoading(false)
        return
      }
      
      if (!agreeToTerms) {
        setError(texts.agreeToTerms)
        setIsLoading(false)
        return
      }
      
      // Prepare registration data for adapter pattern
      const registrationData: RegistrationData = {
        email,
        password,
        fullName,
        phone: phone || undefined,
        role: selectedRole,
        licenseNumber: selectedRole === 'tcm_practitioner' ? licenseNumber : undefined,
        pharmacyName: selectedRole === 'pharmacy' ? pharmacyName : undefined,
        inviteCode: selectedRole === 'admin' ? inviteCode : undefined,
      }
      
      // Get registration service instance
      const registrationService = getRegistrationService()
      
      // Log current adapter type for debugging
      console.log(`Using adapter: ${registrationService.getAdapterType()}`)
      
      // Validate using service (includes all field validation)
      const validation = await registrationService.validate(registrationData)
      
      if (!validation.isValid) {
        // Map validation errors to user-friendly messages
        const firstError = validation.errors[0]
        let errorMessage = texts.registrationFailed
        
        switch (firstError.code) {
          case RegistrationErrorCode.INVALID_EMAIL:
            errorMessage = texts.invalidEmail
            break
          case RegistrationErrorCode.WEAK_PASSWORD:
            errorMessage = texts.invalidPassword
            break
          case RegistrationErrorCode.MISSING_REQUIRED_FIELD:
            if (firstError.field === 'licenseNumber') {
              errorMessage = texts.missingLicenseNumber
            } else if (firstError.field === 'pharmacyName') {
              errorMessage = texts.missingPharmacyName
            } else if (firstError.field === 'inviteCode') {
              errorMessage = texts.missingInviteCode
            } else {
              errorMessage = firstError.message
            }
            break
          default:
            errorMessage = firstError.message
        }
        
        setError(errorMessage)
        setIsLoading(false)
        return
      }
      
      // Submit registration through service
      const result = await registrationService.register(registrationData)
      
      if (result.success) {
        // Registration successful
        console.log('Registration successful:', result.user?.id)
        
        // Navigate based on email verification requirement
        if (result.requiresEmailVerification) {
          router.push('/auth/verify-email')
        } else {
          // Direct to dashboard if no verification needed
          router.push('/dashboard')
        }
      } else {
        // Handle registration error
        console.error('Registration failed:', result.error)
        
        // Map error codes to user-friendly messages
        let errorMessage = texts.registrationFailed
        
        if (result.error?.code === RegistrationErrorCode.EMAIL_ALREADY_EXISTS) {
          errorMessage = 'This email is already registered'
        } else if (result.error?.code === RegistrationErrorCode.NETWORK_ERROR) {
          errorMessage = texts.networkError
        } else if (result.error?.message) {
          errorMessage = result.error.message
        }
        
        setError(errorMessage)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError(texts.networkError)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle OAuth registration
  // NOTE: OAuth still uses direct Supabase as it doesn't require validation
  // Will be migrated to service pattern when OAuth Edge Functions are available
  const handleOAuthSignup = async (provider: 'google' | 'apple') => {
    setError('')
    setIsLoading(true)
    
    try {
      // TODO: Migrate to registration service when OAuth adapter is ready
      // For now, OAuth doesn't need business validation so direct call is acceptable
      
      // Import supabase client only for OAuth (temporary)
      const { supabase } = await import('@/lib/supabase/client')
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      if (error) {
        console.error('OAuth error:', error)
        setError(texts.registrationFailed)
      }
    } catch (err) {
      console.error('OAuth error:', err)
      setError(texts.networkError)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white/80 backdrop-blur border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-all shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span>{toggleButtonText}</span>
        </button>
      </div>
      
      {/* Left Panel - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sage-50 to-cambridge-50 items-center justify-center relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-cambridge-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-sage-100 rounded-full opacity-30 blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-md px-8">
          {/* Taiji Symbol - Rotating */}
          <div className="mb-8 flex justify-center">
            <svg className="w-24 h-24 text-sage-600 animate-rotate-slow" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="currentColor" opacity="0.1"/>
              <path d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,0 50,50 A24,24 0 0,1 50,2" fill="currentColor" opacity="0.3"/>
              <circle cx="50" cy="26" r="8" fill="currentColor" opacity="0.3"/>
              <circle cx="50" cy="74" r="8" fill="white"/>
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-light text-sage-800 text-center mb-4">
            {texts.joinUs}
          </h1>
          
          <p className="text-sage-600 text-center text-lg font-light">
            {texts.modernizationPartner}
          </p>
          
          {/* Registration Benefits */}
          <div className="mt-12 space-y-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-cambridge-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sage-700 font-medium">{texts.professionalCertification}</p>
                <p className="text-sm text-sage-500">{texts.certificationDesc}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-cambridge-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="text-sage-700 font-medium">{texts.dataSecurity}</p>
                <p className="text-sm text-sage-500">{texts.dataSecurityDesc}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-cambridge-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="text-sage-700 font-medium">{texts.instantAccess}</p>
                <p className="text-sm text-sage-500">{texts.instantAccessDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <svg className="w-16 h-16 text-sage-600 mx-auto mb-4" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="currentColor" opacity="0.1"/>
              <path d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,0 50,50 A24,24 0 0,1 50,2" fill="currentColor" opacity="0.3"/>
              <circle cx="50" cy="26" r="8" fill="currentColor" opacity="0.3"/>
              <circle cx="50" cy="74" r="8" fill="white"/>
            </svg>
            <h1 className="text-2xl font-light text-sage-800">{texts.title}</h1>
          </div>
          
          {/* Registration Form */}
          <div className="bg-white p-8 shadow-sm border border-gray-100">
            {/* Form Title */}
            <h2 className="text-2xl font-light text-gray-800 mb-2">
              {texts.createAccount}
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              {texts.professionalInfo}
            </p>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                {error}
              </div>
            )}
            
            {/* Role Selection Tabs */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-3">
                {texts.accountType}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('tcm_practitioner')}
                  className={`flex-1 py-2 px-3 text-sm border-2 transition-all ${
                    selectedRole === 'tcm_practitioner'
                      ? 'border-cambridge-500 text-cambridge-700 bg-cambridge-50'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  {texts.tcmPractitioner}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('pharmacy')}
                  className={`flex-1 py-2 px-3 text-sm border-2 transition-all ${
                    selectedRole === 'pharmacy'
                      ? 'border-cambridge-500 text-cambridge-700 bg-cambridge-50'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  {texts.pharmacy}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`flex-1 py-2 px-3 text-sm border-2 transition-all ${
                    selectedRole === 'admin'
                      ? 'border-cambridge-500 text-cambridge-700 bg-cambridge-50'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  {texts.admin}
                </button>
              </div>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {texts.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-cambridge-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                    placeholder={texts.namePlaceholder}
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {texts.phone}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-cambridge-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                    placeholder={texts.phonePlaceholder}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {texts.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-cambridge-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  placeholder={texts.emailPlaceholder}
                  disabled={isLoading}
                />
              </div>
              
              {/* Dynamic Fields Based on Role */}
              {selectedRole === 'tcm_practitioner' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {texts.licenseNumber}
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-cambridge-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                    placeholder={texts.licenseNumberPlaceholder}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              {selectedRole === 'pharmacy' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {texts.pharmacyName}
                  </label>
                  <input
                    type="text"
                    required
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-cambridge-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                    placeholder={texts.pharmacyNamePlaceholder}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              {selectedRole === 'admin' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {texts.inviteCode}
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-cambridge-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                    placeholder={texts.inviteCodePlaceholder}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              {/* Password */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {texts.setPassword}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-cambridge-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  placeholder={texts.passwordRequirement}
                  disabled={isLoading}
                />
              </div>
              
              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {texts.confirmPassword}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-cambridge-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  placeholder={texts.confirmPasswordPlaceholder}
                  disabled={isLoading}
                />
              </div>
              
              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 mr-2 text-cambridge-600 focus:ring-cambridge-500"
                  disabled={isLoading}
                />
                <label className="text-sm text-gray-600">
                  {texts.agreeToTerms}{' '}
                  <a href="/terms" className="text-sage-600 hover:text-sage-700">
                    {texts.termsOfService}
                  </a>{' '}
                  {texts.and}{' '}
                  <a href="/privacy" className="text-sage-600 hover:text-sage-700">
                    {texts.privacyPolicy}
                  </a>
                </label>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-sage-600 text-white font-light tracking-wide hover:bg-sage-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  texts.createAccountButton
                )}
              </button>
            </form>
            
            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">
                  {texts.orSignUpWith}
                </span>
              </div>
            </div>
            
            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuthSignup('google')}
                disabled={isLoading}
                className="py-2.5 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm text-gray-600">Google</span>
              </button>
              
              <button
                onClick={() => handleOAuthSignup('apple')}
                disabled={isLoading}
                className="py-2.5 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                <span className="text-sm text-gray-600">Apple</span>
              </button>
            </div>
            
            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              {texts.alreadyHaveAccount}
              <a href="/auth/login" className="text-sage-600 hover:text-sage-700 font-medium ml-1">
                {texts.signInLink}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}