'use client'

/**
 * ProtectedRoute HOC - M1.2 Dev-Step 4.2 Implementation
 * 
 * @implements 架构师设计文档 DEV-STEP-4.2-DESIGN-SPECIFICATION.md
 * @coordinates 与existing middleware.ts权威门协同，HOC仅做显示层细化
 * @integrates 与existing AuthProvider事件系统协同，使用getUserClaims('auth')
 * 
 * Architecture:
 * - Client Component Only: 必须为客户端组件，禁止在Server Components中使用
 * - Authority Gate Compliance: 不得弱化middleware.ts的权威判决
 * - State Machine: unknown → checking → authorized/unauthorized (checking期间绝不渲染children)
 * - Cache Coordination: 使用getUserClaims('auth') 30s TTL + 请求去重机制
 * - Security First: 同源校验 + 白名单验证 + 防开放重定向
 * - Evidence-Based: 生产禁诊断 + debugMode默认false
 */

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUserClaims, type UserClaims, type UserRole } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthProvider'

// Server Component误用检测 - 架构师要求1.4节
if (process.env.NODE_ENV === 'development') {
  if (typeof window === 'undefined') {
    console.error('[ProtectedRoute] 🚫 不能在Server Components中使用ProtectedRoute')
    console.error('[ProtectedRoute] 💡 请在客户端组件或\'use client\'组件中使用')
  }
}

/**
 * 架构师要求枚举错误码 - 设计文档1.1节
 * 失败优先级：NOT_AUTHENTICATED → MFA_REQUIRED → NOT_VERIFIED → ROLE_MISMATCH
 */
export enum DenialCode {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',  // 优先级1 - 未认证
  MFA_REQUIRED = 'MFA_REQUIRED',           // 优先级2 - MFA不足
  NOT_VERIFIED = 'NOT_VERIFIED',           // 优先级3 - 未验证
  ROLE_MISMATCH = 'ROLE_MISMATCH'          // 优先级4 - 角色不匹配
}

/**
 * 拒绝上下文信息
 */
export interface DenialContext {
  code: DenialCode
  reason: string
  userClaims: UserClaims | null
  requestedPath: string
  timestamp: number
}

/**
 * 拒绝响应处理 - 架构师要求安全约束
 */
export interface DenialResponse {
  action: 'redirect' | 'fallback' | 'custom'
  redirectTo?: string  // 必须经过安全校验，仅允许同源相对路径
  fallback?: React.ReactNode
  preventDefault?: boolean
}

/**
 * ProtectedRoute HOC Props - 设计文档1.1节最终版
 */
export interface ProtectedRouteProps {
  children: React.ReactNode
  
  // 角色要求 - 内部归一化为数组处理
  requiredRole?: UserRole | UserRole[]
  
  // 验证要求
  requireVerified?: boolean
  requireMFA?: boolean
  
  // 拒绝处理器 - 结构化返回，受安全约束限制
  onDenied?: (denial: DenialContext) => DenialResponse | void
  
  // 重定向配置
  redirectTo?: string
  fallback?: React.ReactNode
  
  // 返回URL保存 - 仅允许同源相对路径
  preserveReturnTo?: boolean
  
  // 开发调试 - 默认false，生产构建时去除
  debugMode?: boolean
}

/**
 * 状态机状态定义 - 设计文档2.1节
 */
type AuthorizationState = 
  | 'unknown'      // 初始状态，未开始检查
  | 'checking'     // 正在验证权限，禁止渲染children
  | 'authorized'   // 权限验证通过
  | 'unauthorized' // 权限验证失败

/**
 * 架构师要求：多条件同时失败时的单一DenialCode选择规则 - 设计文档1.3节
 * 严格按优先级顺序判定，避免"多码并发"歧义
 */
const determineDenialCode = (
  isAuthenticated: boolean,
  userClaims: UserClaims | null,
  requiredRoles: UserRole[],
  requireVerified: boolean,
  requireMFA: boolean
): DenialCode => {
  // 优先级1：NOT_AUTHENTICATED - 未认证用户优先处理
  if (!isAuthenticated || !userClaims) {
    return DenialCode.NOT_AUTHENTICATED
  }
  
  // 优先级2：MFA_REQUIRED - 已认证但MFA不足
  if (requireMFA && userClaims.aal !== 'aal2') {
    return DenialCode.MFA_REQUIRED
  }
  
  // 优先级3：NOT_VERIFIED - 已认证但未验证专业身份
  if (requireVerified && userClaims.verification_status !== 'verified') {
    return DenialCode.NOT_VERIFIED
  }
  
  // 优先级4：ROLE_MISMATCH - 已认证已验证但角色不匹配
  if (requiredRoles.length > 0 && !requiredRoles.includes(userClaims.role)) {
    return DenialCode.ROLE_MISMATCH
  }
  
  // 所有条件满足时不应调用此函数
  throw new Error('Invalid state: all conditions passed but denial code requested')
}

/**
 * requiredRole 内部归一化逻辑 - 设计文档1.2节
 */
const normalizeRoles = (requiredRole?: UserRole | UserRole[]): UserRole[] => {
  if (!requiredRole) return []
  return Array.isArray(requiredRole) ? requiredRole : [requiredRole]
}

/**
 * 重定向安全校验函数 - 架构师要求1.5节
 */
const validateRedirectSecurity = (redirectTo: string): boolean => {
  // 1. 同源相对路径检查
  if (redirectTo.startsWith('http') || redirectTo.includes('//')) {
    return false  // 禁止外域重定向
  }
  
  // 2. 路径验证（相对路径且不含恶意字符）
  if (!redirectTo.startsWith('/') || redirectTo.includes('../')) {
    return false  // 防护路径遍历
  }
  
  // 3. 受信白名单校验
  const trustedPaths = ['/auth/', '/profile/', '/403', '/dashboard', '/professional/', '/pharmacy/', '/admin/']
  const isTrusted = trustedPaths.some(path => redirectTo.startsWith(path))
  
  return isTrusted
}

/**
 * returnTo安全校验与设置函数 - 架构师要求4.3节
 */
const setSecureReturnTo = (path: string): boolean => {
  // 1. 安全校验
  if (!path.startsWith('/') || path.includes('../') || path.includes('//')) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[ProtectedRoute] 🚫 非法returnTo路径:', path)
    }
    return false
  }
  
  // 2. 白名单验证
  const allowedPrefixes = ['/dashboard', '/profile', '/prescriptions', '/admin', '/professional', '/pharmacy']
  const isAllowed = allowedPrefixes.some(prefix => path.startsWith(prefix))
  
  if (!isAllowed) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[ProtectedRoute] 🚫 returnTo路径不在白名单:', path)
    }
    return false
  }
  
  // 3. 安全存储
  try {
    const secureReturnTo = {
      path: encodeURIComponent(path),
      timestamp: Date.now(),
      maxAge: 300000  // 5分钟
    }
    sessionStorage.setItem('protected_route_return', JSON.stringify(secureReturnTo))
    return true
  } catch (error) {
    console.error('[ProtectedRoute] returnTo存储失败:', error)
    return false
  }
}

/**
 * returnTo清理函数 - 多触发点回收 - 架构师要求4.3节
 */
const cleanupReturnTo = (reason: 'target_reached' | 'sign_out' | 'expiration' | 'security_violation'): void => {
  try {
    sessionStorage.removeItem('protected_route_return')
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ProtectedRoute] returnTo已清理 - 原因: ${reason}`)
    }
  } catch (error) {
    console.error('[ProtectedRoute] returnTo清理失败:', error)
  }
}

/**
 * 环路检测与防护 - 设计文档4.3节
 */
const checkRedirectLoop = (): boolean => {
  try {
    const historyKey = 'redirect_history'
    const now = Date.now()
    const timeWindow = 30000  // 30s检测窗口
    const maxRedirects = 3    // 最大连续重定向次数
    
    const historyJson = sessionStorage.getItem(historyKey)
    let history: number[] = historyJson ? JSON.parse(historyJson) : []
    
    // 清理过期记录
    history = history.filter(time => (now - time) < timeWindow)
    
    // 检查是否超过限制
    if (history.length >= maxRedirects) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ProtectedRoute] 🚫 检测到重定向环路，执行回退策略')
      }
      sessionStorage.removeItem(historyKey)
      return true  // 检测到环路
    }
    
    // 记录本次重定向
    history.push(now)
    sessionStorage.setItem(historyKey, JSON.stringify(history))
    return false  // 未检测到环路
  } catch (error) {
    console.error('[ProtectedRoute] 环路检测失败:', error)
    return false
  }
}

/**
 * 开发调试埋点 - 编译时常量优化 - 架构师要求4.1节
 */
const developmentDiagnostics = (enabled: boolean) => {
  // 编译时常量 - 生产构建时此代码块将被完全去除
  if (process.env.NODE_ENV !== 'development' || !enabled) return null

  return {
    stateTransitions: true,
    cacheHitRatio: true, 
    authValidationTiming: true,
    denialReasons: true,
    performanceMetrics: true,
    securityValidations: true
  }
}

/**
 * ProtectedRoute HOC 主组件
 */
export default function ProtectedRoute({
  children,
  requiredRole,
  requireVerified = false,
  requireMFA = false,
  onDenied,
  redirectTo,
  fallback,
  preserveReturnTo = true,
  debugMode = false  // 架构师要求：默认false
}: ProtectedRouteProps) {
  
  const [authState, setAuthState] = useState<AuthorizationState>('unknown')
  const [denialContext, setDenialContext] = useState<DenialContext | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  
  // AuthProvider协同 - 监听认证状态变化
  const { isAuthenticated, isLoading } = useAuth()
  
  // 性能监控埋点 (仅开发环境)
  const diagnostics = developmentDiagnostics(debugMode)
  const perfStartTime = useRef<number>()
  
  // 开始检查权限
  const startChecking = useCallback(() => {
    if (diagnostics?.performanceMetrics) {
      perfStartTime.current = performance.now()
    }
    setAuthState('checking')
  }, [diagnostics])
  
  // 完成权限检查
  const endChecking = useCallback((result: 'authorized' | 'unauthorized') => {
    if (diagnostics?.performanceMetrics && perfStartTime.current) {
      const duration = performance.now() - perfStartTime.current
      console.log(`[ProtectedRoute] 权限检查耗时: ${duration.toFixed(2)}ms`)
    }
    setAuthState(result)
  }, [diagnostics])

  // requiredRole数组归一化 - 设计文档1.2节
  const requiredRoles = normalizeRoles(requiredRole)
  
  // 权限验证核心逻辑
  const checkAuthorization = useCallback(async () => {
    try {
      startChecking()
      
      if (diagnostics?.authValidationTiming) {
        console.log('[ProtectedRoute] 开始权限验证:', { 
          pathname, 
          requiredRoles, 
          requireVerified, 
          requireMFA 
        })
      }
      
      // 使用既有getUserClaims('auth')能力 - 30s安全TTL + 请求去重
      const userClaims = await getUserClaims('auth')
      
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
        if (diagnostics?.stateTransitions) {
          console.log('[ProtectedRoute] ✅ 授权通过')
        }
        endChecking('authorized')
        return
      }
      
      // 权限验证失败 - 生成拒绝上下文
      const denialCode = determineDenialCode(
        isAuthenticated,
        userClaims,
        requiredRoles,
        requireVerified,
        requireMFA
      )
      
      const denial: DenialContext = {
        code: denialCode,
        reason: `Access denied: ${denialCode}`,
        userClaims,
        requestedPath: pathname,
        timestamp: Date.now()
      }
      
      if (diagnostics?.denialReasons) {
        console.log('[ProtectedRoute] ❌ 权限验证失败:', denial)
      }
      
      setDenialContext(denial)
      endChecking('unauthorized')
      
    } catch (error) {
      console.error('[ProtectedRoute] 权限验证异常:', error)
      
      // 异常情况下的拒绝上下文
      const denial: DenialContext = {
        code: DenialCode.NOT_AUTHENTICATED,
        reason: `Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        userClaims: null,
        requestedPath: pathname,
        timestamp: Date.now()
      }
      
      setDenialContext(denial)
      endChecking('unauthorized')
    }
  }, [
    isAuthenticated, 
    requiredRoles, 
    requireVerified, 
    requireMFA, 
    pathname,
    startChecking,
    endChecking,
    diagnostics
  ])

  // AuthProvider事件协同 - 权限状态变化时重新检查
  useEffect(() => {
    if (!isLoading) {
      checkAuthorization()
    }
  }, [isLoading, checkAuthorization])
  
  // 监听SIGNED_OUT事件，清理returnTo - 架构师要求事件协同细则
  useEffect(() => {
    if (!isAuthenticated) {
      cleanupReturnTo('sign_out')
    }
  }, [isAuthenticated])

  // 处理未授权情况
  const handleUnauthorized = useCallback(() => {
    if (!denialContext) return
    
    // 保存returnTo (如果启用且路径安全)
    if (preserveReturnTo && setSecureReturnTo(pathname)) {
      if (diagnostics?.securityValidations) {
        console.log('[ProtectedRoute] returnTo已安全保存:', pathname)
      }
    }
    
    // 执行onDenied自定义处理器 - 架构师要求执行顺序
    if (onDenied) {
      const response = onDenied(denialContext)
      
      if (response && !response.preventDefault) {
        // 自定义拒绝处理 - 安全约束检查
        if (response.action === 'redirect' && response.redirectTo) {
          if (validateRedirectSecurity(response.redirectTo)) {
            // 环路检测
            if (!checkRedirectLoop()) {
              router.push(response.redirectTo)
              return
            } else {
              // 检测到环路，回退到dashboard
              router.push('/dashboard')
              return
            }
          } else {
            console.warn('[ProtectedRoute] 🚫 不安全的重定向目标被阻止:', response.redirectTo)
          }
        } else if (response.action === 'fallback' && response.fallback) {
          return response.fallback
        }
      }
    }
    
    // 默认重定向逻辑 - 与middleware.ts 403一致降级
    if (redirectTo && validateRedirectSecurity(redirectTo)) {
      if (!checkRedirectLoop()) {
        router.push(redirectTo)
      } else {
        router.push('/dashboard')  // 环路回退
      }
      return
    }
    
    // 根据拒绝码选择默认重定向 - 与middleware.ts协同
    const getDefaultRedirect = (code: DenialCode): string => {
      switch (code) {
        case DenialCode.NOT_AUTHENTICATED:
          return `/auth/login?return=${encodeURIComponent(pathname)}`
        case DenialCode.MFA_REQUIRED:
          return '/auth/mfa-setup'
        case DenialCode.NOT_VERIFIED:
          return '/professional/license'
        case DenialCode.ROLE_MISMATCH:
          return '/403'
        default:
          return '/auth/login'
      }
    }
    
    const defaultRedirect = getDefaultRedirect(denialContext.code)
    if (!checkRedirectLoop()) {
      router.push(defaultRedirect)
    } else {
      router.push('/dashboard')  // 环路回退
    }
    
  }, [denialContext, onDenied, redirectTo, preserveReturnTo, pathname, router, diagnostics])

  // 状态机渲染策略 - 设计文档2.4节
  const renderByState = () => {
    switch (authState) {
      case 'unknown':
      case 'checking':
        // 架构师要求：checking期间绝不渲染children
        return (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            {diagnostics?.stateTransitions && (
              <span className="ml-2 text-sm text-gray-600">验证权限中...</span>
            )}
          </div>
        )
      
      case 'authorized':
        // 安全渲染children
        return children
      
      case 'unauthorized':
        // 执行拒绝流程
        if (fallback) {
          return fallback
        }
        
        // 触发重定向处理
        handleUnauthorized()
        
        // 渲染等待重定向的加载状态
        return (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span className="ml-2 text-sm text-gray-600">正在重定向...</span>
          </div>
        )
      
      default:
        return null
    }
  }

  return <>{renderByState()}</>
}

// 导出类型定义供其他组件使用
export type { ProtectedRouteProps, DenialContext, DenialResponse }