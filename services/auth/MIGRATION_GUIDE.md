# Registration Service Migration Guide

## 📋 Overview

This guide documents the migration path from direct Supabase Auth calls to the adapter pattern service layer, preparing for future Edge Function integration.

**Created**: 2025-09-01  
**Component**: Dev-Step 3.8 - Adapter Pattern Implementation  
**Status**: ✅ Implemented and Integrated

---

## 🏗️ Architecture

### Current Implementation (SupabaseDirectAdapter)
```
RegistrationForm → RegistrationService → SupabaseDirectAdapter → Supabase Auth
```

### Future Implementation (EdgeFunctionAdapter)
```
RegistrationForm → RegistrationService → EdgeFunctionAdapter → Edge Functions → Supabase Auth
```

---

## 🔄 Migration Completed

### Before (Direct Supabase)
```typescript
// Old implementation in RegistrationForm.tsx
import { supabase } from '@/lib/supabase/client'

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: userMetadata }
})
```

### After (Adapter Pattern)
```typescript
// New implementation in RegistrationForm.tsx
import { getRegistrationService, RegistrationData } from '@/services/auth'

const registrationService = getRegistrationService()
const result = await registrationService.register(registrationData)
```

---

## 🎯 Benefits

1. **Zero Breaking Changes**: UI components continue working without modification
2. **Future Ready**: Seamless switch to Edge Functions when available
3. **Centralized Logic**: All registration logic in one service
4. **Better Testing**: Easy to mock and test with different adapters
5. **Error Standardization**: Consistent error codes across implementations

---

## 📝 For Backend Team

When implementing Edge Functions for registration, ensure:

### 1. Validation Endpoint
```typescript
POST /api/auth/validate-registration
Request: {
  email: string
  role: 'tcm_practitioner' | 'pharmacy' | 'admin'
  licenseNumber?: string
  pharmacyName?: string
  inviteCode?: string
}
Response: {
  isValid: boolean
  errors: Array<{
    field: string
    code: string
    message: string
  }>
}
```

### 2. Registration Endpoint
```typescript
POST /api/auth/register
Request: RegistrationData
Response: {
  user: User
  requiresEmailVerification: boolean
} | {
  error: {
    code: RegistrationErrorCode
    message: string
    field?: string
  }
}
```

### 3. Error Codes
Use the standardized error codes from `RegistrationErrorCode` enum:
- `INVALID_EMAIL`
- `WEAK_PASSWORD`
- `MISSING_REQUIRED_FIELD`
- `INVALID_LICENSE_NUMBER`
- `INVALID_INVITE_CODE`
- `EMAIL_ALREADY_EXISTS`
- `REGISTRATION_FAILED`
- `NETWORK_ERROR`
- `SERVER_ERROR`

---

## 🚀 Switching to Edge Functions

When Edge Functions are ready:

### 1. Update Environment Variables
```bash
# .env.local
NEXT_PUBLIC_EDGE_FUNCTION_VALIDATE=/api/auth/validate-registration
NEXT_PUBLIC_EDGE_FUNCTION_REGISTER=/api/auth/register
NEXT_PUBLIC_USE_EDGE_FUNCTIONS=true
```

### 2. Update Service Configuration
```typescript
// services/auth/registration.service.ts
const config: RegistrationServiceConfig = {
  adapterType: AdapterType.EDGE_FUNCTION, // Switch from SUPABASE_DIRECT
  autoSelectAdapter: true // Or manually control
}
```

### 3. No UI Changes Required
The RegistrationForm component will automatically use the new adapter without any code changes.

---

## 📊 Testing

### Manual Testing
1. Registration form continues to work with current implementation ✅
2. Error messages display correctly ✅
3. Validation works for all roles ✅
4. Console logs show "Using adapter: supabase-direct" ✅

### Automated Testing
```bash
# Run validation script
node scripts/validate-adapter-pattern.js

# Results: 32/32 tests passed ✅
```

### Integration Testing
See `services/auth/registration.integration.test.ts` for examples.

---

## 🔍 Monitoring

### Current Adapter
```typescript
const service = getRegistrationService()
console.log(service.getAdapterType()) // "supabase-direct"
```

### Switch Adapters at Runtime
```typescript
// For A/B testing or gradual rollout
service.switchAdapter(AdapterType.EDGE_FUNCTION)
```

---

## 📚 Related Files

- **Service Implementation**: `services/auth/registration.service.ts`
- **Current Adapter**: `services/auth/adapters/supabase-direct.adapter.ts`
- **Future Adapter**: `services/auth/adapters/edge-function.adapter.ts`
- **Type Definitions**: `services/auth/adapters/types.ts`
- **UI Integration**: `components/auth/RegistrationForm.tsx`
- **Validation Script**: `scripts/validate-adapter-pattern.js`

---

## ✅ Checklist for Edge Function Migration

When backend provides Edge Functions:

- [ ] Implement validation endpoint with business logic
- [ ] Implement registration endpoint with role-specific workflows
- [ ] Update EdgeFunctionAdapter with actual API calls
- [ ] Set environment variables for Edge Function URLs
- [ ] Test with all three roles (TCM, Pharmacy, Admin)
- [ ] Verify error handling and messages
- [ ] Update service configuration to use Edge Functions
- [ ] Monitor performance and error rates
- [ ] Document any API changes

---

## 🤝 Contact

For questions about this migration:
- **Frontend**: Review this guide and adapter implementation
- **Backend**: See Edge Function requirements above
- **Integration**: Test with validation script

---

**Migration Status**: ✅ Frontend Ready | ⏳ Awaiting Backend Edge Functions