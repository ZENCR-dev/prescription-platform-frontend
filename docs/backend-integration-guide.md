# Backend Integration Guide - Authentication System
## Medical Prescription Platform - Frontend-Backend Coordination

**Document Type**: Technical Integration Guide  
**Version**: 1.0  
**Target Audience**: Backend development team  
**Frontend Dependencies**: Task 1.3 - Authentication API Documentation  

---

## 🎯 Integration Overview

This guide enables backend team to implement authentication features that seamlessly integrate with the frontend's Supabase Auth foundation while providing medical platform specific functionality.

### Integration Architecture

```
Frontend (Next.js + Supabase Auth UI)
    ↕ Custom JWT Claims
Backend (Custom Auth API + Supabase Auth Hooks)
    ↕ Standard Supabase JWT
Supabase Auth Server (Role & Permission Management)
```

---

## 🔧 Supabase Configuration Requirements

### 1. Shared Project Setup

**Frontend Provides**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://dosbevgbkxrtixemfjfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend Needs**:
```env
SUPABASE_URL=https://dosbevgbkxrtixemfjfl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret
```

### 2. Database Schema Extensions

Backend must extend Supabase's default auth schema:

```sql
-- Medical platform user profiles
CREATE TABLE public.medical_user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  practitioner_code TEXT UNIQUE,
  pharmacy_code TEXT UNIQUE,
  organization_code TEXT NOT NULL,
  role medical_user_role NOT NULL,
  license_number_hash TEXT,
  specializations TEXT[],
  certifications TEXT[],
  
  -- Platform preferences
  preferred_language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  
  -- Security
  mfa_enabled BOOLEAN DEFAULT FALSE,
  compliance_accepted BOOLEAN DEFAULT FALSE,
  privacy_policy_version TEXT DEFAULT '2024.1',
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization management
CREATE TABLE public.organizations (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type organization_type NOT NULL,
  allowed_roles medical_user_role[],
  mfa_required BOOLEAN DEFAULT FALSE,
  session_timeout INTEGER DEFAULT 480,
  
  -- Compliance
  hipaa_compliant BOOLEAN DEFAULT TRUE,
  gdpr_compliant BOOLEAN DEFAULT TRUE,
  data_retention_days INTEGER DEFAULT 2555,
  
  -- Features
  enabled_features TEXT[],
  custom_branding JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logging
CREATE TABLE public.auth_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  organization_code TEXT,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  error_code TEXT,
  additional_context JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Custom types
CREATE TYPE medical_user_role AS ENUM ('practitioner', 'pharmacy', 'admin', 'guest');
CREATE TYPE organization_type AS ENUM ('clinic', 'hospital', 'pharmacy', 'independent');
```

---

## ⚙️ Auth Hook Implementation

### Custom Access Token Hook

Backend must implement Supabase Auth Hook to add medical platform claims:

```typescript
// supabase/functions/auth-hook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { event, session } = await req.json()
  
  // Only modify token on sign in
  if (event !== 'token.issued') {
    return new Response(JSON.stringify({}), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
  
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Fetch medical user profile
  const { data: profile } = await supabaseAdmin
    .from('medical_user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  if (!profile) {
    return new Response(JSON.stringify({}), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
  
  // Add custom claims
  const customClaims = {
    medical_role: profile.role,
    practitioner_code: profile.practitioner_code,
    pharmacy_code: profile.pharmacy_code,
    organization_code: profile.organization_code,
    permissions: await getPermissionsArray(profile.role),
    mfa_verified: profile.mfa_enabled,
    compliance_version: profile.privacy_policy_version,
    session_type: 'authenticated'
  }
  
  return new Response(
    JSON.stringify({ claims: customClaims }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})

async function getPermissionsArray(role: string): Promise<string[]> {
  // Return permission keys based on role
  // Implementation should match frontend ROLE_PERMISSIONS matrix
  // See types/auth.ts and lib/auth-mock.ts for reference
}
```

---

## 🛡️ RLS Policy Integration

### Row Level Security Policies

Backend should implement RLS policies that work with custom JWT claims:

```sql
-- Enable RLS on medical platform tables
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Prescription access policy
CREATE POLICY "prescription_access" ON prescriptions
FOR ALL USING (
  -- Practitioners can access prescriptions they created
  (auth.jwt() ->> 'medical_role' = 'practitioner' 
   AND practitioner_code = auth.jwt() ->> 'practitioner_code')
  OR
  -- Pharmacy can access prescriptions for dispensing
  (auth.jwt() ->> 'medical_role' = 'pharmacy' 
   AND pharmacy_code = auth.jwt() ->> 'pharmacy_code')
  OR
  -- Admins can access all prescriptions in their organization
  (auth.jwt() ->> 'medical_role' = 'admin' 
   AND organization_code = auth.jwt() ->> 'organization_code')
);

-- User profile access policy
CREATE POLICY "user_profile_access" ON medical_user_profiles
FOR ALL USING (
  -- Users can access their own profile
  id = auth.uid()
  OR
  -- Admins can access profiles in their organization
  (auth.jwt() ->> 'medical_role' = 'admin' 
   AND organization_code = auth.jwt() ->> 'organization_code')
);

-- Organization access policy  
CREATE POLICY "organization_access" ON organizations
FOR SELECT USING (
  -- Users can view their organization info
  code = auth.jwt() ->> 'organization_code'
);
```

---

## 🔗 API Endpoint Implementation

### 1. Registration Enhancement

Extend Supabase's registration with medical platform logic:

```typescript
// POST /api/auth/register
export async function registerMedicalUser(request: MedicalSignUpRequest) {
  // 1. Validate professional license (if practitioner)
  if (request.role === 'practitioner') {
    const licenseValid = await validateProfessionalLicense(request.licenseNumber)
    if (!licenseValid) {
      return errorResponse('INVALID_LICENSE', 'Professional license validation failed')
    }
  }
  
  // 2. Validate organization (if provided)
  if (request.organizationCode) {
    const orgValid = await validateOrganizationCode(request.organizationCode)
    if (!orgValid) {
      return errorResponse('ORGANIZATION_NOT_FOUND', 'Organization not found')
    }
  }
  
  // 3. Create user via Supabase Admin API
  const { data: supabaseUser, error } = await supabaseAdmin.auth.admin.createUser({
    email: request.email,
    password: request.password,
    email_confirm: false // Require email confirmation
  })
  
  if (error) {
    return errorResponse('SIGNUP_FAILED', error.message)
  }
  
  // 4. Create medical profile
  const profile = await createMedicalUserProfile({
    id: supabaseUser.user.id,
    role: request.role,
    organizationCode: request.organizationCode,
    licenseNumber: request.licenseNumber,
    specialization: request.specialization
  })
  
  // 5. Return success response
  return successResponse({
    user: profile,
    requiresEmailConfirmation: true
  })
}
```

### 2. Permission Validation Middleware

Create middleware to validate permissions for protected endpoints:

```typescript
// middleware/auth.ts
export function requirePermission(permission: keyof MedicalPermissions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = extractBearerToken(req)
    const claims = verifyJWT(token)
    
    // Check if user has required permission
    const hasPermission = claims.permissions?.includes(permission)
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Permission '${permission}' required`,
          requiredPermission: permission,
          userRole: claims.medical_role
        }
      })
    }
    
    req.user = claims
    next()
  }
}

// Usage example
app.post('/api/prescriptions', 
  requirePermission('canCreatePrescription'),
  createPrescriptionHandler
)
```

---

## 🔍 Frontend Integration Points

### 1. TypeScript Interface Alignment

Backend API responses must match frontend TypeScript interfaces:

```typescript
// Ensure backend responses match these interfaces:
import type { 
  MedicalAuthResponse,
  MedicalUserProfile,
  MedicalSession,
  OrganizationContext 
} from '../types/auth'

// Example: Login endpoint response
const loginResponse: MedicalAuthResponse = {
  user: medicalUserProfile,      // Must match MedicalUserProfile interface
  session: medicalSession,       // Must match MedicalSession interface
  error: null,
  organizationInfo: orgContext,  // Must match OrganizationContext interface
  requiresMFA: false,
  requiresPasswordChange: false,
  complianceStatus: 'current'
}
```

### 2. Error Handling Coordination

Frontend expects specific error codes for user experience:

```typescript
// Backend error mapping for frontend UX
const ERROR_MAPPING = {
  'INVALID_LICENSE': {
    userMessage: 'Professional license could not be verified. Please check your license number.',
    action: 'retry_license_entry',
    severity: 'warning'
  },
  'MFA_REQUIRED': {
    userMessage: 'Additional security verification required.',
    action: 'prompt_mfa',
    severity: 'info'
  },
  'ORGANIZATION_NOT_FOUND': {
    userMessage: 'Organization not found. Please contact your administrator.',
    action: 'contact_admin',
    severity: 'error'
  }
  // Add all error codes from types/auth.ts
}
```

### 3. Session Synchronization

Maintain session state between frontend Supabase client and backend:

```typescript
// Backend session validation
export async function validateFrontendSession(accessToken: string) {
  // 1. Verify JWT signature and expiration
  const claims = verifySupabaseJWT(accessToken)
  
  // 2. Check if session is still valid in database
  const sessionValid = await checkSessionValidity(claims.sub, claims.session_id)
  
  // 3. Verify organization access is still valid
  const orgAccess = await verifyOrganizationAccess(
    claims.sub, 
    claims.organization_code
  )
  
  return {
    valid: sessionValid && orgAccess,
    user: claims,
    requiresRefresh: sessionValid && !orgAccess
  }
}
```

---

## 🧪 Testing and Validation

### 1. Mock Data Compatibility

Use frontend mock data for consistent testing:

```typescript
// Import mock data from frontend
import { 
  MOCK_USERS, 
  MOCK_ORGANIZATIONS, 
  mockAuthResponses 
} from '../lib/auth-mock'

// Backend tests should validate against same mock data
describe('Authentication API', () => {
  test('should return consistent user profile structure', () => {
    const backendResponse = authenticateUser(mockLoginRequest)
    const frontendExpected = mockAuthResponses.practitionerLogin()
    
    expect(backendResponse.user).toMatchObject(frontendExpected.user)
    expect(backendResponse.session.sessionType).toBe(frontendExpected.session.sessionType)
  })
})
```

### 2. Integration Test Scenarios

**Required Test Coverage**:

```typescript
// Critical integration tests backend must pass
const INTEGRATION_TESTS = [
  {
    name: 'Practitioner authentication flow',
    description: 'Complete practitioner login with organization context',
    endpoint: 'POST /api/auth/login',
    mockRequest: 'practitionerLoginRequest',
    expectedResponse: 'matchesMedicalAuthResponse interface',
    criticalChecks: [
      'JWT contains medical_role claim',
      'Permissions array matches role matrix',
      'Organization context included',
      'Session type set correctly'
    ]
  },
  
  {
    name: 'Guest session creation',
    description: 'Limited capability guest session',
    endpoint: 'POST /api/auth/guest',
    mockRequest: 'guestSessionRequest',
    expectedResponse: 'guestSessionResponse',
    criticalChecks: [
      'Guest capabilities properly limited',
      'Session expiration enforced',
      'No sensitive data exposed'
    ]
  },
  
  {
    name: 'Role-based permission enforcement',
    description: 'API endpoints respect role permissions',
    endpoint: 'Various protected endpoints',
    testMatrix: 'All role combinations',
    criticalChecks: [
      'Practitioners cannot access admin functions',
      'Pharmacy staff cannot create prescriptions',
      'Guests have minimal access only',
      'Admins have appropriate elevated access'
    ]
  },
  
  {
    name: 'Cross-organization isolation',
    description: 'Users cannot access other organization data',
    endpoint: 'Various data endpoints',
    testScenario: 'Multi-organization setup',
    criticalChecks: [
      'RLS policies enforce organization boundaries',
      'JWT organization_code validated',
      'Cross-org access properly denied'
    ]
  }
]
```

---

## 🔐 Security Implementation Requirements

### 1. JWT Custom Claims Validation

```typescript
// Backend JWT claim validation
function validateMedicalJwtClaims(token: string): boolean {
  const claims = verifyJWT(token)
  
  // Required medical platform claims
  const requiredClaims = [
    'medical_role',
    'organization_code',
    'permissions',
    'compliance_version',
    'session_type'
  ]
  
  return requiredClaims.every(claim => 
    claims[claim] !== undefined && claims[claim] !== null
  )
}
```

### 2. Privacy Compliance Enforcement

```typescript
// Ensure no PII in API responses
function sanitizeUserResponse(user: any): MedicalUserProfile {
  // Remove any PII fields
  const { email, phone, personal_info, ...sanitized } = user
  
  // Return only anonymized identifiers and role data
  return {
    ...sanitized,
    // Use anonymized codes only
    practitionerCode: user.practitioner_code,
    pharmacyCode: user.pharmacy_code,
    organizationCode: user.organization_code
  }
}
```

### 3. Audit Trail Implementation

```typescript
// Required audit logging for compliance
async function logAuthEvent(event: AuthAuditLog): Promise<void> {
  await supabaseAdmin
    .from('auth_audit_logs')
    .insert({
      user_id: event.userId,
      action: event.action,
      organization_code: event.organizationCode,
      ip_address: event.ipAddress,
      user_agent: event.userAgent,
      success: event.success,
      error_code: event.errorCode,
      timestamp: event.timestamp
    })
}
```

---

## 📋 Implementation Checklist

### Phase 1: Core Integration
- [ ] Supabase project access configured
- [ ] Database schema extensions created
- [ ] Auth Hook implemented for custom claims
- [ ] Basic registration endpoint functional
- [ ] Basic authentication endpoint functional
- [ ] Token refresh endpoint functional
- [ ] Error responses match frontend expectations

### Phase 2: Medical Platform Features
- [ ] Role-based permission system implemented
- [ ] Organization management functional
- [ ] Professional license validation integrated
- [ ] Guest session management working
- [ ] Audit logging operational
- [ ] RLS policies enforcing data isolation

### Phase 3: Production Readiness
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Privacy compliance validated
- [ ] Integration tests passing
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Monitoring and alerting configured

---

## 🚀 Development Workflow

### 1. Setup Phase
1. **Environment Setup**: Configure shared Supabase project access
2. **Schema Migration**: Apply database schema extensions
3. **Auth Hook Deployment**: Deploy custom claims Auth Hook
4. **Basic Testing**: Validate Supabase integration working

### 2. Implementation Phase
1. **Core Endpoints**: Implement registration, login, refresh endpoints
2. **Permission System**: Build role-based access control
3. **Organization Logic**: Implement multi-tenant organization support
4. **Guest Sessions**: Add limited guest access capability

### 3. Integration Phase
1. **Frontend Testing**: Test with actual frontend auth UI components
2. **Mock Validation**: Ensure API responses match frontend mock expectations
3. **Security Review**: Validate privacy compliance and security measures
4. **Performance Testing**: Verify response times and scalability

### 4. Production Phase
1. **Monitoring Setup**: Implement authentication metrics and alerting
2. **Compliance Validation**: Final GDPR/HIPAA compliance check
3. **Documentation**: Update API documentation with actual endpoints
4. **Deployment**: Coordinate production deployment with frontend team

---

## 📞 Communication Protocols

### Frontend-Backend Coordination

**Regular Sync Points**:
- **Weekly**: Technical alignment on interface changes
- **Milestone**: Integration testing coordination
- **Critical**: Security or compliance issue resolution

**Issue Escalation**:
1. **Technical Issues**: Direct developer communication
2. **Interface Changes**: Joint review and approval
3. **Security Concerns**: Immediate escalation to tech lead
4. **Compliance Issues**: Legal/compliance team involvement

**Documentation Updates**:
- Backend team updates API documentation as features are implemented
- Frontend team provides feedback on interface usability
- Both teams maintain shared testing scenarios and mock data

---

## 📊 Success Metrics

### Technical Integration KPIs
- **API Response Time**: <200ms for auth endpoints
- **Integration Test Pass Rate**: 100% for critical flows
- **Error Rate**: <0.1% for production auth operations
- **Session Synchronization**: 99.9% consistency between frontend/backend

### Medical Platform KPIs  
- **Role Enforcement**: 100% compliance with permission matrix
- **Privacy Protection**: Zero PII exposure in logs or tokens
- **Audit Completeness**: 100% auth events logged
- **Compliance Validation**: Automated GDPR/HIPAA compliance checks

---

**Document Maintenance**: This guide will be updated as backend implementation progresses  
**Version Control**: Track changes and coordinate updates with frontend team  
**Next Review**: Schedule after Task 1.3 completion and backend implementation start