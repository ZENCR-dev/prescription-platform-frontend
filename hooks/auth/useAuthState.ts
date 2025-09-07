'use client'

/**
 * useAuthState - M1.2 Dev-Step 4.3 Authentication State Management Hook
 * 
 * @implements 架构师设计规范 DEV-STEP-4.3-DESIGN-SPECIFICATION.md
 * @coordinates 与existing AuthProvider协同，监听实时事件
 * @integrates 与existing getUserClaims('auth')权限验证协同
 * 
 * Architecture:
 * - Client Hook Only: 'use client'指令，使用useEffect等客户端API
 * - AuthProvider Integration: 与existing AuthProvider事件系统协同
 * - Permission Logic: 基于getUserClaims结果进行权限判定
 * - Type Source: UserRole/UserClaims统一从@/lib/supabase/client导入
 * - Real-time Sync: 监听SIGNED_IN/OUT/USER_UPDATED/TOKEN_REFRESHED事件
 * - Diagnostics: 仅开发环境启用，生产构建去除
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getUserClaims, type UserClaims, type UserRole } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthProvider'

// 认证状态枚举 (与ProtectedRoute HOC一致)
type AuthState = 'unknown' | 'checking' | 'authenticated' | 'unauthenticated'
type PermissionState = 'checking' | 'authorized' | 'denied'

// Hook配置选项
export interface UseAuthStateOptions {
  requiredRole?: UserRole | UserRole[]
  requireVerified?: boolean
  requireMFA?: boolean
  enableRealTimeSync?: boolean  // 与AuthProvider事件同步，默认true
  debugMode?: boolean          // 仅开发环境
}

// Hook返回结果
export interface UseAuthStateResult {
  // 状态指示
  authState: AuthState
  permissionState: PermissionState
  
  // 用户信息
  userClaims: UserClaims | null
  currentRole: UserRole | null
  
  // 验证结果
  hasRequiredPermissions: boolean
  isVerified: boolean
  hasMFA: boolean
  
  // 错误处理
  lastError: Error | null
  denialReason: string | null
  
  // 操作方法
  recheckPermissions: () => Promise<void>
  clearAuthState: () => void
}

// 内部状态定义
interface InternalAuthState {
  authState: AuthState
  permissionState: PermissionState
  userClaims: UserClaims | null
  lastError: Error | null
  denialReason: string | null
  lastCheckTime: number
}

/**
 * useAuthState Hook
 * 
 * 与existing AuthProvider协同的认证状态管理，支持权限验证和实时事件同步
 */
export function useAuthState(options: UseAuthStateOptions = {}): UseAuthStateResult {
  const {
    requiredRole,
    requireVerified = false,
    requireMFA = false,
    enableRealTimeSync = true,
    debugMode = false
  } = options
  
  // 获取AuthProvider状态进行协同
  const authProvider = useAuth()
  const { 
    isAuthenticated, 
    isLoading: authProviderLoading, 
    userClaims: providerUserClaims,
    isVerified: providerIsVerified,
    hasMFA: providerHasMFA
  } = authProvider
  
  // 内部状态管理
  const [state, setState] = useState<InternalAuthState>({
    authState: 'unknown',
    permissionState: 'checking',
    userClaims: null,
    lastError: null,
    denialReason: null,
    lastCheckTime: 0
  })
  
  // 权限验证缓存
  const permissionCacheRef = useRef<{
    lastClaims: UserClaims | null
    lastOptions: string
    result: boolean
    timestamp: number
  } | null>(null)
  
  // 开发环境诊断日志
  const debugLog = useCallback((message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development' && debugMode) {
      console.log(`[useAuthState] ${message}`, data || '')
    }
  }, [debugMode])
  
  // 角色数组归一化 (与ProtectedRoute HOC逻辑一致)
  const normalizeRoles = useCallback((roles?: UserRole | UserRole[]): UserRole[] => {
    if (!roles) return []
    return Array.isArray(roles) ? roles : [roles]
  }, [])
  
  // 权限验证逻辑 (与ProtectedRoute HOC保持一致)
  const validatePermissions = useCallback((claims: UserClaims | null): {
    hasPermissions: boolean
    denialReason: string | null
  } => {
    if (!claims) {
      return {
        hasPermissions: false,
        denialReason: 'NOT_AUTHENTICATED'
      }
    }
    
    // MFA检查 (优先级2)
    if (requireMFA && claims.aal !== 'aal2') {
      return {
        hasPermissions: false,
        denialReason: 'MFA_REQUIRED'
      }
    }
    
    // 验证检查 (优先级3)
    if (requireVerified && claims.verification_status !== 'verified') {
      return {
        hasPermissions: false,
        denialReason: 'NOT_VERIFIED'
      }
    }
    
    // 角色检查 (优先级4)
    const requiredRoles = normalizeRoles(requiredRole)
    if (requiredRoles.length > 0 && !requiredRoles.includes(claims.role)) {
      return {
        hasPermissions: false,
        denialReason: 'ROLE_MISMATCH'
      }
    }
    
    return {
      hasPermissions: true,
      denialReason: null
    }
  }, [requireMFA, requireVerified, requiredRole, normalizeRoles])
  
  // 检查权限 (使用缓存优化)
  const checkPermissions = useCallback(async () => {
    try {
      setState(prev => ({ 
        ...prev, 
        permissionState: 'checking',
        lastError: null
      }))
      
      debugLog('开始权限检查')
      
      // 检查缓存
      const optionsKey = JSON.stringify({ requiredRole, requireVerified, requireMFA })
      const now = Date.now()
      
      if (permissionCacheRef.current && 
          permissionCacheRef.current.lastOptions === optionsKey &&
          now - permissionCacheRef.current.timestamp < 5000) { // 5秒缓存
        
        debugLog('使用权限检查缓存')
        
        const { result, lastClaims } = permissionCacheRef.current
        const { hasPermissions, denialReason } = validatePermissions(lastClaims)
        
        setState(prev => ({
          ...prev,
          permissionState: hasPermissions ? 'authorized' : 'denied',
          userClaims: lastClaims,
          denialReason,
          lastCheckTime: now
        }))
        
        return
      }
      
      // 使用existing getUserClaims('auth')进行权限验证
      const claims = await getUserClaims('auth')
      
      debugLog('获取用户声明完成', { role: claims?.role, verified: claims?.verification_status })
      
      // 验证权限
      const { hasPermissions, denialReason } = validatePermissions(claims)
      
      // 更新缓存
      permissionCacheRef.current = {
        lastClaims: claims,
        lastOptions: optionsKey,
        result: hasPermissions,
        timestamp: now
      }
      
      setState(prev => ({
        ...prev,
        permissionState: hasPermissions ? 'authorized' : 'denied',
        userClaims: claims,
        denialReason,
        lastCheckTime: now
      }))
      
      debugLog('权限检查完成', { hasPermissions, denialReason })
      
    } catch (error) {
      debugLog('权限检查失败', error)
      
      setState(prev => ({
        ...prev,
        permissionState: 'denied',
        lastError: error as Error,
        denialReason: 'AUTHENTICATION_ERROR'
      }))
    }
  }, [requiredRole, requireVerified, requireMFA, validatePermissions, debugLog])
  
  // 手动重新检查权限
  const recheckPermissions = useCallback(async () => {
    // 清除缓存强制重新检查
    permissionCacheRef.current = null
    await checkPermissions()
  }, [checkPermissions])
  
  // 清除认证状态
  const clearAuthState = useCallback(() => {
    debugLog('清除认证状态')
    
    permissionCacheRef.current = null
    setState({
      authState: 'unauthenticated',
      permissionState: 'checking',
      userClaims: null,
      lastError: null,
      denialReason: null,
      lastCheckTime: 0
    })
  }, [debugLog])
  
  // 监听AuthProvider状态变化进行协同
  useEffect(() => {
    if (authProviderLoading) {
      setState(prev => ({ ...prev, authState: 'checking' }))
      return
    }
    
    if (isAuthenticated) {
      setState(prev => ({ ...prev, authState: 'authenticated' }))
      // 认证成功后检查权限
      checkPermissions()
    } else {
      setState(prev => ({ 
        ...prev, 
        authState: 'unauthenticated',
        permissionState: 'denied',
        userClaims: null,
        denialReason: 'NOT_AUTHENTICATED'
      }))
    }
  }, [authProviderLoading, isAuthenticated, checkPermissions])
  
  // 监听AuthProvider用户声明变化 (USER_UPDATED事件)
  useEffect(() => {
    if (enableRealTimeSync && isAuthenticated && providerUserClaims) {
      debugLog('AuthProvider用户声明更新，重新检查权限')
      
      // 清除缓存并重新检查
      permissionCacheRef.current = null
      checkPermissions()
    }
  }, [enableRealTimeSync, isAuthenticated, providerUserClaims, checkPermissions, debugLog])
  
  // 计算衍生状态
  const currentRole = state.userClaims?.role || null
  const isVerified = state.userClaims?.verification_status === 'verified'
  const hasMFA = state.userClaims?.aal === 'aal2'
  const hasRequiredPermissions = state.permissionState === 'authorized'
  
  return {
    authState: state.authState,
    permissionState: state.permissionState,
    userClaims: state.userClaims,
    currentRole,
    hasRequiredPermissions,
    isVerified,
    hasMFA,
    lastError: state.lastError,
    denialReason: state.denialReason,
    recheckPermissions,
    clearAuthState
  }
}