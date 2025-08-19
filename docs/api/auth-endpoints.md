# Authentication API Endpoints Documentation
## Medical Prescription Platform - Frontend-Backend Coordination Contract

**Document Type**: Technical API Specification  
**Version**: 1.0  
**Target**: Backend development team  
**Frontend Contact**: Via Task 1.3 coordination  

---

## 🎯 API Design Philosophy

**Privacy-First Architecture**: All endpoints designed for zero PII exposure
- Use anonymized identifiers (`practitionerCode`, `prescriptionCode`)
- No patient personal information in auth tokens or responses
- GDPR/HIPAA compliant by design

**Supabase Integration Model**: Hybrid approach leveraging existing Supabase Auth
- Frontend uses Supabase Auth UI components for core flows
- Backend extends with medical platform specific logic
- Custom claims add medical roles to standard Supabase JWT structure

---

## 🔐 Core Authentication Endpoints

### 1. User Registration - `POST /api/auth/register`

**Purpose**: Register new medical platform users with role-based validation

**Request Schema**:
```typescript
{
  email: string                    // Required: Valid email format
  password: string                 // Required: Min 8 chars, complexity rules
  role: 'practitioner' | 'pharmacy' | 'admin'  // Required: Target role
  organizationCode?: string        // Optional: Organization association
  inviteToken?: string            // Required for admin/pharmacy roles
  
  // Professional verification (practitioner role only)
  licenseNumber?: string          // Anonymized license identifier
  specialization?: string[]       // TCM specializations
  
  // Compliance (required)
  privacyPolicyAccepted: boolean  // Must be true
  termsAccepted: boolean          // Must be true
}
```

**Response Schema**:
```typescript
{
  success: boolean
  data?: {
    user: {
      id: string
      role: MedicalUserRole
      practitionerCode?: string    // Generated anonymized ID
      organizationCode?: string
      pendingVerification: boolean
    }
    requiresEmailConfirmation: boolean
    verificationEmailSent: boolean
  }
  error?: {
    code: 'INVALID_EMAIL' | 'WEAK_PASSWORD' | 'INVALID_LICENSE' | 'ORGANIZATION_NOT_FOUND'
    message: string
    details?: Record<string, any>
  }
}
```

**Backend Implementation Notes**:
- Integrate with Supabase Auth `/signup` endpoint
- Add custom claims for `role` and organization context
- Validate professional licenses against external registries
- Create anonymized identifier mappings
- Send verification emails via Supabase

---

### 2. User Authentication - `POST /api/auth/login`

**Purpose**: Authenticate users and establish session with medical platform context

**Request Schema**:
```typescript
{
  email: string
  password: string
  organizationCode?: string        // Optional: Multi-org users
  mfaCode?: string                // Required if MFA enabled
  rememberMe?: boolean            // Session duration preference
}
```

**Response Schema**:
```typescript
{
  success: boolean
  data?: {
    user: MedicalUserProfile        // See types/auth.ts
    session: MedicalSession        // Enhanced session with medical context
    organizationInfo?: {
      code: string
      name: string
      type: 'clinic' | 'hospital' | 'pharmacy'
      features: string[]
    }
    accessToken: string            // Supabase JWT with custom claims
    refreshToken: string
    expiresIn: number
  }
  error?: {
    code: 'INVALID_CREDENTIALS' | 'MFA_REQUIRED' | 'ACCOUNT_LOCKED' | 'ORGANIZATION_MISMATCH'
    message: string
    retryAfter?: number            // For rate limiting
  }
}
```

**Backend Implementation Notes**:
- Leverage Supabase Auth `/token` endpoint with `grant_type: password`
- Add custom JWT claims via Auth Hook for medical roles
- Validate organization membership
- Implement progressive MFA based on risk assessment
- Log all authentication attempts for audit trail

---

### 3. Session Refresh - `POST /api/auth/refresh`

**Purpose**: Refresh expired access tokens while maintaining medical platform context

**Request Schema**:
```typescript
{
  refreshToken: string
  organizationCode?: string       // Validate organization still valid
}
```

**Response Schema**:
```typescript
{
  success: boolean
  data?: {
    accessToken: string
    refreshToken: string           // May rotate based on security policy
    expiresIn: number
    updatedPermissions?: MedicalPermissions  // If permissions changed
  }
  error?: {
    code: 'INVALID_REFRESH_TOKEN' | 'TOKEN_EXPIRED' | 'ORGANIZATION_REVOKED'
    message: string
  }
}
```

---

### 4. Guest Session Creation - `POST /api/auth/guest`

**Purpose**: Create limited-capability guest sessions for prescription lookup

**Request Schema**:
```typescript
{
  capabilities: ('view_public_info' | 'search_medicines' | 'calculate_dosage')[]
  sessionDuration?: number        // Minutes, max 60
  organizationCode?: string       // Optional: Organization context
}
```

**Response Schema**:
```typescript
{
  success: boolean
  data?: {
    guestToken: string            // Limited JWT with guest claims
    capabilities: string[]
    expiresAt: string            // ISO timestamp
    sessionId: string            // For tracking
  }
  error?: {
    code: 'INVALID_CAPABILITIES' | 'DURATION_TOO_LONG' | 'GUEST_DISABLED'
    message: string
  }
}
```

---

## 🏥 Role Management Endpoints

### 5. Get User Permissions - `GET /api/auth/permissions`

**Purpose**: Retrieve current user's effective permissions

**Authentication**: Required - Bearer token

**Response Schema**:
```typescript
{
  success: boolean
  data?: {
    userId: string
    role: MedicalUserRole
    permissions: MedicalPermissions
    organizationContext?: {
      code: string
      customPermissions?: Record<string, boolean>
    }
    effectivePermissions: MedicalPermissions  // Final computed permissions
  }
}
```

### 6. Update User Role - `PUT /api/auth/users/{userId}/role`

**Purpose**: Administrative role updates (admin only)

**Authentication**: Required - Admin role

**Request Schema**:
```typescript
{
  newRole: MedicalUserRole
  organizationCode: string
  reason: string                  // Audit requirement
  effectiveDate?: string         // Default: immediate
}
```

---

## 🏢 Organization Management Endpoints

### 7. Validate Organization - `GET /api/auth/organization/{code}/validate`

**Purpose**: Validate organization exists and user has access

**Authentication**: Required

**Response Schema**:
```typescript
{
  success: boolean
  data?: {
    organizationCode: string
    name: string
    type: 'clinic' | 'hospital' | 'pharmacy' | 'independent'
    userHasAccess: boolean
    allowedRoles: MedicalUserRole[]
    features: string[]
    complianceStatus: {
      hipaa: boolean
      gdpr: boolean
      lastAudit: string
    }
  }
}
```

---

## 🔍 Audit and Compliance Endpoints

### 8. Log Authentication Event - `POST /api/auth/audit`

**Purpose**: Record authentication events for compliance tracking

**Authentication**: System internal or authenticated user

**Request Schema**:
```typescript
{
  userId: string
  action: 'login' | 'logout' | 'role_change' | 'permission_grant' | 'mfa_enable'
  organizationCode: string
  ipAddress: string
  userAgent: string
  success: boolean
  errorCode?: string
  additionalContext?: Record<string, any>
}
```

### 9. Get Compliance Status - `GET /api/auth/compliance/{organizationCode}`

**Purpose**: Retrieve organization compliance status

**Authentication**: Required - Admin or compliance role

**Response Schema**:
```typescript
{
  success: boolean
  data?: {
    organizationCode: string
    complianceLevel: 'full' | 'partial' | 'non_compliant'
    certifications: {
      hipaa: { status: boolean, expiresAt?: string }
      gdpr: { status: boolean, lastAudit?: string }
      iso27001: { status: boolean, certificateNumber?: string }
    }
    lastSecurityAudit: string
    nextAuditDue: string
  }
}
```

---

## 🚨 Error Handling Patterns

### Standard Error Response Format

All API endpoints follow consistent error response pattern:

```typescript
{
  success: false
  error: {
    code: string                   // Machine-readable error code
    message: string                // Human-readable error message
    details?: Record<string, any>  // Additional context for debugging
    timestamp: string              // ISO timestamp
    requestId: string              // For support and tracking
  }
  meta?: {
    version: string                // API version
    rateLimit?: {
      remaining: number
      resetAt: string
    }
  }
}
```

### Medical Platform Error Codes

| Error Code | HTTP Status | Description | Recovery Action |
|------------|-------------|-------------|----------------|
| `INVALID_LICENSE` | 400 | Professional license validation failed | Re-enter license number |
| `ORGANIZATION_NOT_FOUND` | 404 | Organization code invalid | Contact administrator |
| `ROLE_MISMATCH` | 403 | User role insufficient for action | Request role elevation |
| `COMPLIANCE_REQUIRED` | 403 | User must accept updated policies | Redirect to compliance page |
| `MFA_REQUIRED` | 401 | Multi-factor authentication needed | Prompt for MFA code |
| `SESSION_EXPIRED` | 401 | Session no longer valid | Redirect to login |
| `GUEST_LIMIT_EXCEEDED` | 429 | Too many guest sessions | Wait before retry |
| `UNAUTHORIZED_ORGANIZATION` | 403 | User not member of organization | Contact administrator |

---

## 🔗 Supabase Integration Guidelines

### JWT Custom Claims Structure

Extend standard Supabase JWT with medical platform claims:

```typescript
interface MedicalJwtClaims extends JwtClaims {
  // Standard Supabase claims
  role: 'authenticated' | 'anon'
  
  // Medical platform extensions
  medical_role: MedicalUserRole
  practitioner_code?: string
  organization_code?: string
  permissions: string[]           // Serialized permission keys
  
  // Security
  mfa_verified: boolean
  compliance_version: string
  session_type: 'authenticated' | 'guest' | 'elevated'
}
```

### RLS Policy Integration

Coordinate with Supabase Row Level Security:

```sql
-- Example RLS policy using custom claims
CREATE POLICY "medical_user_access" ON prescriptions
  FOR ALL USING (
    (auth.jwt() ->> 'medical_role')::text IN ('practitioner', 'admin')
    AND 
    (auth.jwt() ->> 'organization_code')::text = organization_code
  );
```

### Auth Hook Implementation

Backend should implement Supabase Auth Hook for custom claims:

```typescript
// auth-hook.ts
export function addMedicalClaims(user: User, context: any) {
  // Fetch user's medical profile and organization
  const medicalProfile = getUserMedicalProfile(user.id)
  
  return {
    medical_role: medicalProfile.role,
    practitioner_code: medicalProfile.practitionerCode,
    organization_code: medicalProfile.organizationCode,
    permissions: serializePermissions(medicalProfile.permissions),
    mfa_verified: context.mfaVerified || false,
    compliance_version: getCurrentComplianceVersion(),
    session_type: 'authenticated'
  }
}
```

---

## 📊 Rate Limiting and Security

### Rate Limiting Guidelines

| Endpoint | Rate Limit | Window | Burst Allowance |
|----------|------------|--------|-----------------|
| `/auth/login` | 5 attempts | 15 minutes | 2 immediate |
| `/auth/register` | 3 attempts | 1 hour | 1 immediate |
| `/auth/refresh` | 10 requests | 1 minute | 3 immediate |
| `/auth/guest` | 5 sessions | 1 hour | 2 immediate |
| `/auth/permissions` | 100 requests | 1 minute | 20 immediate |

### Security Headers

All auth endpoints must include:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'none'; script-src 'self'
```

---

## 🧪 Testing and Validation

### Mock Data Examples

Reference `lib/auth-mock.ts` for complete mock implementations demonstrating:
- Successful authentication flows for each role
- Error scenarios and recovery patterns
- Organization context validation
- Guest session limitations
- Permission inheritance patterns

### Integration Testing Checklist

- [ ] Supabase Auth UI components work with custom backend
- [ ] JWT claims include medical platform extensions
- [ ] RLS policies enforce organization boundaries
- [ ] Rate limiting prevents abuse
- [ ] Error responses follow standard format
- [ ] Audit logging captures all required events
- [ ] Guest sessions properly limited and expire
- [ ] Role transitions work correctly
- [ ] Organization switching supported
- [ ] Compliance tracking functional

---

## 📋 Backend Implementation Priority

**Phase 1 - Core Auth** (Required for frontend auth UI):
1. User registration with role validation
2. User authentication with medical claims
3. Session refresh with custom claims
4. Basic permission checking

**Phase 2 - Medical Platform** (Required for business logic):
5. Organization management and validation
6. Role-based access control enforcement
7. Guest session management
8. Professional license validation

**Phase 3 - Compliance** (Required for production):
9. Audit logging and compliance tracking
10. Security monitoring and alerting
11. Data retention policy enforcement
12. Advanced security features (MFA, device tracking)

---

**Next Steps**: Review TypeScript interfaces in `types/auth.ts` and mock implementations in `lib/auth-mock.ts`  
**Coordination**: Schedule technical review meeting after Task 1.3 completion  
**Dependencies**: Shared Supabase project configuration (TASK02 coordination required)