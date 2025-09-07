/**
 * ⚠️ RESEARCH PROTOTYPE - DO NOT USE IN PRODUCTION ⚠️
 * 
 * useAuthGuard - 权限验证核心逻辑Hook (研究原型)
 * 
 * @status Prototype-Research (QAD-Research Phase)
 * @purpose 纯逻辑权限验证研究，从ProtectedRoute抽取的逻辑
 * @architecture 基于专门化设计原则，单一职责：权限验证逻辑
 * @testing 独立可测试，无UI依赖，仅限单元测试验证
 * 
 * ⚠️ INTEGRATION RESTRICTIONS:
 * - FORBIDDEN: 不得在ProtectedRoute HOC中使用
 * - FORBIDDEN: 不得在生产路径中集成
 * - FORBIDDEN: 不得引入路由或重定向副作用
 * - ALLOWED: 仅限Pure Logic层研究和单元测试
 * 
 * ⚠️ ARCHITECT DECISION: 冻结至QAD-Implement阶段
 * - HOC主路径继续使用 getUserClaims('auth') 直接调用
 * - 本Hook仅为架构研究，验证专门化设计可行性
 * - 类型统一：移除DenialReason，使用ProtectedRoute.DenialCode
 * 
 * 研究特性：
 * - 纯逻辑hook，无UI耦合
 * - 基于业务缓存策略实验（ui/auth/mfa - 已验证合法）
 * - 简化的状态管理
 * - 清晰的错误优先级处理
 * - 与ProtectedRoute主路径解耦的实验环境
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { getUserClaims, type UserClaims, type UserRole } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthProvider'
// 本地私有拒绝码映射 - 仅Hook内部使用，不导出
// 未来将迁移至 security/denial.ts 中立层 (QAD-Implement阶段)
const enum LocalDenialCode {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  MFA_REQUIRED = 'MFA_REQUIRED', 
  NOT_VERIFIED = 'NOT_VERIFIED',
  ROLE_MISMATCH = 'ROLE_MISMATCH'
}

/**
 * 认证状态枚举 - 简化版本
 */
export type AuthGuardState = 'checking' | 'authorized' | 'unauthorized'

/**
 * ⚠️ REMOVED: DenialReason 重复定义已移除
 * 
 * 架构师要求：禁止Hook反向import HOC类型，消除分层违规
 * 当前实现：使用LocalDenialCode本地私有映射，仅Hook内部使用
 * 未来架构：拒绝码将迁移至security/denial.ts中立层 (QAD-Implement阶段)
 */

/**
 * 权限检查结果
 */
export interface AuthGuardResult {
  state: AuthGuardState
  denialReason?: LocalDenialCode  // 使用Hook本地私有映射，不导出
  userClaims?: UserClaims | null
  error?: string
}

/**
 * Hook配置选项
 */
export interface UseAuthGuardOptions {
  requiredRole?: UserRole | UserRole[]
  requireVerified?: boolean
  requireMFA?: boolean
  cacheType?: 'ui' | 'auth' | 'mfa'  // 基于业务场景的缓存策略
  enabled?: boolean  // 允许条件性启用
}

/**
 * 角色数组归一化 - 从ProtectedRoute移植
 */
const normalizeRoles = (requiredRole?: UserRole | UserRole[]): UserRole[] => {
  if (!requiredRole) return []
  return Array.isArray(requiredRole) ? requiredRole : [requiredRole]
}

/**
 * 拒绝原因判定逻辑 - 基于业务优先级
 * 使用Hook本地私有映射，避免反向依赖HOC
 */
const determineDenialReason = (
  isAuthenticated: boolean,
  userClaims: UserClaims | null,
  requiredRoles: UserRole[],
  requireVerified: boolean,
  requireMFA: boolean
): LocalDenialCode => {
  // 优先级1：未认证
  if (!isAuthenticated || !userClaims) {
    return LocalDenialCode.NOT_AUTHENTICATED
  }
  
  // 优先级2：MFA不足
  if (requireMFA && userClaims.aal !== 'aal2') {
    return LocalDenialCode.MFA_REQUIRED
  }
  
  // 优先级3：未验证专业身份
  if (requireVerified && userClaims.verification_status !== 'verified') {
    return LocalDenialCode.NOT_VERIFIED
  }
  
  // 优先级4：角色不匹配
  if (requiredRoles.length > 0 && !requiredRoles.includes(userClaims.role)) {
    return LocalDenialCode.ROLE_MISMATCH
  }
  
  throw new Error('Invalid state: all conditions passed but denial requested')
}

/**
 * useAuthGuard Hook
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}): AuthGuardResult {
  const {
    requiredRole,
    requireVerified = false,
    requireMFA = false,
    cacheType = 'auth',  // 默认使用auth缓存策略（30s TTL）
    enabled = true
  } = options

  const [result, setResult] = useState<AuthGuardResult>({
    state: 'checking'
  })

  const { isAuthenticated, isLoading } = useAuth()
  const requiredRoles = useMemo(() => normalizeRoles(requiredRole), [requiredRole])

  const checkAuthorization = useCallback(async () => {
    if (!enabled) {
      setResult({ state: 'authorized' })
      return
    }

    try {
      setResult(prev => ({ ...prev, state: 'checking', error: undefined }))
      
      // 基于业务场景选择缓存策略
      const userClaims = await getUserClaims(cacheType)
      
      // 权限判定逻辑
      const hasValidAuth = isAuthenticated && userClaims
      const hasRequiredRoles = requiredRoles.length === 0 || 
        (userClaims && requiredRoles.includes(userClaims.role))
      const hasVerification = !requireVerified || 
        (userClaims && userClaims.verification_status === 'verified')
      const hasMFA = !requireMFA || 
        (userClaims && userClaims.aal === 'aal2')
      
      // 所有条件都满足 - 授权通过
      if (hasValidAuth && hasRequiredRoles && hasVerification && hasMFA) {
        setResult({
          state: 'authorized',
          userClaims
        })
        return
      }
      
      // 权限验证失败 - 生成拒绝原因
      const denialReason = determineDenialReason(
        isAuthenticated,
        userClaims,
        requiredRoles,
        requireVerified,
        requireMFA
      )
      
      setResult({
        state: 'unauthorized',
        denialReason,
        userClaims
      })
      
    } catch (error) {
      setResult({
        state: 'unauthorized',
        denialReason: LocalDenialCode.NOT_AUTHENTICATED,  // 使用Hook本地私有映射
        error: error instanceof Error ? error.message : 'Unknown error',
        userClaims: null
      })
    }
  }, [
    enabled,
    isAuthenticated, 
    requiredRoles, 
    requireVerified, 
    requireMFA, 
    cacheType
  ])

  // AuthProvider事件协同 - 权限状态变化时重新检查
  useEffect(() => {
    if (!isLoading) {
      checkAuthorization()
    }
  }, [isLoading, checkAuthorization])

  return result
}

/**
 * 便利性hooks - 基于常见业务场景
 */

/**
 * TCM从业者权限检查
 */
export function useTCMGuard(requireVerified = true) {
  return useAuthGuard({
    requiredRole: 'tcm_practitioner',
    requireVerified,
    cacheType: 'auth'  // 专业用户使用auth缓存策略
  })
}

/**
 * 药房权限检查  
 */
export function usePharmacyGuard(requireVerified = true) {
  return useAuthGuard({
    requiredRole: 'pharmacy',
    requireVerified,
    cacheType: 'auth'
  })
}

/**
 * 管理员权限检查（高安全性）
 */
export function useAdminGuard(requireMFA = true) {
  return useAuthGuard({
    requiredRole: 'admin',
    requireVerified: true,
    requireMFA,
    cacheType: 'auth'  // 管理员使用最短TTL
  })
}

/**
 * 基础认证检查（仅需登录）
 */
export function useBasicAuthGuard() {
  return useAuthGuard({
    cacheType: 'ui'  // 基础检查使用较长的ui缓存（3分钟）
  })
}