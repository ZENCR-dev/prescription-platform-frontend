// Application constants for the prescription platform

export const APP_NAME = 'Prescription Platform'
export const APP_DESCRIPTION = 'Digital prescription management for Traditional Chinese Medicine practitioners and pharmacies'

// Medical platform theme colors
export const THEME_COLORS = {
  primary: '#2563eb',
  secondary: '#0ea5e9',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  text: '#1f2937',
  textLight: '#6b7280',
  background: '#ffffff',
  backgroundAlt: '#f9fafb',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const

// User roles for medical platform
export const USER_ROLES = {
  PRACTITIONER: 'practitioner',
  PHARMACY: 'pharmacy', 
  ADMIN: 'admin',
  GUEST: 'guest',
} as const

// Privacy and compliance constants
export const PRIVACY_SETTINGS = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  PASSWORD_MIN_LENGTH: 8,
} as const

// Medical platform specific constants
export const MEDICAL_CONSTANTS = {
  MAX_PRESCRIPTION_ITEMS: 20,
  MIN_PRESCRIPTION_ITEMS: 1,
  DEFAULT_PRESCRIPTION_VALIDITY_DAYS: 30,
} as const