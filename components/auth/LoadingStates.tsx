'use client'

/**
 * LoadingStates - M1.2 Dev-Step 4.3 Loading State Components
 * 
 * @implements 架构师设计规范 DEV-STEP-4.3-DESIGN-SPECIFICATION.md
 * @coordinates 与existing AuthProvider协同，不修改contexts/AuthProvider.tsx
 * @integrates 与existing getUserClaims('auth')缓存系统协同
 * 
 * Architecture:
 * - Client Component Only: 'use client'指令，架构师要求
 * - Security First: checking期间绝不渲染敏感内容
 * - Cache Coordination: 与getUserClaims('auth') 30s TTL协同
 * - Type Source: UserRole统一从@/lib/supabase/client导入
 * - Diagnostics: 仅开发环境启用，生产构建去除
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

// 开发环境诊断工具 - 生产构建时完全去除
const developmentDiagnostics = (enabled: boolean) => {
  if (process.env.NODE_ENV !== 'development' || !enabled) return null
  
  return {
    loadingStateTransitions: true,
    performanceMetrics: true,
    renderTiming: true
  }
}

// AuthLoadingSkeleton - 认证检查期间的骨架屏
export interface AuthLoadingSkeletonProps {
  variant: 'compact' | 'full' | 'minimal'
  showProgressIndicator?: boolean
  debugMode?: boolean
}

export function AuthLoadingSkeleton({
  variant = 'compact',
  showProgressIndicator = false,
  debugMode = false
}: AuthLoadingSkeletonProps) {
  const diagnostics = developmentDiagnostics(debugMode)
  const startTime = React.useRef<number>()
  
  useEffect(() => {
    if (diagnostics?.renderTiming) {
      startTime.current = performance.now()
    }
    
    return () => {
      if (diagnostics?.renderTiming && startTime.current) {
        const duration = performance.now() - startTime.current
        console.log('[AuthLoadingSkeleton] 渲染时长:', `${duration.toFixed(2)}ms`)
      }
    }
  }, [diagnostics])
  
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-2" data-testid="auth-loading-minimal" role="status" aria-label="正在验证权限">
        <div className="animate-pulse w-4 h-4 bg-gray-300 rounded-full" data-testid="minimal-spinner"></div>
        {diagnostics?.loadingStateTransitions && (
          <span className="ml-2 text-xs text-gray-500">正在验证权限...</span>
        )}
      </div>
    )
  }
  
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center p-4" data-testid="auth-loading-compact" role="progressbar" aria-label="检查权限中">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" data-testid="compact-spinner"></div>
        {showProgressIndicator && (
          <div className="ml-3 flex flex-col">
            <div className="h-2 bg-gray-200 rounded-full w-24" data-testid="progress-bar">
              <div className="h-2 bg-blue-600 rounded-full w-1/2 animate-pulse"></div>
            </div>
            {diagnostics?.loadingStateTransitions && (
              <span className="mt-1 text-xs text-gray-600">检查权限中...</span>
            )}
          </div>
        )}
      </div>
    )
  }
  
  // variant === 'full'
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4" data-testid="auth-loading-full" role="progressbar" aria-label="正在验证用户权限">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" data-testid="full-spinner"></div>
      <div className="space-y-2 w-full max-w-sm" data-testid="skeleton-content">
        <div className="h-4 bg-gray-300 rounded animate-pulse" data-testid="skeleton-bar-1"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4" data-testid="skeleton-bar-2"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2" data-testid="skeleton-bar-3"></div>
      </div>
      {diagnostics?.loadingStateTransitions && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-700" data-testid="debug-info">
          <div>状态: 正在验证用户权限</div>
          <div>渲染模式: {variant}</div>
          <div>进度指示器: {showProgressIndicator ? '启用' : '禁用'}</div>
        </div>
      )}
    </div>
  )
}

// SessionCheckingSpinner - 会话验证期间的加载指示器
export interface SessionCheckingSpinnerProps {
  size: 'sm' | 'md' | 'lg'
  message?: string
  timeout?: number
  onTimeout?: () => void
  debugMode?: boolean
}

export function SessionCheckingSpinner({
  size = 'md',
  message,
  timeout = 5000,
  onTimeout,
  debugMode = false
}: SessionCheckingSpinnerProps) {
  const diagnostics = developmentDiagnostics(debugMode)
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  
  useEffect(() => {
    const startTime = Date.now()
    
    const timeoutTimer = setTimeout(() => {
      setHasTimedOut(true)
      onTimeout?.()
    }, timeout)
    
    const progressTimer = setInterval(() => {
      setElapsedTime(Date.now() - startTime)
    }, 100)
    
    return () => {
      clearTimeout(timeoutTimer)
      clearInterval(progressTimer)
    }
  }, [timeout, onTimeout])
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }
  
  const borderClasses = {
    sm: 'border-b border-blue-600',
    md: 'border-b-2 border-blue-600',
    lg: 'border-b-4 border-blue-600'
  }
  
  if (hasTimedOut) {
    return (
      <div className="flex items-center justify-center p-4 text-amber-600" data-testid="session-timeout" role="alert" aria-label="会话验证超时">
        <svg className={`${sizeClasses[size]} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm">会话验证超时</span>
        {diagnostics?.performanceMetrics && (
          <span className="ml-2 text-xs text-gray-500">({elapsedTime}ms)</span>
        )}
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center p-4" data-testid="session-spinner" role="status" aria-label={message || "会话验证中"}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} ${borderClasses[size]}`} data-testid={`session-spinner-${size}`}></div>
      {message && (
        <span className="ml-3 text-sm text-gray-600">{message}</span>
      )}
      {diagnostics?.performanceMetrics && (
        <div className="ml-3 text-xs text-gray-500" data-testid="session-metrics">
          <div>已用时: {elapsedTime}ms</div>
          <div>超时设置: {timeout}ms</div>
          <div>进度: {Math.min(100, (elapsedTime / timeout) * 100).toFixed(1)}%</div>
        </div>
      )}
    </div>
  )
}

// LoadingState上下文定义
export interface LoadingStateContextValue {
  isCheckingAuth: boolean
  isLoadingClaims: boolean
  checkingDuration: number
  lastCacheHit: boolean
  
  // 控制方法
  setCheckingAuth: (checking: boolean) => void
  setLoadingClaims: (loading: boolean) => void
  recordCacheHit: (hit: boolean) => void
}

const LoadingStateContext = createContext<LoadingStateContextValue | null>(null)

// LoadingStateProvider - 加载状态上下文提供者
export function LoadingStateProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [isCheckingAuth, setCheckingAuth] = useState(false)
  const [isLoadingClaims, setLoadingClaims] = useState(false)
  const [checkingDuration, setCheckingDuration] = useState(0)
  const [lastCacheHit, setLastCacheHit] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  
  const handleSetCheckingAuth = useCallback((checking: boolean) => {
    if (checking) {
      startTimeRef.current = performance.now()
      setCheckingAuth(true)
    } else {
      if (startTimeRef.current) {
        const duration = performance.now() - startTimeRef.current
        setCheckingDuration(duration)
        startTimeRef.current = null
      }
      setCheckingAuth(false)
    }
  }, [])
  
  const recordCacheHit = useCallback((hit: boolean) => {
    setLastCacheHit(hit)
    
    // 开发环境诊断
    if (process.env.NODE_ENV === 'development') {
      console.log('[LoadingStateProvider] 缓存命中:', hit ? 'HIT' : 'MISS')
    }
  }, [])
  
  const value = {
    isCheckingAuth,
    isLoadingClaims,
    checkingDuration,
    lastCacheHit,
    setCheckingAuth: handleSetCheckingAuth,
    setLoadingClaims,
    recordCacheHit
  }
  
  return (
    <LoadingStateContext.Provider value={value}>
      {children}
    </LoadingStateContext.Provider>
  )
}

// useLoadingState hook
export function useLoadingState(): LoadingStateContextValue {
  const context = useContext(LoadingStateContext)
  
  if (!context) {
    throw new Error('useLoadingState must be used within a LoadingStateProvider')
  }
  
  return context
}

// 导出所有类型定义
// 已在本文件内直接导出类型定义，无需重复导出