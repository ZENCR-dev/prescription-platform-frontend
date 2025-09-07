/**
 * useAuthGuard Hook 隔离测试 - 研究原型专属
 * 
 * ⚠️ RESEARCH PROTOTYPE TESTING ONLY ⚠️
 * 
 * @purpose 验证Hook内部逻辑完整性，与生产回归解耦
 * @isolation 无路由副作用，无外部状态修改
 * @coverage 失败优先级序列1→2→3→4 + 三种缓存类型
 * 
 * @status Prototype-Research Testing
 * @architecture 纯逻辑测试，不测试集成效果
 * @restrictions 不得作为生产回归测试使用
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useAuthGuard, type AuthGuardResult, type UseAuthGuardOptions } from '../useAuthGuard'
import type { UserClaims, UserRole } from '@/lib/supabase/client'

// 测试用拒绝码常量 - 与Hook内部映射一致
// 避免反向依赖HOC类型，保持测试隔离性
const TestDenialCode = {
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
  MFA_REQUIRED: 'MFA_REQUIRED',
  NOT_VERIFIED: 'NOT_VERIFIED',
  ROLE_MISMATCH: 'ROLE_MISMATCH'
} as const

// Mock Dependencies - 研究级隔离
jest.mock('@/lib/supabase/client', () => ({
  getUserClaims: jest.fn(),
}))

jest.mock('@/contexts/AuthProvider', () => ({
  useAuth: jest.fn(),
}))

// 避免路由副作用 - Mock但不执行
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => '/test-path'),
}))

import { getUserClaims } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthProvider'

const mockGetUserClaims = getUserClaims as jest.MockedFunction<typeof getUserClaims>
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

// 测试数据工厂
const createMockUserClaims = (overrides?: Partial<UserClaims>): UserClaims => ({
  sub: 'test-user-id',
  email: 'test@example.com',
  role: 'tcm_practitioner' as UserRole,
  verification_status: 'verified' as const,
  aal: 'aal2' as const,
  ...overrides,
})

describe('useAuthGuard Hook - Research Prototype', () => {
  
  beforeEach(() => {
    // 重置所有mocks
    jest.clearAllMocks()
    
    // 默认认证状态
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: null,
    })
  })

  describe('失败优先级序列测试 (1→2→3→4)', () => {
    
    /**
     * 优先级1: NOT_AUTHENTICATED - 未认证用户优先处理
     */
    it('优先级1: 未认证时返回NOT_AUTHENTICATED', async () => {
      // 模拟未认证状态
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      })
      mockGetUserClaims.mockResolvedValue(null)

      const { result } = renderHook(() => useAuthGuard({
        requiredRole: 'admin',
        requireVerified: true,
        requireMFA: true,
        cacheType: 'auth', // HOC主路径缓存
      }))

      await waitFor(() => {
        expect(result.current.state).toBe('unauthorized')
        expect(result.current.denialReason).toBe(TestDenialCode.NOT_AUTHENTICATED)
        expect(result.current.userClaims).toBeNull()
      })

      // 验证缓存类型使用正确
      expect(mockGetUserClaims).toHaveBeenCalledWith('auth')
    })

    /**
     * 优先级2: MFA_REQUIRED - 已认证但MFA不足
     */
    it('优先级2: MFA不足时返回MFA_REQUIRED（忽略其他失败条件）', async () => {
      const userClaims = createMockUserClaims({
        aal: 'aal1', // MFA不足
        verification_status: 'pending', // 同时未验证
        role: 'patient' as UserRole, // 同时角色不匹配
      })
      
      mockGetUserClaims.mockResolvedValue(userClaims)

      const { result } = renderHook(() => useAuthGuard({
        requiredRole: 'admin',
        requireVerified: true,
        requireMFA: true, // 要求MFA
        cacheType: 'mfa', // 测试MFA缓存类型
      }))

      await waitFor(() => {
        expect(result.current.state).toBe('unauthorized')
        // 优先级2优于其他失败条件
        expect(result.current.denialReason).toBe(TestDenialCode.MFA_REQUIRED)
        expect(result.current.userClaims).toEqual(userClaims)
      })

      expect(mockGetUserClaims).toHaveBeenCalledWith('mfa')
    })

    /**
     * 优先级3: NOT_VERIFIED - 已认证但未验证专业身份
     */
    it('优先级3: 未验证时返回NOT_VERIFIED（忽略角色不匹配）', async () => {
      const userClaims = createMockUserClaims({
        aal: 'aal2', // MFA充足
        verification_status: 'pending', // 未验证
        role: 'patient' as UserRole, // 角色不匹配
      })
      
      mockGetUserClaims.mockResolvedValue(userClaims)

      const { result } = renderHook(() => useAuthGuard({
        requiredRole: 'admin',
        requireVerified: true, // 要求验证
        requireMFA: false,
        cacheType: 'ui', // 测试UI缓存类型
      }))

      await waitFor(() => {
        expect(result.current.state).toBe('unauthorized')
        // 优先级3优于角色不匹配
        expect(result.current.denialReason).toBe(TestDenialCode.NOT_VERIFIED)
        expect(result.current.userClaims).toEqual(userClaims)
      })

      expect(mockGetUserClaims).toHaveBeenCalledWith('ui')
    })

    /**
     * 优先级4: ROLE_MISMATCH - 已认证已验证但角色不匹配
     */
    it('优先级4: 角色不匹配时返回ROLE_MISMATCH', async () => {
      const userClaims = createMockUserClaims({
        aal: 'aal2', // MFA充足
        verification_status: 'verified', // 已验证
        role: 'patient' as UserRole, // 角色不匹配
      })
      
      mockGetUserClaims.mockResolvedValue(userClaims)

      const { result } = renderHook(() => useAuthGuard({
        requiredRole: 'admin',
        requireVerified: true,
        requireMFA: true,
        cacheType: 'auth',
      }))

      await waitFor(() => {
        expect(result.current.state).toBe('unauthorized')
        expect(result.current.denialReason).toBe(TestDenialCode.ROLE_MISMATCH)
        expect(result.current.userClaims).toEqual(userClaims)
      })
    })
  })

  describe('缓存类型分支测试', () => {
    
    /**
     * 测试三种缓存类型的正确传递
     */
    it('正确传递auth缓存类型（HOC主路径）', async () => {
      const userClaims = createMockUserClaims()
      mockGetUserClaims.mockResolvedValue(userClaims)

      renderHook(() => useAuthGuard({ cacheType: 'auth' }))
      
      await waitFor(() => {
        expect(mockGetUserClaims).toHaveBeenCalledWith('auth')
      })
    })

    it('正确传递ui缓存类型（研究级）', async () => {
      const userClaims = createMockUserClaims()
      mockGetUserClaims.mockResolvedValue(userClaims)

      renderHook(() => useAuthGuard({ cacheType: 'ui' }))
      
      await waitFor(() => {
        expect(mockGetUserClaims).toHaveBeenCalledWith('ui')
      })
    })

    it('正确传递mfa缓存类型（研究级）', async () => {
      const userClaims = createMockUserClaims()
      mockGetUserClaims.mockResolvedValue(userClaims)

      renderHook(() => useAuthGuard({ cacheType: 'mfa' }))
      
      await waitFor(() => {
        expect(mockGetUserClaims).toHaveBeenCalledWith('mfa')
      })
    })

    it('默认使用auth缓存类型', async () => {
      const userClaims = createMockUserClaims()
      mockGetUserClaims.mockResolvedValue(userClaims)

      renderHook(() => useAuthGuard({})) // 无缓存类型参数
      
      await waitFor(() => {
        expect(mockGetUserClaims).toHaveBeenCalledWith('auth')
      })
    })
  })

  describe('授权成功场景', () => {
    
    it('所有条件满足时返回authorized', async () => {
      const userClaims = createMockUserClaims({
        role: 'admin' as UserRole,
        verification_status: 'verified',
        aal: 'aal2',
      })
      
      mockGetUserClaims.mockResolvedValue(userClaims)

      const { result } = renderHook(() => useAuthGuard({
        requiredRole: 'admin',
        requireVerified: true,
        requireMFA: true,
      }))

      await waitFor(() => {
        expect(result.current.state).toBe('authorized')
        expect(result.current.denialReason).toBeUndefined()
        expect(result.current.userClaims).toEqual(userClaims)
      })
    })

    it('数组角色匹配时返回authorized', async () => {
      const userClaims = createMockUserClaims({
        role: 'tcm_practitioner' as UserRole,
      })
      
      mockGetUserClaims.mockResolvedValue(userClaims)

      const { result } = renderHook(() => useAuthGuard({
        requiredRole: ['admin', 'tcm_practitioner'],
        requireVerified: false,
        requireMFA: false,
      }))

      await waitFor(() => {
        expect(result.current.state).toBe('authorized')
        expect(result.current.userClaims).toEqual(userClaims)
      })
    })
  })

  describe('错误处理', () => {
    
    it('getUserClaims异常时返回NOT_AUTHENTICATED', async () => {
      mockGetUserClaims.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useAuthGuard({}))

      await waitFor(() => {
        expect(result.current.state).toBe('unauthorized')
        expect(result.current.denialReason).toBe(TestDenialCode.NOT_AUTHENTICATED)
        expect(result.current.error).toBe('Network error')
      })
    })
  })

  describe('Hook状态管理', () => {
    
    it('初始状态为checking', () => {
      const { result } = renderHook(() => useAuthGuard({}))
      
      expect(result.current.state).toBe('checking')
      expect(result.current.denialReason).toBeUndefined()
      expect(result.current.userClaims).toBeUndefined()
    })

    it('enabled=false时直接返回authorized', async () => {
      const { result } = renderHook(() => useAuthGuard({ enabled: false }))

      await waitFor(() => {
        expect(result.current.state).toBe('authorized')
      })
      
      // 不应调用getUserClaims
      expect(mockGetUserClaims).not.toHaveBeenCalled()
    })
  })

  describe('便利性Hooks测试', () => {
    
    it('useTCMGuard使用正确的参数', async () => {
      const { useTCMGuard } = require('../useAuthGuard')
      const userClaims = createMockUserClaims({ role: 'tcm_practitioner' })
      mockGetUserClaims.mockResolvedValue(userClaims)

      const { result } = renderHook(() => useTCMGuard(true))

      await waitFor(() => {
        expect(result.current.state).toBe('authorized')
      })

      expect(mockGetUserClaims).toHaveBeenCalledWith('auth')
    })
  })

  describe('副作用隔离验证', () => {
    
    it('Hook不执行任何路由操作', async () => {
      const mockRouter = require('next/navigation').useRouter()
      
      mockGetUserClaims.mockResolvedValue(null)
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      })

      const { result } = renderHook(() => useAuthGuard({
        requiredRole: 'admin',
      }))

      await waitFor(() => {
        expect(result.current.state).toBe('unauthorized')
      })

      // 验证无路由副作用
      expect(mockRouter().push).not.toHaveBeenCalled()
      expect(mockRouter().replace).not.toHaveBeenCalled()
    })

    it('Hook不修改sessionStorage', async () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')
      
      mockGetUserClaims.mockResolvedValue(null)

      renderHook(() => useAuthGuard())

      await waitFor(() => {
        // Hook不应操作sessionStorage
        expect(setItemSpy).not.toHaveBeenCalled()
        expect(removeItemSpy).not.toHaveBeenCalled()
      })

      setItemSpy.mockRestore()
      removeItemSpy.mockRestore()
    })
  })
})

/**
 * 研究原型测试覆盖率总结
 * 
 * ✅ 失败优先级序列 1→2→3→4 完整覆盖
 * ✅ 三种缓存类型 (ui/auth/mfa) 分支测试
 * ✅ 授权成功场景验证
 * ✅ 错误处理机制测试
 * ✅ Hook状态管理测试
 * ✅ 便利性函数测试
 * ✅ 副作用隔离验证
 * 
 * 🚫 不包含的测试（生产回归范围）：
 * - 与ProtectedRoute HOC的集成
 * - 实际路由导航行为
 * - sessionStorage操作
 * - AuthProvider真实事件
 * - 生产环境缓存行为
 */