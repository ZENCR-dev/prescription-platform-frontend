/**
 * Dashboard Adapter - Mock Data Service
 * 
 * @implements Dev-Step 3.12: Post-Registration Journeys
 * @description Mock adapter for dashboard data without backend API calls
 */

// Types
export interface UserProfile {
  id: string
  email: string
  role: 'tcm_practitioner' | 'pharmacy' | 'admin'
  fullName: string
  licenseStatus?: 'pending' | 'verified' | 'rejected'
  createdAt: string
  hasCompletedOnboarding: boolean
}

export interface Activity {
  id: string
  type: 'prescription' | 'consultation' | 'review'
  title: string
  timestamp: string
  status: 'completed' | 'pending'
}

export interface QuickAction {
  id: string
  label: string
  labelZh: string
  icon: string
  href: string
  color: string
}

export interface Order {
  id: string
  prescriptionId: string
  patientCode: string
  status: 'pending' | 'processing' | 'completed'
  items: number
  createdAt: string
}

export interface Alert {
  id: string
  type: 'low_stock' | 'expiring' | 'recall'
  message: string
  severity: 'info' | 'warning' | 'critical'
}

export interface Verification {
  id: string
  userId: string
  userName: string
  licenseNumber: string
  submittedAt: string
  status: 'pending' | 'reviewing'
}

export interface SystemAlert {
  id: string
  type: 'performance' | 'security' | 'maintenance'
  message: string
  timestamp: string
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

export interface OnboardingState {
  currentStep: number
  totalSteps: number
  completedSteps: number[]
  skipped: boolean
}

// Storage keys
const STORAGE_KEYS = {
  ONBOARDING_STATE: 'tcm_onboarding_state',
  USER_PROFILE: 'tcm_user_profile_mock'
}

// Mock data generators
function generateMockActivities(): Activity[] {
  return [
    {
      id: 'act-1',
      type: 'prescription',
      title: '处方 #2024-001 已完成',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      id: 'act-2',
      type: 'consultation',
      title: '患者咨询 - 张先生',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      id: 'act-3',
      type: 'review',
      title: '处方审核待处理',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }
  ]
}

function generateQuickActions(role: string): QuickAction[] {
  switch (role) {
    case 'tcm_practitioner':
      return [
        {
          id: 'qa-1',
          label: 'New Prescription',
          labelZh: '新建处方',
          icon: '📝',
          href: '/prescriptions/new',
          color: 'tcm-sage'
        },
        {
          id: 'qa-2',
          label: 'Patient List',
          labelZh: '患者列表',
          icon: '👥',
          href: '/patients',
          color: 'tcm-bamboo'
        },
        {
          id: 'qa-3',
          label: 'Templates',
          labelZh: '处方模板',
          icon: '📋',
          href: '/templates',
          color: 'tcm-herb'
        }
      ]
    case 'pharmacy':
      return [
        {
          id: 'qa-1',
          label: 'Process Order',
          labelZh: '处理订单',
          icon: '📦',
          href: '/orders/pending',
          color: 'tcm-bamboo'
        },
        {
          id: 'qa-2',
          label: 'Inventory',
          labelZh: '库存管理',
          icon: '🏪',
          href: '/inventory',
          color: 'tcm-sage'
        },
        {
          id: 'qa-3',
          label: 'Reports',
          labelZh: '报表分析',
          icon: '📊',
          href: '/reports',
          color: 'tcm-herb'
        }
      ]
    case 'admin':
      return [
        {
          id: 'qa-1',
          label: 'User Management',
          labelZh: '用户管理',
          icon: '👤',
          href: '/admin/users',
          color: 'gray'
        },
        {
          id: 'qa-2',
          label: 'Verifications',
          labelZh: '资质审核',
          icon: '✅',
          href: '/admin/verifications',
          color: 'blue'
        },
        {
          id: 'qa-3',
          label: 'System Settings',
          labelZh: '系统设置',
          icon: '⚙️',
          href: '/admin/settings',
          color: 'purple'
        }
      ]
    default:
      return []
  }
}

// Dashboard Adapter Implementation
export class DashboardAdapter {
  // Get user profile from mock storage
  async getUserProfile(): Promise<UserProfile> {
    // Try to get from localStorage first
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE)
    if (stored) {
      return JSON.parse(stored)
    }

    // Generate default mock profile
    const mockProfile: UserProfile = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email: 'doctor@tcm.com',
      role: 'tcm_practitioner',
      fullName: '张医生',
      licenseStatus: 'verified',
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false
    }

    // Store for consistency
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(mockProfile))
    return mockProfile
  }

  // Update onboarding status
  async updateOnboardingStatus(completed: boolean): Promise<void> {
    const profile = await this.getUserProfile()
    profile.hasCompletedOnboarding = completed
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile))
  }

  // Get practitioner dashboard data
  async getPractitionerData(): Promise<PractitionerDashboard> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      stats: {
        totalPatients: 156,
        activePrescriptions: 23,
        pendingReviews: 5,
        monthlyConsultations: 47
      },
      recentActivities: generateMockActivities(),
      quickActions: generateQuickActions('tcm_practitioner')
    }
  }

  // Get pharmacy dashboard data
  async getPharmacyData(): Promise<PharmacyDashboard> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      stats: {
        pendingOrders: 12,
        totalInventory: 3456,
        lowStockAlerts: 8,
        dailyFulfillments: 28
      },
      orderQueue: [
        {
          id: 'ord-1',
          prescriptionId: 'rx-2024-001',
          patientCode: 'P001',
          status: 'pending',
          items: 5,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: 'ord-2',
          prescriptionId: 'rx-2024-002',
          patientCode: 'P002',
          status: 'processing',
          items: 3,
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        }
      ],
      inventoryAlerts: [
        {
          id: 'alert-1',
          type: 'low_stock',
          message: '当归库存不足 (剩余: 50g)',
          severity: 'warning'
        },
        {
          id: 'alert-2',
          type: 'expiring',
          message: '人参将在30天内过期',
          severity: 'info'
        }
      ]
    }
  }

  // Get admin dashboard data
  async getAdminData(): Promise<AdminDashboard> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      stats: {
        totalUsers: 523,
        pendingVerifications: 17,
        activePharmacies: 45,
        systemHealth: 'good'
      },
      verificationQueue: [
        {
          id: 'ver-1',
          userId: 'user-001',
          userName: '李医生',
          licenseNumber: '110000202400001',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        {
          id: 'ver-2',
          userId: 'user-002',
          userName: '王药师',
          licenseNumber: '110000202400002',
          submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          status: 'reviewing'
        }
      ],
      systemAlerts: [
        {
          id: 'sys-1',
          type: 'performance',
          message: 'API response time optimal (<200ms)',
          timestamp: new Date().toISOString()
        },
        {
          id: 'sys-2',
          type: 'maintenance',
          message: 'Scheduled maintenance: Sunday 2:00 AM',
          timestamp: new Date().toISOString()
        }
      ]
    }
  }

  // Get onboarding progress
  getOnboardingProgress(): OnboardingState {
    const stored = localStorage.getItem(STORAGE_KEYS.ONBOARDING_STATE)
    if (stored) {
      return JSON.parse(stored)
    }

    // Default state
    const defaultState: OnboardingState = {
      currentStep: 0,
      totalSteps: 4,
      completedSteps: [],
      skipped: false
    }

    localStorage.setItem(STORAGE_KEYS.ONBOARDING_STATE, JSON.stringify(defaultState))
    return defaultState
  }

  // Save onboarding progress
  saveOnboardingProgress(step: number): void {
    const state = this.getOnboardingProgress()
    state.currentStep = step
    if (!state.completedSteps.includes(step)) {
      state.completedSteps.push(step)
    }
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_STATE, JSON.stringify(state))
  }

  // Skip onboarding
  skipOnboarding(): void {
    const state = this.getOnboardingProgress()
    state.skipped = true
    state.currentStep = state.totalSteps
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_STATE, JSON.stringify(state))
    this.updateOnboardingStatus(true)
  }

  // Reset onboarding (for testing)
  resetOnboarding(): void {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_STATE)
    this.updateOnboardingStatus(false)
  }
}

// Export singleton instance
export const dashboardAdapter = new DashboardAdapter()