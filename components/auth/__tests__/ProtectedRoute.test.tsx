/**
 * ProtectedRoute HOC 测试 - 主要功能测试
 * 
 * @implements 架构师测试矩阵 DEV-STEP-4.2-DESIGN-SPECIFICATION.md Section 5
 * @covers 认证状态矩阵、失败优先级、边界情况、协同验证
 * 
 * 测试覆盖:
 * 1. 认证状态测试矩阵 (登录/未登录×三角色×requireVerified×requireMFA)
 * 2. 失败优先级测试矩阵 (多条件同时失败时的单一DenialCode选择)  
 * 3. 边界情况测试 (redirect+returnTo环路检测/403展示/错误边界)
 * 4. 协同验证测试 (AuthProvider事件×getUserClaims('auth')协同)
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { useRouter, usePathname } from 'next/navigation'
import ProtectedRoute, { DenialCode, type ProtectedRouteProps, type DenialContext, type DenialResponse } from '../ProtectedRoute'
import { getUserClaims, type UserClaims, type UserRole } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthProvider'

// Mock dependencies
jest.mock('next/navigation')
jest.mock('@/lib/supabase/client')
jest.mock('@/contexts/AuthProvider')

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn()
}

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockGetUserClaims = getUserClaims as jest.MockedFunction<typeof getUserClaims>
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
})

describe('ProtectedRoute HOC', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue(mockRouter)
    mockUsePathname.mockReturnValue('/dashboard')
    mockSessionStorage.getItem.mockReturnValue(null)
  })

  describe('1. 认证状态测试矩阵 - Section 5.1', () => {
    
    describe('1.1 未认证用户测试', () => {
      beforeEach(() => {
        mockUseAuth.mockReturnValue({
          isAuthenticated: false,
          isLoading: false,
          userClaims: null,
          session: null,
          user: null,
          signOut: jest.fn(),
          refreshClaims: jest.fn(),
          hasRole: jest.fn(() => false),
          isVerified: false,
          hasMFA: false,
          error: null,
          clearError: jest.fn()
        })
        mockGetUserClaims.mockResolvedValue(null)
      })

      test('未登录用户访问无要求路由 → NOT_AUTHENTICATED', async () => {
        render(
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        )

        // 应显示loading状态（检查loading spinner）
        const loadingSpinner = document.querySelector('.animate-spin')
        expect(loadingSpinner).toBeInTheDocument()

        await waitFor(() => {
          expect(screen.getByText('正在重定向...')).toBeInTheDocument()
        })

        // 应重定向到登录页面
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/login?return=%2Fdashboard')
      })

      test('未登录用户访问admin要求路由 → NOT_AUTHENTICATED (优先级1)', async () => {
        render(
          <ProtectedRoute requiredRole="admin" requireMFA={true} requireVerified={true}>
            <div>Admin Content</div>
          </ProtectedRoute>
        )

        await waitFor(() => {
          expect(mockRouter.push).toHaveBeenCalledWith('/auth/login?return=%2Fdashboard')
        })
      })
    })

    describe('1.2 已认证用户 - 角色测试', () => {
      const adminClaims: UserClaims = {
        role: 'admin',
        license_number: '12345',
        business_name: 'Test Admin',
        verification_status: 'verified',
        aal: 'aal2'
      }

      const tcmClaims: UserClaims = {
        role: 'tcm_practitioner',
        license_number: '67890',
        business_name: 'Test TCM',
        verification_status: 'verified',
        aal: 'aal2'
      }

      const pharmacyClaims: UserClaims = {
        role: 'pharmacy',
        license_number: '11111',
        business_name: 'Test Pharmacy',
        verification_status: 'verified',
        aal: 'aal2'
      }

      beforeEach(() => {
        mockUseAuth.mockReturnValue({
          isAuthenticated: true,
          isLoading: false,
          userClaims: adminClaims,
          session: {} as any,
          user: {} as any,
          signOut: jest.fn(),
          refreshClaims: jest.fn(),
          hasRole: jest.fn((role: UserRole) => adminClaims.role === role),
          isVerified: true,
          hasMFA: true,
          error: null,
          clearError: jest.fn()
        })
      })

      test('admin登录访问admin要求路由 → authorized', async () => {
        mockGetUserClaims.mockResolvedValue(adminClaims)

        await act(async () => {
          render(
            <ProtectedRoute requiredRole="admin" debugMode={true}>
              <div>Admin Dashboard</div>
            </ProtectedRoute>
          )
        })

        await waitFor(() => {
          expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
        })

        expect(mockRouter.push).not.toHaveBeenCalled()
      })

      test('admin登录访问tcm要求路由 → ROLE_MISMATCH', async () => {
        mockGetUserClaims.mockResolvedValue(adminClaims)

        render(
          <ProtectedRoute requiredRole="tcm_practitioner">
            <div>TCM Content</div>
          </ProtectedRoute>
        )

        await waitFor(() => {
          expect(mockRouter.push).toHaveBeenCalledWith('/403')
        })
      })

      test('tcm登录访问需验证路由但未验证 → NOT_VERIFIED', async () => {
        const unverifiedTcm = { ...tcmClaims, verification_status: 'pending' as const }
        mockGetUserClaims.mockResolvedValue(unverifiedTcm)
        
        mockUseAuth.mockReturnValue({
          ...mockUseAuth(),
          userClaims: unverifiedTcm,
          isVerified: false
        })

        render(
          <ProtectedRoute requiredRole="tcm_practitioner" requireVerified={true}>
            <div>TCM Verified Content</div>
          </ProtectedRoute>
        )

        await waitFor(() => {
          expect(mockRouter.push).toHaveBeenCalledWith('/professional/license')
        })
      })

      test('tcm登录需要MFA但只有aal1 → MFA_REQUIRED', async () => {
        const noMfaTcm = { ...tcmClaims, aal: 'aal1' as const }
        mockGetUserClaims.mockResolvedValue(noMfaTcm)
        
        mockUseAuth.mockReturnValue({
          ...mockUseAuth(),
          userClaims: noMfaTcm,
          hasMFA: false
        })

        render(
          <ProtectedRoute requiredRole="tcm_practitioner" requireMFA={true}>
            <div>MFA Required Content</div>
          </ProtectedRoute>
        )

        await waitFor(() => {
          expect(mockRouter.push).toHaveBeenCalledWith('/auth/mfa-setup')
        })
      })
    })
  })

  describe('2. 失败优先级测试矩阵 - Section 5.1.1', () => {
    
    test('优先级1: NOT_AUTHENTICATED > MFA_REQUIRED', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        userClaims: null,
        session: null,
        user: null,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => false),
        isVerified: false,
        hasMFA: false,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(null)

      render(
        <ProtectedRoute requiredRole="admin" requireMFA={true} requireVerified={true}>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        // 应重定向到登录页面，而非MFA设置页面
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/login?return=%2Fdashboard')
      })
    })

    test('优先级2: MFA_REQUIRED > NOT_VERIFIED', async () => {
      const unverifiedNoMfaUser: UserClaims = {
        role: 'admin',
        license_number: '12345',
        business_name: 'Test',
        verification_status: 'pending',
        aal: 'aal1'
      }

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        userClaims: unverifiedNoMfaUser,
        session: {} as any,
        user: {} as any,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => true),
        isVerified: false,
        hasMFA: false,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(unverifiedNoMfaUser)

      render(
        <ProtectedRoute requiredRole="tcm_practitioner" requireMFA={true} requireVerified={true}>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        // 应重定向到MFA设置，而非license验证
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/mfa-setup')
      })
    })

    test('优先级3: NOT_VERIFIED > ROLE_MISMATCH', async () => {
      const verifiedWrongRoleUser: UserClaims = {
        role: 'admin',
        license_number: '12345',
        business_name: 'Test',
        verification_status: 'pending',
        aal: 'aal2'
      }

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        userClaims: verifiedWrongRoleUser,
        session: {} as any,
        user: {} as any,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => false),
        isVerified: false,
        hasMFA: true,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(verifiedWrongRoleUser)

      render(
        <ProtectedRoute requiredRole="tcm_practitioner" requireVerified={true}>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        // 应重定向到license验证，而非403页面
        expect(mockRouter.push).toHaveBeenCalledWith('/professional/license')
      })
    })

    test('优先级4: ROLE_MISMATCH (最低优先级)', async () => {
      const verifiedWrongRoleUser: UserClaims = {
        role: 'admin',
        license_number: '12345',
        business_name: 'Test',
        verification_status: 'verified',
        aal: 'aal2'
      }

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        userClaims: verifiedWrongRoleUser,
        session: {} as any,
        user: {} as any,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => false),
        isVerified: true,
        hasMFA: true,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(verifiedWrongRoleUser)

      render(
        <ProtectedRoute requiredRole="tcm_practitioner">
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        // 最终重定向到403页面
        expect(mockRouter.push).toHaveBeenCalledWith('/403')
      })
    })
  })

  describe('3. 边界情况测试 - Section 5.3', () => {
    
    test('redirect + returnTo环路检测', async () => {
      // 模拟已有重定向历史
      mockSessionStorage.getItem.mockImplementation((key) => {
        if (key === 'redirect_history') {
          const now = Date.now()
          return JSON.stringify([now - 1000, now - 2000, now - 3000]) // 3次重定向
        }
        return null
      })

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        userClaims: null,
        session: null,
        user: null,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => false),
        isVerified: false,
        hasMFA: false,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(null)

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        // 应回退到dashboard而非循环重定向
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
      })
    })

    test('403显示测试 - fallback渲染', async () => {
      const wrongRoleUser: UserClaims = {
        role: 'admin',
        license_number: '12345',
        business_name: 'Test',
        verification_status: 'verified',
        aal: 'aal2'
      }

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        userClaims: wrongRoleUser,
        session: {} as any,
        user: {} as any,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => false),
        isVerified: true,
        hasMFA: true,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(wrongRoleUser)

      await act(async () => {
        render(
          <ProtectedRoute 
            requiredRole="tcm_practitioner"
            fallback={<div>Access Denied</div>}
            debugMode={true}
          >
            <div>Protected Content</div>
          </ProtectedRoute>
        )
      })

      await waitFor(() => {
        expect(screen.getByText('Access Denied')).toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
      })
    })

    test('错误边界路径 - getUserClaims抛出异常', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        userClaims: null,
        session: {} as any,
        user: {} as any,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => true),
        isVerified: true,
        hasMFA: true,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockRejectedValue(new Error('Network Error'))

      // 捕获console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          '[ProtectedRoute] 权限验证异常:',
          expect.any(Error)
        )
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/login?return=%2Fdashboard')
      })

      consoleSpy.mockRestore()
    })

    test('onDenied自定义处理 - 阻止默认行为', async () => {
      const mockOnDenied = jest.fn((): DenialResponse => ({
        action: 'custom',
        preventDefault: true
      }))

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        userClaims: null,
        session: null,
        user: null,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => false),
        isVerified: false,
        hasMFA: false,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(null)

      await act(async () => {
        render(
          <ProtectedRoute onDenied={mockOnDenied} debugMode={true}>
            <div>Protected Content</div>
          </ProtectedRoute>
        )
      })

      await waitFor(() => {
        expect(mockOnDenied).toHaveBeenCalledWith({
          code: DenialCode.NOT_AUTHENTICATED,
          reason: 'Access denied: NOT_AUTHENTICATED',
          userClaims: null,
          requestedPath: '/dashboard',
          timestamp: expect.any(Number)
        })
      })

      // 自定义处理阻止了默认重定向
      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })

  describe('4. 安全约束测试 - Section 1.5', () => {
    
    test('重定向安全校验 - 禁止外域重定向', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const mockOnDenied = jest.fn((): DenialResponse => ({
        action: 'redirect',
        redirectTo: 'https://evil.com/steal-data'
      }))

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        userClaims: null,
        session: null,
        user: null,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => false),
        isVerified: false,
        hasMFA: false,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(null)

      render(
        <ProtectedRoute onDenied={mockOnDenied}>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          '[ProtectedRoute] 🚫 不安全的重定向目标被阻止:',
          'https://evil.com/steal-data'
        )
        // 应使用默认安全重定向
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/login?return=%2Fdashboard')
      })

      consoleSpy.mockRestore()
    })

    test('returnTo安全校验 - 仅允许白名单路径', async () => {
      mockUsePathname.mockReturnValue('/dangerous/../admin')
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        userClaims: null,
        session: null,
        user: null,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => false),
        isVerified: false,
        hasMFA: false,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(null)

      await act(async () => {
        render(
          <ProtectedRoute preserveReturnTo={true} debugMode={true}>
            <div>Protected Content</div>
          </ProtectedRoute>
        )
      })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          '[ProtectedRoute] 🚫 非法returnTo路径:',
          '/dangerous/../admin'
        )
        // returnTo应该不会被设置
        expect(mockSessionStorage.setItem).not.toHaveBeenCalledWith(
          'protected_route_return',
          expect.any(String)
        )
      })

      consoleSpy.mockRestore()
    })
  })

  describe('5. checking期间安全策略 - Section 2.4', () => {
    
    test('checking状态绝不渲染children', async () => {
      // 模拟慢速getUserClaims以保持checking状态
      mockGetUserClaims.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(null), 100))
      )

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        userClaims: null,
        session: {} as any,
        user: {} as any,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => true),
        isVerified: true,
        hasMFA: true,
        error: null,
        clearError: jest.fn()
      })

      await act(async () => {
        render(
          <ProtectedRoute>
            <div>Sensitive Content</div>
          </ProtectedRoute>
        )
      })

      // checking期间应显示loading spinner，不应显示children
      const loadingSpinner = document.querySelector('.animate-spin')
      expect(loadingSpinner).toBeInTheDocument()
      expect(screen.queryByText('Sensitive Content')).not.toBeInTheDocument()

      // 等待权限验证完成
      await waitFor(() => {
        expect(screen.getByText('正在重定向...')).toBeInTheDocument()
      })

      // 仍然不应该显示敏感内容
      expect(screen.queryByText('Sensitive Content')).not.toBeInTheDocument()
    })
  })

  describe('6. 数组归一化处理 - Section 1.2', () => {
    
    test('单一角色字符串转换为数组', async () => {
      const adminClaims: UserClaims = {
        role: 'admin',
        license_number: '12345',
        business_name: 'Test',
        verification_status: 'verified',
        aal: 'aal2'
      }

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        userClaims: adminClaims,
        session: {} as any,
        user: {} as any,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => true),
        isVerified: true,
        hasMFA: true,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(adminClaims)

      render(
        <ProtectedRoute requiredRole="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(screen.getByText('Admin Content')).toBeInTheDocument()
      })
    })

    test('角色数组直接处理', async () => {
      const tcmClaims: UserClaims = {
        role: 'tcm_practitioner',
        license_number: '67890',
        business_name: 'Test',
        verification_status: 'verified',
        aal: 'aal2'
      }

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        userClaims: tcmClaims,
        session: {} as any,
        user: {} as any,
        signOut: jest.fn(),
        refreshClaims: jest.fn(),
        hasRole: jest.fn(() => true),
        isVerified: true,
        hasMFA: true,
        error: null,
        clearError: jest.fn()
      })
      mockGetUserClaims.mockResolvedValue(tcmClaims)

      render(
        <ProtectedRoute requiredRole={['admin', 'tcm_practitioner']}>
          <div>Multi Role Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(screen.getByText('Multi Role Content')).toBeInTheDocument()
      })
    })
  })
})