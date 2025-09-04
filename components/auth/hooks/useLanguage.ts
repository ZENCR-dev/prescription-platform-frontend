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
  
  // Registration Form
  createAccount: string
  professionalInfo: string
  accountType: string
  tcmPractitioner: string
  pharmacy: string
  admin: string
  fullName: string
  namePlaceholder: string
  phone: string
  phonePlaceholder: string
  licenseNumber: string
  licenseNumberPlaceholder: string
  pharmacyName: string
  pharmacyNamePlaceholder: string
  inviteCode: string
  inviteCodePlaceholder: string
  setPassword: string
  confirmPassword: string
  passwordRequirement: string
  confirmPasswordPlaceholder: string
  agreeToTerms: string
  termsOfService: string
  privacyPolicy: string
  and: string
  createAccountButton: string
  orSignUpWith: string
  alreadyHaveAccount: string
  signInLink: string
  
  // Registration Benefits
  joinUs: string
  modernizationPartner: string
  professionalCertification: string
  certificationDesc: string
  dataSecurity: string
  dataSecurityDesc: string
  instantAccess: string
  instantAccessDesc: string
  
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
  
  // TCM Theme Elements
  tcmTheme: string
  traditionalTheme: string
  modernTheme: string
  herbMedicine: string
  meridianSystem: string
  yinYangBalance: string
  fiveElements: string
  tcmPhilosophy: string
  healingArt: string
  
  // Error Messages
  invalidEmail: string
  invalidPassword: string
  loginFailed: string
  networkError: string
  passwordMismatch: string
  weakPassword: string
  registrationFailed: string
  missingLicenseNumber: string
  missingPharmacyName: string
  missingInviteCode: string
  invalidInviteCode: string
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
    
    // Registration Form
    createAccount: '创建账户',
    professionalInfo: '请填写您的专业信息',
    accountType: '账户类型',
    tcmPractitioner: '中医师',
    pharmacy: '药房',
    admin: '管理员',
    fullName: '姓名',
    namePlaceholder: '张医生',
    phone: '手机号',
    phonePlaceholder: '138xxxx0000',
    licenseNumber: '执业证号',
    licenseNumberPlaceholder: '110000xxxxxxxxxxxx',
    pharmacyName: '药房名称',
    pharmacyNamePlaceholder: '同仁堂',
    inviteCode: '邀请码',
    inviteCodePlaceholder: 'ADMIN-XXXX-XXXX',
    setPassword: '设置密码',
    confirmPassword: '确认密码',
    passwordRequirement: '至少8位字符',
    confirmPasswordPlaceholder: '再次输入密码',
    agreeToTerms: '我已阅读并同意',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
    and: '和',
    createAccountButton: '创建账户',
    orSignUpWith: '或使用以下方式注册',
    alreadyHaveAccount: '已有账户？',
    signInLink: '立即登录',
    
    // Registration Benefits
    joinUs: '加入我们',
    modernizationPartner: '成为传统医学现代化的一员',
    professionalCertification: '专业认证',
    certificationDesc: '执业医师资质验证',
    dataSecurity: '数据安全',
    dataSecurityDesc: 'HIPAA合规，端到端加密',
    instantAccess: '即时启用',
    instantAccessDesc: '注册后立即使用所有功能',
    
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
    
    // TCM Theme Elements
    tcmTheme: '中医药主题',
    traditionalTheme: '传统风格',
    modernTheme: '现代风格',
    herbMedicine: '本草医药',
    meridianSystem: '经络系统',
    yinYangBalance: '阴阳平衡',
    fiveElements: '五行学说',
    tcmPhilosophy: '中医哲学',
    healingArt: '医道传承',
    
    // Error Messages
    invalidEmail: '请输入有效的邮箱地址',
    invalidPassword: '密码长度至少为8位',
    loginFailed: '登录失败，请检查您的邮箱和密码',
    networkError: '网络连接错误，请稍后重试',
    passwordMismatch: '两次输入的密码不一致',
    weakPassword: '密码强度不足，请使用更复杂的密码',
    registrationFailed: '注册失败，请检查您的信息',
    missingLicenseNumber: '请输入执业证号',
    missingPharmacyName: '请输入药房名称',
    missingInviteCode: '请输入邀请码',
    invalidInviteCode: '邀请码无效',
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
    
    // Registration Form
    createAccount: 'Create Account',
    professionalInfo: 'Please provide your professional information',
    accountType: 'Account Type',
    tcmPractitioner: 'TCM Practitioner',
    pharmacy: 'Pharmacy',
    admin: 'Admin',
    fullName: 'Full Name',
    namePlaceholder: 'Dr. Zhang',
    phone: 'Phone Number',
    phonePlaceholder: '+86 138xxxx0000',
    licenseNumber: 'License Number',
    licenseNumberPlaceholder: '110000xxxxxxxxxxxx',
    pharmacyName: 'Pharmacy Name',
    pharmacyNamePlaceholder: 'Tongrentang',
    inviteCode: 'Invite Code',
    inviteCodePlaceholder: 'ADMIN-XXXX-XXXX',
    setPassword: 'Set Password',
    confirmPassword: 'Confirm Password',
    passwordRequirement: 'At least 8 characters',
    confirmPasswordPlaceholder: 'Enter password again',
    agreeToTerms: 'I have read and agree to the',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    and: 'and',
    createAccountButton: 'Create Account',
    orSignUpWith: 'Or sign up with',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    
    // Registration Benefits
    joinUs: 'Join Us',
    modernizationPartner: 'Be Part of Traditional Medicine Modernization',
    professionalCertification: 'Professional Certification',
    certificationDesc: 'Licensed practitioner verification',
    dataSecurity: 'Data Security',
    dataSecurityDesc: 'HIPAA compliant, end-to-end encryption',
    instantAccess: 'Instant Access',
    instantAccessDesc: 'All features available immediately',
    
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
    
    // TCM Theme Elements
    tcmTheme: 'TCM Theme',
    traditionalTheme: 'Traditional Style',
    modernTheme: 'Modern Style',
    herbMedicine: 'Herbal Medicine',
    meridianSystem: 'Meridian System',
    yinYangBalance: 'Yin-Yang Balance',
    fiveElements: 'Five Elements',
    tcmPhilosophy: 'TCM Philosophy',
    healingArt: 'Healing Art',
    
    // Error Messages
    invalidEmail: 'Please enter a valid email address',
    invalidPassword: 'Password must be at least 8 characters',
    loginFailed: 'Login failed. Please check your email and password',
    networkError: 'Network error. Please try again later',
    passwordMismatch: 'Passwords do not match',
    weakPassword: 'Password is too weak. Please use a stronger password',
    registrationFailed: 'Registration failed. Please check your information',
    missingLicenseNumber: 'Please enter your license number',
    missingPharmacyName: 'Please enter your pharmacy name',
    missingInviteCode: 'Please enter your invite code',
    invalidInviteCode: 'Invalid invite code',
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