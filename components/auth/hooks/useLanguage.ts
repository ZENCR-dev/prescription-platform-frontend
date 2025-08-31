/**
 * Language Management Hook for Authentication UI
 * Provides bilingual support (Chinese/English) with localStorage persistence
 * 
 * @implements Frontend Lead Dev-Step 3.4
 * @design Follows login-v3-minimal-tcm.html bilingual system
 */

import { useState, useEffect, useCallback } from 'react'

export type Language = 'zh' | 'en'

interface Translations {
  // Common
  title: string
  subtitle: string
  
  // Login Form
  welcomeBack: string
  signInPrompt: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  rememberMe: string
  forgotPassword: string
  signIn: string
  or: string
  continueWithGoogle: string
  continueWithApple: string
  noAccount: string
  signUp: string
  
  // Left Panel (Desktop)
  ancientWisdom: string
  bridgingTradition: string
  quote: string
  quoteSource: string
  secureManagement: string
  intelligentSupport: string
  completeTraceability: string
  
  // Footer
  secure: string
  hipaaCompliant: string
  privacyProtected: string
  
  // Error Messages
  invalidEmail: string
  invalidPassword: string
  loginFailed: string
  networkError: string
}

const translations: Record<Language, Translations> = {
  zh: {
    // Common
    title: '中医处方平台',
    subtitle: 'TCM Prescription Platform',
    
    // Login Form
    welcomeBack: '欢迎回来',
    signInPrompt: '请登录您的账户',
    emailLabel: '邮箱地址',
    emailPlaceholder: 'your@email.com',
    passwordLabel: '密码',
    passwordPlaceholder: '输入您的密码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    signIn: '登 录',
    or: '或',
    continueWithGoogle: '使用 Google 账号登录',
    continueWithApple: '使用 Apple ID 登录',
    noAccount: '还没有账户？',
    signUp: '立即注册',
    
    // Left Panel
    ancientWisdom: '传承千年医道',
    bridgingTradition: '融合传统智慧与现代科技',
    quote: '"上工治未病，不治已病"',
    quoteSource: '《黄帝内经》',
    secureManagement: '安全可靠的处方管理',
    intelligentSupport: '智能化诊疗辅助',
    completeTraceability: '全程追溯保障',
    
    // Footer
    secure: '安全连接',
    hipaaCompliant: 'HIPAA 合规',
    privacyProtected: '隐私保护',
    
    // Error Messages
    invalidEmail: '请输入有效的邮箱地址',
    invalidPassword: '密码长度至少为8位',
    loginFailed: '登录失败，请检查您的邮箱和密码',
    networkError: '网络连接错误，请稍后重试',
  },
  en: {
    // Common
    title: 'TCM Platform',
    subtitle: 'Traditional Chinese Medicine',
    
    // Login Form
    welcomeBack: 'Welcome Back',
    signInPrompt: 'Please sign in to your account',
    emailLabel: 'Email Address',
    emailPlaceholder: 'your@email.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign In',
    or: 'OR',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    
    // Left Panel
    ancientWisdom: 'Ancient Wisdom',
    bridgingTradition: 'Bridging Tradition and Technology',
    quote: '"Superior doctors prevent disease"',
    quoteSource: 'Huangdi Neijing',
    secureManagement: 'Secure Prescription Management',
    intelligentSupport: 'Intelligent Diagnosis Support',
    completeTraceability: 'Complete Traceability',
    
    // Footer
    secure: 'Secure',
    hipaaCompliant: 'HIPAA Compliant',
    privacyProtected: 'Privacy Protected',
    
    // Error Messages
    invalidEmail: 'Please enter a valid email address',
    invalidPassword: 'Password must be at least 8 characters',
    loginFailed: 'Login failed. Please check your email and password',
    networkError: 'Network error. Please try again later',
  }
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('zh')
  const [isLoading, setIsLoading] = useState(true)
  
  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage') as Language | null
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguage(savedLang)
    }
    setIsLoading(false)
  }, [])
  
  // Toggle language and save to localStorage
  const toggleLanguage = useCallback(() => {
    const newLang: Language = language === 'zh' ? 'en' : 'zh'
    setLanguage(newLang)
    localStorage.setItem('preferredLanguage', newLang)
  }, [language])
  
  // Get translation function
  const t = useCallback((key: keyof Translations): string => {
    return translations[language][key] || key
  }, [language])
  
  // Get all translations for current language
  const texts = translations[language]
  
  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    texts,
    isLoading,
    toggleButtonText: language === 'zh' ? 'English' : '中文'
  }
}