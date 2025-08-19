import type { User, Session, AuthError } from '@supabase/supabase-js'

// =============================================================================
// MEDICAL PLATFORM AUTHENTICATION TYPES
// =============================================================================
// Privacy-compliant auth interfaces for Traditional Chinese Medicine platform
// Zero PII exposure - uses anonymized identifiers only

/**
 * Medical platform user roles with hierarchical permissions
 */
export type MedicalUserRole = 'practitioner' | 'pharmacy' | 'admin' | 'guest'

/**
 * Medical platform user permissions matrix
 */
export interface MedicalPermissions {
  // Prescription Management
  canCreatePrescription: boolean
  canViewPrescriptions: boolean
  canEditPrescription: boolean
  canDeletePrescription: boolean
  
  // Patient Data (anonymized only)
  canViewPatientHistory: boolean
  canSearchPatients: boolean
  
  // System Administration
  canManageUsers: boolean
  canAccessReports: boolean
  canConfigureSystem: boolean
  
  // Pharmacy Operations
  canDispenseMedicine: boolean
  canManageInventory: boolean
  canProcessPayments: boolean
  
  // Guest Limitations
  isGuestMode: boolean
  guestSessionExpiry?: number
}

/**
 * Extended user profile with medical platform context
 * PRIVACY: No PII fields - uses anonymized identifiers only
 */
export interface MedicalUserProfile extends Omit<User, 'email' | 'phone'> {
  // Anonymized identifiers
  practitionerCode?: string
  pharmacyCode?: string
  organizationCode?: string
  
  // Role and permissions
  role: MedicalUserRole
  permissions: MedicalPermissions
  
  // Medical platform metadata
  licenseNumber?: string  // Anonymized/hashed professional license
  specialization?: string[]
  certifications?: string[]
  
  // Platform preferences
  preferredLanguage: 'en' | 'zh' | 'zh-TW'
  timezone: string
  
  // Security and compliance
  lastPasswordChange?: string
  mfaEnabled: boolean
  complianceAccepted: boolean
  privacyPolicyVersion: string
}

/**
 * Enhanced session with medical platform context
 */
export interface MedicalSession extends Omit<Session, 'user'> {
  user: MedicalUserProfile | null
  
  // Session metadata
  sessionType: 'authenticated' | 'guest' | 'elevated'
  organizationContext?: string
  
  // Security tracking
  ipAddress?: string
  userAgent?: string
  lastActivity: string
  
  // Guest mode specific
  guestCapabilities?: string[]
  guestExpiresAt?: string
}

/**
 * Authentication request interfaces
 */
export interface MedicalSignUpRequest {
  email: string
  password: string
  role: MedicalUserRole
  organizationCode?: string
  inviteToken?: string
  
  // Professional verification
  licenseNumber?: string
  specialization?: string[]
  
  // Compliance
  privacyPolicyAccepted: boolean
  termsAccepted: boolean
}

export interface MedicalSignInRequest {
  email: string
  password: string
  organizationCode?: string
  mfaCode?: string
}

export interface GuestSessionRequest {
  capabilities: string[]
  sessionDuration?: number // minutes, max 60
  organizationCode?: string
}

/**
 * Authentication response interfaces
 */
export interface MedicalAuthResponse {
  user: MedicalUserProfile | null
  session: MedicalSession | null
  error: AuthError | null
  
  // Additional medical platform context
  organizationInfo?: {
    code: string
    name: string
    type: 'clinic' | 'hospital' | 'pharmacy' | 'independent'
  }
  
  // Security and compliance
  requiresMFA: boolean
  requiresPasswordChange: boolean
  complianceStatus: 'current' | 'expired' | 'pending'
}

/**
 * Role-based access control utilities
 */
export type RolePermissionMatrix = {
  [key in MedicalUserRole]: MedicalPermissions
}

/**
 * API endpoint interfaces for backend coordination
 */
export interface AuthEndpointRequest<T = any> {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers: Record<string, string>
  body?: T
  requiresAuth: boolean
  requiredRole?: MedicalUserRole
}

export interface AuthEndpointResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, any>
  }
  meta?: {
    timestamp: string
    requestId: string
    version: string
  }
}

/**
 * Medical platform specific error types
 */
export interface MedicalAuthError extends AuthError {
  medicalErrorCode?: 
    | 'INVALID_LICENSE'
    | 'ORGANIZATION_NOT_FOUND'
    | 'ROLE_MISMATCH'
    | 'COMPLIANCE_REQUIRED'
    | 'MFA_REQUIRED'
    | 'SESSION_EXPIRED'
    | 'GUEST_LIMIT_EXCEEDED'
    | 'UNAUTHORIZED_ORGANIZATION'
}

/**
 * Audit and compliance tracking
 */
export interface AuthAuditLog {
  timestamp: string
  userId: string
  action: 'login' | 'logout' | 'role_change' | 'permission_grant' | 'mfa_enable'
  organizationCode: string
  ipAddress: string
  userAgent: string
  success: boolean
  errorCode?: string
}

/**
 * Organization management for multi-tenant architecture
 */
export interface OrganizationContext {
  code: string
  name: string
  type: 'clinic' | 'hospital' | 'pharmacy' | 'independent'
  
  // Configuration
  allowedRoles: MedicalUserRole[]
  mfaRequired: boolean
  sessionTimeout: number // minutes
  
  // Compliance
  hipaaCompliant: boolean
  gdprCompliant: boolean
  dataRetentionPolicy: number // days
  
  // Features
  enabledFeatures: string[]
  customBranding?: {
    logo?: string
    primaryColor: string
    secondaryColor: string
  }
}

/**
 * Integration interfaces for backend coordination
 */
export interface BackendAuthContract {
  // User management endpoints
  createUser: AuthEndpointRequest<MedicalSignUpRequest>
  authenticateUser: AuthEndpointRequest<MedicalSignInRequest>
  refreshToken: AuthEndpointRequest<{ refreshToken: string }>
  
  // Role and permission management
  updateUserRole: AuthEndpointRequest<{ userId: string; role: MedicalUserRole }>
  getUserPermissions: AuthEndpointRequest<{ userId: string }>
  
  // Organization management
  validateOrganization: AuthEndpointRequest<{ organizationCode: string }>
  getUserOrganizations: AuthEndpointRequest<{ userId: string }>
  
  // Audit and compliance
  logAuthEvent: AuthEndpointRequest<AuthAuditLog>
  getComplianceStatus: AuthEndpointRequest<{ organizationCode: string }>
}