# Examples Directory

This directory contains reusable code patterns, architecture examples, and implementation guides for the Supabase-First prescription platform.

## Directory Structure

### 📐 Architecture Examples
- `supabase-first-architecture.md` - Complete Supabase-First architecture guide
- `project-initialization.md` - Project setup and component migration guide

### 🧩 Component Examples  
- `component-reuse-guide.md` - 11 reusable components with adaptation levels
- `PrescriptionCreator.tsx` - Complete prescription creation component (Level 2 adaptation)
- `MedicineSearch.tsx` - Drug search component (Level 1 reuse)
- `PrescriptionDashboard.tsx` - Dashboard with real-time subscriptions (Level 2 adaptation)
- `PrescriptionDetailModal.tsx` - Prescription details modal (Level 1 reuse)

### 🔐 Authentication Examples
- `guest-mode-implementation.md` - Complete Guest mode system implementation
- `GuestModeGuard.tsx` - Route protection component (Level 1 adaptation)
- `withAuth.tsx` - HOC for Supabase Auth integration (Level 1 adaptation)

### 🛠️ Service Examples
- `prescriptionService.ts` - Prescription data management (Level 3 adaptation)
- `medicineService.ts` - Medicine API integration (Level 3 adaptation)
- `guestDataManager.ts` - Local data management for Guest mode (Level 1 reuse)
- `prescriptionCalculator.ts` - Business logic calculations (Level 1 reuse)
- `qrParser.ts` - QR code parsing utility (Level 1 reuse)

### 📋 Context Engineering
- `templates/` - PRP templates for feature development
- `EXAMPLE_multi_agent_prp.md` - Complete PRP example

### 🏥 Compliance Examples
- Privacy-compliant data models
- GDPR/HIPAA anonymization patterns
- Secure data handling examples

## Component Adaptation Levels

### Level 1 Reuse (Direct Migration - 80-90% time savings)
- ✅ Fully tested, zero modification required
- Components: MedicineSearch, PrescriptionDetailModal, qrParser, prescriptionCalculator, guestDataManager

### Level 2 Adaptation (Supabase Integration - 60-70% time savings)  
- 🔄 Require Supabase Auth/Client integration and privacy compliance
- Components: PrescriptionCreator, PrescriptionDashboard

### Level 3 Adaptation (API Architecture Change - 40-50% time savings)
- 🏗️ Need migration from traditional API to Supabase Client + RLS
- Services: prescriptionService, medicineService

### Level 1 Adaptation (Authentication Rewrite - 30-40% time savings)
- 🔐 Authentication components requiring complete Supabase Auth integration
- Components: GuestModeGuard, withAuth

## Privacy Compliance Requirements

**🚨 CRITICAL**: All components must comply with GDPR/HIPAA requirements:
- ❌ Remove ALL patient personal information (name, age, phone, etc.)
- ✅ Use anonymized `prescriptionCode` instead
- ✅ Maintain only practitioner and pharmacy identifiers
- ✅ Ensure complete data anonymization

## Supabase-First Architecture Constraints

**🚨 MANDATORY**: All components must use Supabase-First patterns:
- ❌ NO custom JWT authentication
- ❌ NO traditional HTTP API clients  
- ✅ Supabase Auth for all authentication
- ✅ Supabase Client for direct database access
- ✅ RLS policies for data security
- ✅ Supabase Realtime for live updates
- ✅ Edge Functions for server-side logic

## Usage Guidelines

1. **Review Component Adaptation Level** before implementation
2. **Check Privacy Compliance** requirements for medical data
3. **Follow Supabase-First** architecture patterns
4. **Test Component Integration** with provided examples
5. **Validate RLS Policies** for data access control

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Context Engineering Guide](../Context-Engineering-Intro/README.md)
- [Next.js + Supabase Starter](https://github.com/vercel/next.js/tree/canary/examples/with-supabase)
- [Privacy Compliance Guidelines](./compliance/)