/**
 * MEDICAL PLATFORM AUTH MOCK IMPLEMENTATIONS
 * 
 * Mock data and implementations for authentication system testing
 * Used for frontend development and backend team coordination
 * 
 * PRIVACY COMPLIANT: Uses only anonymized identifiers
 */

import type {
  MedicalUserRole,
  MedicalPermissions,
  MedicalUserProfile,
  MedicalAuthResponse,
  MedicalSignUpRequest,
  MedicalSignInRequest,
  GuestSessionRequest,
  OrganizationContext,
  AuthAuditLog
} from '../types/auth'

// =============================================================================
// ROLE PERMISSION MATRIX
// =============================================================================

export const ROLE_PERMISSIONS = {
  practitioner: {
    // Prescription Management - Full Access
    canCreatePrescription: true,
    canViewPrescriptions: true,
    canEditPrescription: true,
    canDeletePrescription: true,
    
    // Patient Data - View Only (anonymized)
    canViewPatientHistory: true,
    canSearchPatients: true,
    
    // System Administration - None
    canManageUsers: false,
    canAccessReports: false,
    canConfigureSystem: false,
    
    // Pharmacy Operations - None
    canDispenseMedicine: false,
    canManageInventory: false,
    canProcessPayments: false,
    
    // Guest Limitations
    isGuestMode: false
  },
  
  pharmacy: {
    // Prescription Management - View and Process
    canCreatePrescription: false,
    canViewPrescriptions: true,
    canEditPrescription: false,
    canDeletePrescription: false,
    
    // Patient Data - Limited View
    canViewPatientHistory: false,
    canSearchPatients: true,
    
    // System Administration - None
    canManageUsers: false,
    canAccessReports: false,
    canConfigureSystem: false,
    
    // Pharmacy Operations - Full Access
    canDispenseMedicine: true,
    canManageInventory: true,
    canProcessPayments: true,
    
    // Guest Limitations
    isGuestMode: false
  },
  
  admin: {
    // Prescription Management - Full Access
    canCreatePrescription: true,
    canViewPrescriptions: true,
    canEditPrescription: true,
    canDeletePrescription: true,
    
    // Patient Data - Full Access (anonymized)
    canViewPatientHistory: true,
    canSearchPatients: true,
    
    // System Administration - Full Access
    canManageUsers: true,
    canAccessReports: true,
    canConfigureSystem: true,
    
    // Pharmacy Operations - Full Access
    canDispenseMedicine: true,
    canManageInventory: true,
    canProcessPayments: true,
    
    // Guest Limitations
    isGuestMode: false
  },
  
  guest: {
    // Prescription Management - View Only Public
    canCreatePrescription: false,
    canViewPrescriptions: false,
    canEditPrescription: false,
    canDeletePrescription: false,
    
    // Patient Data - None
    canViewPatientHistory: false,
    canSearchPatients: false,
    
    // System Administration - None
    canManageUsers: false,
    canAccessReports: false,
    canConfigureSystem: false,
    
    // Pharmacy Operations - None
    canDispenseMedicine: false,
    canManageInventory: false,
    canProcessPayments: false,
    
    // Guest Limitations
    isGuestMode: true,
    guestSessionExpiry: 3600  // 1 hour
  }
}

// =============================================================================
// MOCK USER PROFILES
// =============================================================================

export const MOCK_USERS: Record<string, MedicalUserProfile> = {
  practitioner_001: {
    id: 'usr_prac_001',
    aud: 'authenticated',
    
    // Anonymized identifiers
    practitionerCode: 'PRAC_TCM_001',
    organizationCode: 'ORG_CLINIC_001',
    
    // Role and permissions
    role: 'practitioner',
    permissions: ROLE_PERMISSIONS.practitioner,
    
    // Medical credentials (anonymized)
    licenseNumber: 'LIC_TCM_HASH_001',
    specialization: ['acupuncture', 'herbal_medicine', 'cupping'],
    certifications: ['TCM_ADVANCED', 'ACUPUNCTURE_MASTER'],
    
    // Platform preferences
    preferredLanguage: 'zh',
    timezone: 'Asia/Shanghai',
    
    // Security
    mfaEnabled: true,
    complianceAccepted: true,
    privacyPolicyVersion: '2024.1',
    
    // Standard Supabase user fields
    app_metadata: {
      provider: 'email',
      providers: ['email']
    },
    user_metadata: {
      professional_verified: true,
      organization_verified: true
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  
  pharmacy_001: {
    id: 'usr_pharm_001',
    aud: 'authenticated',
    
    // Anonymized identifiers
    pharmacyCode: 'PHARM_TCM_001',
    organizationCode: 'ORG_PHARMACY_001',
    
    // Role and permissions
    role: 'pharmacy',
    permissions: ROLE_PERMISSIONS.pharmacy,
    
    // Medical credentials
    licenseNumber: 'LIC_PHARM_HASH_001',
    specialization: ['traditional_dispensing', 'herbal_preparation'],
    certifications: ['PHARMACY_LICENSE', 'TCM_DISPENSING'],
    
    // Platform preferences
    preferredLanguage: 'en',
    timezone: 'America/New_York',
    
    // Security
    mfaEnabled: false,
    complianceAccepted: true,
    privacyPolicyVersion: '2024.1',
    
    // Standard Supabase user fields
    app_metadata: {
      provider: 'email',
      providers: ['email']
    },
    user_metadata: {
      pharmacy_verified: true,
      inventory_access: true
    },
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-15T09:15:00Z'
  },
  
  admin_001: {
    id: 'usr_admin_001',
    aud: 'authenticated',
    
    // Anonymized identifiers
    organizationCode: 'ORG_HEALTH_SYSTEM_001',
    
    // Role and permissions
    role: 'admin',
    permissions: ROLE_PERMISSIONS.admin,
    
    // Platform preferences
    preferredLanguage: 'en',
    timezone: 'UTC',
    
    // Security
    mfaEnabled: true,
    complianceAccepted: true,
    privacyPolicyVersion: '2024.1',
    
    // Standard Supabase user fields
    app_metadata: {
      provider: 'email',
      providers: ['email']
    },
    user_metadata: {
      admin_level: 'organization',
      audit_access: true
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T12:00:00Z'
  }
}

// =============================================================================
// MOCK ORGANIZATIONS
// =============================================================================

export const MOCK_ORGANIZATIONS: Record<string, OrganizationContext> = {
  'ORG_CLINIC_001': {
    code: 'ORG_CLINIC_001',
    name: 'Traditional Wellness Clinic',
    type: 'clinic',
    
    allowedRoles: ['practitioner', 'admin'],
    mfaRequired: false,
    sessionTimeout: 480, // 8 hours
    
    hipaaCompliant: true,
    gdprCompliant: true,
    dataRetentionPolicy: 2555, // 7 years in days
    
    enabledFeatures: [
      'prescription_creation',
      'patient_management',
      'reporting_basic',
      'inventory_view'
    ],
    
    customBranding: {
      primaryColor: '#2E8B57', // Medical green
      secondaryColor: '#4682B4' // Medical blue
    }
  },
  
  'ORG_PHARMACY_001': {
    code: 'ORG_PHARMACY_001',
    name: 'Heritage TCM Pharmacy',
    type: 'pharmacy',
    
    allowedRoles: ['pharmacy', 'admin'],
    mfaRequired: true,
    sessionTimeout: 240, // 4 hours
    
    hipaaCompliant: true,
    gdprCompliant: true,
    dataRetentionPolicy: 1825, // 5 years
    
    enabledFeatures: [
      'prescription_processing',
      'inventory_management',
      'payment_processing',
      'compliance_tracking'
    ]
  }
}

// =============================================================================
// MOCK API RESPONSES
// =============================================================================

export const mockAuthResponses = {
  /**
   * Successful practitioner login
   */
  practitionerLogin: (): MedicalAuthResponse => ({
    user: MOCK_USERS.practitioner_001,
    session: {
      access_token: 'mock_jwt_practitioner_001',
      refresh_token: 'mock_refresh_001',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      token_type: 'bearer',
      user: MOCK_USERS.practitioner_001,
      
      // Medical session extensions
      sessionType: 'authenticated',
      organizationContext: 'ORG_CLINIC_001',
      lastActivity: new Date().toISOString()
    },
    error: null,
    
    organizationInfo: {
      code: 'ORG_CLINIC_001',
      name: 'Traditional Wellness Clinic',
      type: 'clinic'
    },
    
    requiresMFA: false,
    requiresPasswordChange: false,
    complianceStatus: 'current'
  }),
  
  /**
   * Guest session creation
   */
  guestSession: (): MedicalAuthResponse => ({
    user: {
      id: 'guest_session_001',
      aud: 'authenticated',
      role: 'guest',
      permissions: ROLE_PERMISSIONS.guest,
      preferredLanguage: 'en',
      timezone: 'UTC',
      mfaEnabled: false,
      complianceAccepted: true,
      privacyPolicyVersion: '2024.1',
      app_metadata: { provider: 'guest' },
      user_metadata: { session_type: 'guest' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    session: {
      access_token: 'mock_guest_jwt_001',
      refresh_token: '', // No refresh for guest sessions
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      token_type: 'bearer',
      user: null,
      
      sessionType: 'guest',
      lastActivity: new Date().toISOString(),
      guestCapabilities: ['view_public_info', 'search_medicines'],
      guestExpiresAt: new Date(Date.now() + 3600000).toISOString()
    },
    error: null,
    
    requiresMFA: false,
    requiresPasswordChange: false,
    complianceStatus: 'current'
  }),
  
  /**
   * Authentication error examples
   */
  invalidCredentials: (): MedicalAuthResponse => ({
    user: null,
    session: null,
    error: {
      name: 'AuthError',
      message: 'Invalid email or password',
      status: 401,
      code: 'invalid_credentials',
      __isAuthError: true
    } as unknown as import('@supabase/supabase-js').AuthError,
    requiresMFA: false,
    requiresPasswordChange: false,
    complianceStatus: 'current'
  }),
  
  mfaRequired: (): MedicalAuthResponse => ({
    user: null,
    session: null,
    error: {
      name: 'MFARequired', 
      message: 'Multi-factor authentication required',
      status: 401,
      code: 'mfa_required',
      __isAuthError: true
    } as unknown as import('@supabase/supabase-js').AuthError,
    requiresMFA: true,
    requiresPasswordChange: false,
    complianceStatus: 'current'
  })
}

// =============================================================================
// MOCK API FUNCTIONS
// =============================================================================

/**
 * Mock user registration
 */
export async function mockRegisterUser(request: MedicalSignUpRequest): Promise<MedicalAuthResponse> {
  // Simulate validation
  if (request.role === 'admin' && !request.inviteToken) {
    return {
      user: null,
      session: null,
      error: {
        name: 'InvalidRole',
        message: 'Admin registration requires invite token',
        status: 400,
        code: 'invalid_role',
        __isAuthError: true
      } as unknown as import('@supabase/supabase-js').AuthError,
      requiresMFA: false,
      requiresPasswordChange: false,
      complianceStatus: 'current'
    }
  }
  
  // Simulate successful registration
  const newUserId = `usr_${request.role}_${Date.now()}`
  const newUser: MedicalUserProfile = {
    id: newUserId,
    aud: 'authenticated',
    role: request.role,
    permissions: ROLE_PERMISSIONS[request.role],
    
    // Generate anonymized codes
    practitionerCode: request.role === 'practitioner' ? `PRAC_${Date.now()}` : undefined,
    pharmacyCode: request.role === 'pharmacy' ? `PHARM_${Date.now()}` : undefined,
    organizationCode: request.organizationCode,
    
    licenseNumber: request.licenseNumber ? `LIC_HASH_${Date.now()}` : undefined,
    specialization: request.specialization,
    
    preferredLanguage: 'en',
    timezone: 'UTC',
    mfaEnabled: false,
    complianceAccepted: request.privacyPolicyAccepted,
    privacyPolicyVersion: '2024.1',
    
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { registration_method: 'standard' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  return {
    user: newUser,
    session: null, // Registration requires email confirmation
    error: null,
    requiresMFA: false,
    requiresPasswordChange: false,
    complianceStatus: 'current'
  }
}

/**
 * Mock user authentication
 */
export async function mockAuthenticateUser(request: MedicalSignInRequest): Promise<MedicalAuthResponse> {
  // Simulate credential validation
  if (request.email === 'practitioner@clinic.test' && request.password === 'test123') {
    return mockAuthResponses.practitionerLogin()
  }
  
  if (request.email === 'invalid@test.com') {
    return mockAuthResponses.invalidCredentials()
  }
  
  if (request.email === 'mfa@test.com') {
    return mockAuthResponses.mfaRequired()
  }
  
  // Default to invalid credentials
  return mockAuthResponses.invalidCredentials()
}

/**
 * Mock guest session creation
 */
export async function mockCreateGuestSession(request: GuestSessionRequest): Promise<MedicalAuthResponse> {
  // Validate capabilities
  const validCapabilities = ['view_public_info', 'search_medicines', 'calculate_dosage']
  const invalidCapabilities = request.capabilities.filter(cap => !validCapabilities.includes(cap))
  
  if (invalidCapabilities.length > 0) {
    return {
      user: null,
      session: null,
      error: {
        name: 'InvalidCapabilities',
        message: `Invalid capabilities: ${invalidCapabilities.join(', ')}`,
        status: 400,
        code: 'invalid_capabilities',
        __isAuthError: true
      } as unknown as import('@supabase/supabase-js').AuthError,
      requiresMFA: false,
      requiresPasswordChange: false,
      complianceStatus: 'current'
    }
  }
  
  return mockAuthResponses.guestSession()
}

/**
 * Mock organization validation
 */
export async function mockValidateOrganization(organizationCode: string): Promise<{
  success: boolean
  organization?: OrganizationContext
  error?: string
}> {
  const organization = MOCK_ORGANIZATIONS[organizationCode]
  
  if (!organization) {
    return {
      success: false,
      error: 'Organization not found'
    }
  }
  
  return {
    success: true,
    organization
  }
}

/**
 * Mock permission checking
 */
export function mockCheckPermission(
  user: MedicalUserProfile,
  permission: keyof MedicalPermissions
): boolean {
  return user.permissions[permission] === true
}

/**
 * Mock role transition (for admin operations)
 */
export async function mockUpdateUserRole(
  userId: string,
  newRole: MedicalUserRole,
  adminUserId: string
): Promise<{
  success: boolean
  updatedUser?: MedicalUserProfile
  auditLog?: AuthAuditLog
  error?: string
}> {
  // Simulate admin permission check
  const adminUser = Object.values(MOCK_USERS).find(u => u.id === adminUserId)
  if (!adminUser || !adminUser.permissions.canManageUsers) {
    return {
      success: false,
      error: 'Insufficient permissions'
    }
  }
  
  // Simulate user update
  const targetUser = Object.values(MOCK_USERS).find(u => u.id === userId)
  if (!targetUser) {
    return {
      success: false,
      error: 'User not found'
    }
  }
  
  const updatedUser: MedicalUserProfile = {
    ...targetUser,
    role: newRole,
    permissions: ROLE_PERMISSIONS[newRole],
    updated_at: new Date().toISOString()
  }
  
  const auditLog: AuthAuditLog = {
    timestamp: new Date().toISOString(),
    userId: adminUserId,
    action: 'role_change',
    organizationCode: targetUser.organizationCode || '',
    ipAddress: '192.168.1.100',
    userAgent: 'Mock-Test-Agent',
    success: true
  }
  
  return {
    success: true,
    updatedUser,
    auditLog
  }
}

// =============================================================================
// MOCK JWT CLAIMS
// =============================================================================

/**
 * Mock JWT claims for medical platform
 */
export function mockGenerateJwtClaims(user: MedicalUserProfile): Record<string, string | number | boolean | string[] | undefined> {
  return {
    // Standard Supabase claims
    iss: 'supabase',
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    sub: user.id,
    role: 'authenticated',
    
    // Medical platform custom claims
    medical_role: user.role,
    practitioner_code: user.practitionerCode,
    pharmacy_code: user.pharmacyCode,
    organization_code: user.organizationCode,
    permissions: Object.entries(user.permissions)
      .filter(([, value]) => value === true)
      .map(([key]) => key),
    
    // Security context
    mfa_verified: user.mfaEnabled,
    compliance_version: user.privacyPolicyVersion,
    session_type: 'authenticated'
  }
}

/**
 * Mock guest JWT claims
 */
export function mockGenerateGuestJwtClaims(capabilities: string[]): Record<string, string | number | boolean | string[] | undefined> {
  return {
    // Standard Supabase claims
    iss: 'supabase',
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    sub: `guest_${Date.now()}`,
    role: 'authenticated', // Note: Supabase role, not medical role
    
    // Guest-specific claims
    medical_role: 'guest',
    guest_capabilities: capabilities,
    session_type: 'guest',
    guest_expires_at: Math.floor(Date.now() / 1000) + 3600
  }
}

// =============================================================================
// TESTING UTILITIES
// =============================================================================

/**
 * Generate mock authentication scenarios for testing
 */
export const mockTestScenarios = {
  /**
   * Valid practitioner authentication flow
   */
  validPractitionerFlow: async () => {
    const loginRequest: MedicalSignInRequest = {
      email: 'practitioner@clinic.test',
      password: 'test123'
    }
    
    const response = await mockAuthenticateUser(loginRequest)
    return {
      scenario: 'Valid practitioner login',
      request: loginRequest,
      response,
      expectedResult: 'success',
      assertions: [
        'response.user should not be null',
        'response.user.role should equal "practitioner"',
        'response.user.permissions.canCreatePrescription should be true',
        'response.organizationInfo should be present'
      ]
    }
  },
  
  /**
   * Guest session with limited capabilities
   */
  guestSessionFlow: async () => {
    const guestRequest: GuestSessionRequest = {
      capabilities: ['view_public_info', 'search_medicines'],
      sessionDuration: 30
    }
    
    const response = await mockCreateGuestSession(guestRequest)
    return {
      scenario: 'Guest session creation',
      request: guestRequest,
      response,
      expectedResult: 'success',
      assertions: [
        'response.session.sessionType should equal "guest"',
        'response.session.guestCapabilities should include requested capabilities',
        'response.session should expire in 30 minutes'
      ]
    }
  },
  
  /**
   * Role transition for admin operations
   */
  roleTransitionFlow: async () => {
    const result = await mockUpdateUserRole(
      'usr_prac_001',
      'admin',
      'usr_admin_001'
    )
    
    return {
      scenario: 'Admin role transition',
      result,
      expectedResult: 'success',
      assertions: [
        'result.success should be true',
        'result.updatedUser.role should equal "admin"',
        'result.auditLog should be present',
        'result.auditLog.action should equal "role_change"'
      ]
    }
  }
}

/**
 * Run all mock test scenarios
 */
export async function runMockTests(): Promise<void> {
  console.log('🧪 Running Mock Authentication Tests...\n')
  
  const scenarios = await Promise.all([
    mockTestScenarios.validPractitionerFlow(),
    mockTestScenarios.guestSessionFlow(),
    mockTestScenarios.roleTransitionFlow()
  ])
  
  scenarios.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.scenario}`)
    console.log(`   Expected: ${scenario.expectedResult}`)
    console.log(`   Assertions: ${scenario.assertions?.length || 0}`)
    console.log('')
  })
  
  console.log('✅ Mock tests completed - See assertions for validation criteria')
}