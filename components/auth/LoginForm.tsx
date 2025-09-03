'use client'

/**
 * Login Form Component - M1.2 Authentication UI
 * 
 * @implements Frontend Lead Dev-Step 3.4
 * @design Based on login-v3-minimal-tcm.html prototype
 * @features Bilingual support, Supabase Auth, Responsive design, TCM elements
 */

import { useState, FormEvent } from 'react'
import { useLanguage } from './hooks/useLanguage'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const { toggleLanguage, texts, toggleButtonText } = useLanguage()
  
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // Validate inputs
      if (!email || !email.includes('@')) {
        setError(texts.invalidEmail)
        setIsLoading(false)
        return
      }
      
      if (!password || password.length < 8) {
        setError(texts.invalidPassword)
        setIsLoading(false)
        return
      }
      
      // Sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (authError) {
        console.error('Login error:', authError)
        setError(texts.loginFailed)
        setIsLoading(false)
        return
      }
      
      // Handle remember me
      if (rememberMe) {
        // Supabase handles session persistence automatically
        // This is just for UI state
        localStorage.setItem('rememberEmail', email)
      } else {
        localStorage.removeItem('rememberEmail')
      }
      
      // Login successful - wait for session sync then navigate safely
      if (data.user) {
        // Brief delay to allow auth state change to trigger and complete callback
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Refresh router state to pick up new authentication cookies
        router.refresh()
        
        // Navigate to license verification page instead of protected dashboard routes
        // This avoids middleware redirect loops while session cookies are being established
        router.push('/professional/license')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError(texts.networkError)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle OAuth login
  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setError('')
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error('OAuth error:', error)
        setError(texts.loginFailed)
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
            {texts.ancientWisdom}
          </h1>
          
          <p className="text-sage-600 text-center text-lg font-light">
            {texts.bridgingTradition}
          </p>
          
          {/* Quote */}
          <div className="mt-12 border-l-2 border-cambridge-300 pl-4">
            <p className="text-sage-700 italic">{texts.quote}</p>
            <p className="text-sm text-sage-500 mt-1">{texts.quoteSource}</p>
          </div>
          
          {/* Features */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center text-sage-600">
              <div className="w-8 h-px bg-cambridge-400 mr-4"></div>
              <span>{texts.secureManagement}</span>
            </div>
            <div className="flex items-center text-sage-600">
              <div className="w-8 h-px bg-cambridge-400 mr-4"></div>
              <span>{texts.intelligentSupport}</span>
            </div>
            <div className="flex items-center text-sage-600">
              <div className="w-8 h-px bg-cambridge-400 mr-4"></div>
              <span>{texts.completeTraceability}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
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
          
          {/* Login Form */}
          <div className="bg-white p-8 shadow-sm border border-gray-100">
            {/* Form Title */}
            <h2 className="text-2xl font-light text-gray-800 mb-2">
              {texts.welcomeBack}
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              {texts.signInPrompt}
            </p>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
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
              
              {/* Password Input */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {texts.passwordLabel}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:border-cambridge-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  placeholder={texts.passwordPlaceholder}
                  disabled={isLoading}
                />
              </div>
              
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <div className="relative w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-cambridge-500 transition-colors">
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                  </div>
                  <span className="ml-3 text-gray-600 group-hover:text-gray-800">
                    {texts.rememberMe}
                  </span>
                </label>
                <a href="/auth/forgot-password" className="text-sage-600 hover:text-sage-700 transition-colors">
                  {texts.forgotPassword}
                </a>
              </div>
              
              {/* Login Button */}
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
                  texts.signIn
                )}
              </button>
            </form>
            
            {/* Divider */}
            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">
                  {texts.or}
                </span>
              </div>
            </div>
            
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleOAuthLogin('google')}
                disabled={isLoading}
                className="w-full py-2.5 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-600 group-hover:text-gray-800 font-light">
                  {texts.continueWithGoogle}
                </span>
              </button>
              
              <button
                onClick={() => handleOAuthLogin('apple')}
                disabled={isLoading}
                className="w-full py-2.5 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                <span className="text-gray-600 group-hover:text-gray-800 font-light">
                  {texts.continueWithApple}
                </span>
              </button>
            </div>
            
            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              {texts.noAccount}
              <a href="/auth/register" className="text-sage-600 hover:text-sage-700 font-medium ml-1">
                {texts.signUp}
              </a>
            </p>
            
            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center text-xs text-gray-400 gap-4">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                  <span>{texts.secure}</span>
                </span>
                <span>·</span>
                <span>{texts.hipaaCompliant}</span>
                <span>·</span>
                <span>{texts.privacyProtected}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}