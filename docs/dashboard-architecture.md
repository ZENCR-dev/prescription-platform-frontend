# Dashboard Architecture - Post-Registration Journeys

## Dev-Step 3.12: 角色特定仪表板架构设计

### 🎯 Overview

Post-registration user journeys for three roles in TCM prescription platform.

### 📊 Role Journey Mapping

#### TCM Practitioner Journey (中医师)
```
Registration → Email Verification → License Pending → License Verified → Dashboard Access
                                                                            ↓
                                                                    First-time Onboarding
                                                                            ↓
                                                                    Main Dashboard
                                                                    - Patient Management (Mock)
                                                                    - Prescription Templates
                                                                    - Recent Activities
                                                                    - Quick Actions
```

#### Pharmacy Journey (药房)
```
Registration → Email Verification → License Pending → License Verified → Dashboard Access
                                                                            ↓
                                                                    First-time Onboarding
                                                                            ↓
                                                                    Pharmacy Dashboard
                                                                    - Order Processing (Mock)
                                                                    - Inventory Overview
                                                                    - Prescription Queue
                                                                    - Analytics
```

#### Admin Journey (管理员)
```
Registration → Invite Code Validation → Email Verification → Dashboard Access
                                                                ↓
                                                        Admin Control Panel
                                                        - User Management (Mock)
                                                        - System Overview
                                                        - Verification Queue
                                                        - Platform Settings
```

### 🗂️ Route Structure

```
app/dashboard/
├── layout.tsx                          # Shared dashboard layout with role detection
├── page.tsx                            # Role redirect logic
├── [role]/
│   ├── layout.tsx                     # Role-specific layout wrapper
│   ├── page.tsx                       # Main dashboard for role
│   ├── onboarding/
│   │   ├── page.tsx                   # First-time user guide
│   │   └── components/
│   │       ├── WelcomeStep.tsx        # Welcome message
│   │       ├── ProfileSetup.tsx       # Complete profile
│   │       └── TourGuide.tsx          # Feature tour
│   └── components/
│       ├── DashboardHeader.tsx        # Role-specific header
│       ├── QuickActions.tsx           # Role-specific actions
│       └── StatsOverview.tsx          # Role-specific metrics
```

### 🔌 Adapter Layer Interface

```typescript
// lib/adapters/dashboard-adapter.ts

export interface DashboardAdapter {
  // User Profile
  getUserProfile(): Promise<UserProfile>
  updateOnboardingStatus(completed: boolean): Promise<void>
  
  // Role-specific data (all mocked)
  getPractitionerData(): Promise<PractitionerDashboard>
  getPharmacyData(): Promise<PharmacyDashboard>
  getAdminData(): Promise<AdminDashboard>
  
  // Onboarding state
  getOnboardingProgress(): OnboardingState
  saveOnboardingProgress(step: number): void
}

export interface UserProfile {
  id: string
  email: string
  role: 'tcm_practitioner' | 'pharmacy' | 'admin'
  fullName: string
  licenseStatus?: 'pending' | 'verified' | 'rejected'
  createdAt: string
  hasCompletedOnboarding: boolean
}

export interface PractitionerDashboard {
  stats: {
    totalPatients: number
    activePrescriptions: number
    pendingReviews: number
    monthlyConsultations: number
  }
  recentActivities: Activity[]
  quickActions: QuickAction[]
}

export interface PharmacyDashboard {
  stats: {
    pendingOrders: number
    totalInventory: number
    lowStockAlerts: number
    dailyFulfillments: number
  }
  orderQueue: Order[]
  inventoryAlerts: Alert[]
}

export interface AdminDashboard {
  stats: {
    totalUsers: number
    pendingVerifications: number
    activePharmacies: number
    systemHealth: 'good' | 'warning' | 'critical'
  }
  verificationQueue: Verification[]
  systemAlerts: SystemAlert[]
}
```

### 🎨 UI/UX Design Principles

1. **Role-Specific Branding**
   - TCM Practitioner: Sage green emphasis, medical iconography
   - Pharmacy: Bamboo green emphasis, inventory focus
   - Admin: Neutral tones, system monitoring focus

2. **Responsive Layout**
   - Desktop: Sidebar navigation + main content
   - Tablet: Collapsible sidebar
   - Mobile: Bottom navigation

3. **TCM Theme Integration**
   - Use existing TCM color variables from Dev-Step 3.11
   - Apply HerbalPattern/MeridianDecor decorations
   - Bilingual support via useLanguage hook

4. **Accessibility**
   - WCAG 2.1 AA compliant
   - Keyboard navigation support
   - Screen reader optimized
   - High contrast mode support

### 📦 Component Reuse Matrix

| Component | From Dev-Step | Usage |
|-----------|--------------|-------|
| AuthCard | 3.10 | Dashboard cards |
| AuthButton | 3.10 | Actions/CTAs |
| HerbalPattern | 3.11 | Background decoration |
| MeridianDecor | 3.11 | Section dividers |
| useLanguage | 3.4 | Bilingual support |
| TCM Colors | 3.11 | Theme consistency |

### 🚫 Constraints & Boundaries

- **NO Backend API Calls**: All data from adapter mocks
- **NO Patient PII**: No real patient data in mocks
- **NO Authentication Logic**: Assume already authenticated
- **localStorage Only**: For onboarding state persistence
- **Static Mock Data**: Hardcoded demo content

### 📋 Evidence Requirements (EUD)

**Step 1 Deliverables**:
- ✅ This architecture document: `docs/dashboard-architecture.md`
- ✅ Route structure plan with role mapping
- ✅ Adapter interface definitions
- ✅ Component reuse strategy from Dev-Steps 3.10/3.11

**File Anchors**:
- Architecture: `docs/dashboard-architecture.md:1-185`
- Route Plan: Lines 44-63
- Adapter Interface: Lines 67-130
- Component Matrix: Lines 155-163