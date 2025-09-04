# PRP-M1.2-Auth-Client-Integration-Frontend.md  
# Project Requirements Package - Milestone 1.2

## **Architect Zone (Immutable Section)**
*This section is defined by the Global Architect and cannot be modified by workspace teams*

### **Constitutional Authority Declaration**
- **Source Authority**: Global Architect constitutional power per SOP.md Section 580-599
- **Distribution Date**: 2025-08-28 14:45:00
- **Target Workspace**: frontend  
- **Sequential Position**: Module 1.2 in Milestone 1 linear execution sequence
- **Previous Dependency**: PRP-M1.1-Supabase-Auth-Infrastructure-Backend.md completion required
- **Template Version**: PRP-M0-v2.0 (boundary-corrected)

### **Milestone Context & Business Value**
- **Milestone Objective**: Complete frontend authentication client integration enabling seamless user experience for TCM practitioners, pharmacies, and administrators
- **Module Position**: Client integration module M1.2 - depends on M1.1 backend infrastructure, enables user-facing authentication
- **Business Value Delivered**: Intuitive authentication user experience with secure session management, role-based UI, and professional user interface for medical platform users
- **End-User Impact**: TCM practitioners and pharmacies experience seamless, secure login workflows with professional medical platform interface standards

### **Module Technical Contract**
- **Primary Technical Objective**: Implement complete @supabase/ssr client integration with Next.js middleware for authentication flows and session management
- **Integration Requirements**: Consume authentication API contract from APIdocs/APIv1.md, implement @supabase/ssr for SSR/cookie management, create authentication UI components
- **API Contract Consumption**: Authentication endpoints from backend M1.1 - user login/registration, session validation, role verification, logout flows
- **Frontend Architecture**: Next.js 14+ App Router with @supabase/ssr, TypeScript, Tailwind CSS, shadcn/ui components for authentication interface
- **Client Libraries Utilized**: @supabase/ssr (primary), @supabase/supabase-js (browser client), Next.js middleware for route protection

### **Workspace Boundary Compliance Validation**
*MANDATORY: Global Architect has validated ALL task assignments against SOP.md Workspace Responsibility Matrix*

**Boundary Violation Check (COMPLETED)**: ✅ ALL TASKS VERIFIED FRONTEND-COMPLIANT
- [x] **@supabase/ssr Integration**: ✅ ASSIGNED (Frontend responsibility for Next.js SSR integration)
- [x] **middleware.ts Files**: ✅ ASSIGNED (Frontend responsibility for Next.js middleware implementation)
- [x] **Supabase Client Utilities**: ✅ ASSIGNED (Frontend responsibility for browser/server client setup)
- [x] **Database Schema/RLS**: NOT assigned (Backend infrastructure management authority)  
- [x] **Edge Functions**: NOT assigned (Backend server-side business logic authority)
- [x] **API Documentation Authority**: NOT assigned (Backend maintains EXCLUSIVE APIdocs authority)

**Cross-Workspace Integration Points** (BOUNDARY-SAFE):
- API consumption: Frontend (client implementation) consumes Backend (endpoint authority) published contract
- Session coordination: Frontend (@supabase/ssr middleware) handles client sessions based on Backend (server validation) infrastructure  
- Authentication flow: Frontend (UI/client) integrates with Backend (auth infrastructure) via published APIs

**Violation Prevention Protocol**: ✅ NO BOUNDARY VIOLATIONS DETECTED - This PRP safely assigns only frontend client integration tasks

### **Module Exit Criteria (MEM) - Mandatory Validation Gates**

**Functional Completeness Criteria**:
- [ ] @supabase/ssr library successfully integrated with Next.js App Router for SSR authentication
- [ ] Next.js middleware.ts implemented for route protection and session management  
- [ ] Authentication UI components functional with role-based login/registration flows
- [ ] Client-side session management operational with secure cookie handling

**API Contract Integration Criteria**:
- [ ] All authentication API endpoints from APIdocs/APIv1.md successfully consumed and integrated
- [ ] Frontend authentication flows properly handle backend API response formats and error codes
- [ ] Role-based authentication responses correctly parsed and utilized for UI state management
- [ ] API error handling implemented with user-friendly error messages and fallback states

**Security & Client-Side Compliance Criteria**:
- [ ] Zero-PII mandate maintained - frontend authentication never collects or displays patient information
- [ ] HIPAA compliance for frontend user data handling with secure session storage
- [ ] Client-side security patterns implemented - HTTP-only cookies, secure session handling
- [ ] Authentication state management follows security best practices with proper logout and session cleanup

**Quality Standards Criteria**:
- [ ] Frontend authentication code quality meets project standards (TypeScript strict, ESLint, component documentation)
- [ ] Authentication UI test coverage ≥85% with user interaction testing and accessibility validation
- [ ] Authentication UI performance <3s initial load, <1s authentication flow completion
- [ ] Authentication interface documentation and user experience guidelines completed

**Integration Validation Criteria**:
- [ ] Frontend authentication successfully integrates with backend authentication infrastructure
- [ ] Cross-browser authentication compatibility validated (Chrome, Firefox, Safari)
- [ ] Mobile-responsive authentication interface tested and validated
- [ ] End-to-end authentication flow tested across frontend-backend boundary

### **Technical Constraints & Compliance Requirements**

**Frontend Client Integration Mandates**:
- **Client Library Authority**: MUST use @supabase/ssr for Next.js server-side rendering and session management
- **Middleware Implementation**: MUST implement middleware.ts for route protection following Next.js patterns
- **Browser Client**: MUST use official @supabase/supabase-js for browser-side authentication
- **Session Management**: MUST handle authentication state via Supabase client libraries exclusively
- **No Custom Auth**: FORBIDDEN to implement custom JWT handling or authentication bypassing Supabase clients

**Zero-PII Frontend Mandate**:
- **UI Design**: Authentication interfaces MUST NOT collect or display any patient personal information  
- **Form Validation**: Registration forms limited to professional information only (no patient data fields)
- **Session Data**: Client-side session storage MUST exclude patient identifiable information
- **Compliance**: Frontend authentication flows verified to maintain zero patient PII architecture

**Medical Platform UX Requirements**:
- **Professional Interface**: Authentication UI must meet medical platform professional standards
- **Accessibility**: WCAG 2.1 AA compliance for medical professionals with disabilities
- **Multi-Role Support**: UI adapts appropriately for practitioner/pharmacy/admin role differences  
- **Security UX**: Clear security indicators and user guidance for authentication best practices

### **Dependencies & Integration Points**

**Upstream Dependencies**:
- **Backend API Contract**: MUST await completion of M1.1 and published authentication API specifications in APIdocs/APIv1.md
- **Authentication Infrastructure**: Backend authentication infrastructure must be operational and tested
- **API Documentation**: Complete authentication endpoint documentation with request/response formats
- **Backend Testing**: Backend authentication APIs must pass all MEM criteria before frontend integration begins

**Downstream Impact**:
- **User Experience Foundation**: Provides authentication UX foundation for all subsequent frontend modules
- **Session Infrastructure**: Client-side session management enables all protected frontend functionality
- **Role-Based UI**: Authentication role detection enables role-based interface rendering in future modules
- **Integration Pattern**: Establishes frontend-backend authentication integration pattern for all subsequent modules

**Cross-Workspace Dependencies**:
- **Backend API Consumption**: Frontend consumes backend authentication API contract exclusively
- **Integration Testing**: Requires coordination with backend team for cross-workspace authentication testing
- **Error Handling**: Frontend error handling must align with backend API error response formats
- **Performance Coordination**: Frontend authentication performance must coordinate with backend response time requirements

### **Resource Allocation & Timeline Framework**  

**Engineering Unit Definitions (EUDs)**:
- **Estimated Components**: 4 Components (client integration and UI implementation focus)
- **Estimated Dev-Steps**: 10-12 Dev-Steps (standard frontend authentication integration)
- **Complexity Assessment**: Medium (dependent on backend API contract stability and @supabase/ssr integration)
- **Risk Factor**: Low-Medium (based on mature frontend frameworks and established patterns)

**Timeline Framework**:
- **Dependency Wait Time**: 0.5-1 day waiting for M1.1 completion and API contract publication
- **Estimated Implementation Duration**: 2-3 business days after dependency satisfaction
- **Critical Path Items**: @supabase/ssr integration, middleware.ts implementation  
- **Parallel Execution Opportunities**: UI component development can parallel authentication flow implementation
- **Buffer Allocation**: 0.5 days buffer for API integration challenges and cross-workspace testing

---

## **Engineer Zone (Flexible Implementation Section)**
*This section is completed by the receiving Frontend Lead*

### **Component Breakdown & Implementation Plan**
*Completed by Frontend Lead using EUDs methodology and official APIv1.md specification*

**Component Implementation Strategy** (21 Dev-Steps Total): ⚠️ **Updated from 16 to 21 Dev-Steps (including 5 parallel streams)**
*Each Dev-Step = 1 complete 4-Step QAD Cycle (Research → Implement → Test → Commit)*
*UI/UX Components now include mandatory user participation phases per Layer 2 requirements*

#### **Component 1: Supabase Client Infrastructure** (3 Dev-Steps)
**Purpose**: Foundational client utilities for browser, server, and middleware contexts
**API Reference**: Official `docs/api/APIv1.md` - Standard Supabase endpoints
- [ ] **Dev-Step 1.1**: Browser client (`lib/supabase/client.ts`) with auth.getClaims() support
- [ ] **Dev-Step 1.2**: Server client (`lib/supabase/server.ts`) for SSR and cookie handling  
- [ ] **Dev-Step 1.3**: Middleware client (`lib/supabase/middleware.ts`) for session validation
**Dependencies**: Supabase environment variables, @supabase/ssr package ✅

#### **Component 2: Next.js Middleware Implementation** (3 Dev-Steps)  
**Purpose**: Route protection and session management using RLS policy patterns
**API Integration**: JWT role checking via `auth.jwt()->>'role'` from APIv1.md
- [ ] **Dev-Step 2.1**: Base middleware.ts with JWT claims validation
- [ ] **Dev-Step 2.2**: Protected route definitions (tcm_practitioner/pharmacy/admin)
- [ ] **Dev-Step 2.3**: Session refresh mechanism using standard Supabase patterns
**Dependencies**: Component 1 completion

#### **Component 3: Authentication UI Components** (12 Dev-Steps) ⚠️ **Updated with Parallel Work Streams**
**Purpose**: User authentication interface aligned with APIv1.md user_metadata schema
**API Endpoints**: `/auth/v1/signup`, `/auth/v1/token`, `/auth/v1/logout`

**Base Authentication UI** (Original 7 Dev-Steps):
- [x] **Dev-Step 3.1**: UI/UX需求分析和用户访谈准备 (Analysis & User Research Prep) ✅
- [x] **Dev-Step 3.2**: 创建HTML原型和界面草图 (Create HTML Prototypes & Mockups) ✅
- [x] **Dev-Step 3.3**: 【用户参与】原型评审和反馈收集 (User Review & Feedback Collection) ✅
- [x] **Dev-Step 3.4**: Login form implementation using `POST /auth/v1/token` endpoint ✅
- [x] **Dev-Step 3.5**: Registration form with user_metadata ⏸️ **[PAUSED - Awaiting Backend Edge Functions]**
- [ ] **Dev-Step 3.6**: 【用户参与】UI测试和体验优化 (User Testing & UX Optimization)
- [ ] **Dev-Step 3.7**: Error handling, logout functionality, and final polish

**🚀 Parallel Work Streams** (5 Additional Dev-Steps - Backend-Independent):
- [ ] **Dev-Step 3.8**: 🔄 **[PARALLEL]** Adapter Pattern Implementation - Service layer for Edge Function migration
- [ ] **Dev-Step 3.9**: 🔄 **[PARALLEL]** Enhanced UI States - Client validation, loading states, error recovery
- [ ] **Dev-Step 3.10**: 🔄 **[PARALLEL]** Component Library Extensions - Reusable auth components
- [ ] **Dev-Step 3.11**: 🔄 **[PARALLEL]** TCM Cultural Design Layer - Visual identity and professional UI
- [ ] **Dev-Step 3.12**: 🔄 **[PARALLEL]** Post-Registration Journeys - Role-specific dashboards and onboarding

**Dependencies**: None - can develop in parallel with Component 1
**User Participation**: 2 mandatory user feedback cycles at Dev-Steps 3.3 and 3.6
**Parallel Execution**: Dev-Steps 3.8-3.12 approved by Global Architect for concurrent development

#### **Component 4: Session Management & Protection** (3 Dev-Steps)
**Purpose**: Application-wide auth state using onAuthStateChange + getClaims()
**RLS Integration**: Direct auth.uid() validation and role-based access control
- [x] **Dev-Step 4.1**: AuthProvider with onAuthStateChange real-time updates ✅ **2025-09-04**
- [ ] **Dev-Step 4.2**: ProtectedRoute HOC using auth.uid() validation
- [ ] **Dev-Step 4.3**: Loading states and session management hooks
**Dependencies**: Components 1 & 2 completion

### **Implementation Progress Tracking**
*Frontend Lead maintains real-time progress updates*

**Progress Format**: [YYYY-MM-DD HH:MM] [QAD-Phase] [Component-Task] [STATUS] - [Details]

*Frontend Lead: Update TodoWrite daily with component completion status and maintain implementation log*

---

**PRP Status**: ✅ **Boundary-Compliant** | 🎯 **Client-Integration-Focused** | 🔗 **Backend-Dependent** | 🚀 **Ready for Frontend Implementation**

*This corrected PRP assigns exclusively frontend client integration tasks, consuming backend authentication infrastructure via published API contract.*