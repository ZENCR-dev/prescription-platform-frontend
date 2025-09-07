/**
 * loadingStrategies - M1.2 Dev-Step 4.3 Loading Strategy Utilities
 * 
 * @implements 架构师设计规范 DEV-STEP-4.3-DESIGN-SPECIFICATION.md
 * @coordinates 与existing getUserClaims('auth')缓存系统协同
 * @supports useSessionLoading 和 useAuthState hooks
 * 
 * Architecture:
 * - Utility Functions Only: 无React依赖，可被client/server组件调用
 * - Cache Coordination: 与getUserClaims('auth') 30s TTL协同
 * - Performance Tracking: 提供度量工具用于测试证据生成
 * - Type Source: UserRole/UserClaims统一从@/lib/supabase/client导入
 * - Diagnostics: 仅开发环境启用，生产构建去除
 */

import { type UserRole, type UserClaims } from '@/lib/supabase/client'

// 性能度量配置
export interface LoadingPerformanceConfig {
  trackLoadTimes: boolean
  trackCacheHits: boolean 
  trackStateTransitions: boolean
  maxHistorySize: number
}

// 加载策略配置
export interface LoadingStrategyConfig {
  cacheTimeout: number // 与getUserClaims TTL一致
  retryAttempts: number
  retryDelays: number[] // 指数退避延迟
  performanceTracking: LoadingPerformanceConfig
  debugMode: boolean
}

// 性能度量数据
export interface LoadingPerformanceMetrics {
  averageLoadTime: number
  cacheHitRate: number
  totalRequests: number
  errorRate: number
  stateTransitions: number
}

// 加载状态分类
export type LoadingStateType = 'initial' | 'checking' | 'refreshing' | 'error' | 'complete'

// 缓存策略枚举
export enum CacheStrategy {
  AGGRESSIVE = 'aggressive', // 最大化缓存使用
  BALANCED = 'balanced',     // 平衡缓存与实时性
  FRESH = 'fresh'           // 优先获取最新数据
}

/**
 * 默认加载策略配置
 */
export const DEFAULT_LOADING_STRATEGY: LoadingStrategyConfig = {
  cacheTimeout: 30000, // 与getUserClaims('auth') TTL一致
  retryAttempts: 3,
  retryDelays: [1000, 2000, 4000], // 指数退避
  performanceTracking: {
    trackLoadTimes: true,
    trackCacheHits: true,
    trackStateTransitions: process.env.NODE_ENV === 'development',
    maxHistorySize: 100
  },
  debugMode: process.env.NODE_ENV === 'development'
}

/**
 * LoadingPerformanceTracker - 性能度量跟踪器
 */
export class LoadingPerformanceTracker {
  private loadTimes: number[] = []
  private cacheHits = 0
  private cacheMisses = 0
  private stateTransitionCount = 0
  private errorCount = 0
  private startTime: number | null = null
  
  constructor(private config: LoadingPerformanceConfig) {}
  
  // 开始计时
  startTiming(): void {
    this.startTime = performance.now()
  }
  
  // 结束计时并记录
  endTiming(cacheHit: boolean = false, error: boolean = false): number {
    if (!this.startTime) return 0
    
    const duration = performance.now() - this.startTime
    this.startTime = null
    
    if (this.config.trackLoadTimes) {
      this.loadTimes.push(duration)
      
      // 限制历史记录大小
      if (this.loadTimes.length > this.config.maxHistorySize) {
        this.loadTimes = this.loadTimes.slice(-this.config.maxHistorySize / 2)
      }
    }
    
    if (this.config.trackCacheHits) {
      if (cacheHit) {
        this.cacheHits++
      } else {
        this.cacheMisses++
      }
    }
    
    if (error) {
      this.errorCount++
    }
    
    return duration
  }
  
  // 记录状态转换
  recordStateTransition(): void {
    if (this.config.trackStateTransitions) {
      this.stateTransitionCount++
    }
  }
  
  // 获取性能指标
  getMetrics(): LoadingPerformanceMetrics {
    const totalRequests = this.cacheHits + this.cacheMisses
    const averageLoadTime = this.loadTimes.length > 0 
      ? this.loadTimes.reduce((a, b) => a + b, 0) / this.loadTimes.length 
      : 0
    
    return {
      averageLoadTime,
      cacheHitRate: totalRequests > 0 ? this.cacheHits / totalRequests : 0,
      totalRequests,
      errorRate: totalRequests > 0 ? this.errorCount / totalRequests : 0,
      stateTransitions: this.stateTransitionCount
    }
  }
  
  // 重置统计
  reset(): void {
    this.loadTimes = []
    this.cacheHits = 0
    this.cacheMisses = 0
    this.stateTransitionCount = 0
    this.errorCount = 0
    this.startTime = null
  }
}

/**
 * 权限验证工具函数
 * (与useAuthState中的验证逻辑保持一致)
 */
export function validateUserPermissions(
  claims: UserClaims | null,
  options: {
    requiredRole?: UserRole | UserRole[]
    requireVerified?: boolean
    requireMFA?: boolean
  }
): {
  hasPermissions: boolean
  denialReason: string | null
} {
  if (!claims) {
    return {
      hasPermissions: false,
      denialReason: 'NOT_AUTHENTICATED'
    }
  }
  
  // MFA检查 (优先级2)
  if (options.requireMFA && claims.aal !== 'aal2') {
    return {
      hasPermissions: false,
      denialReason: 'MFA_REQUIRED'
    }
  }
  
  // 验证检查 (优先级3)
  if (options.requireVerified && claims.verification_status !== 'verified') {
    return {
      hasPermissions: false,
      denialReason: 'NOT_VERIFIED'
    }
  }
  
  // 角色检查 (优先级4)
  if (options.requiredRole) {
    const requiredRoles = Array.isArray(options.requiredRole) 
      ? options.requiredRole 
      : [options.requiredRole]
    
    if (!requiredRoles.includes(claims.role)) {
      return {
        hasPermissions: false,
        denialReason: 'ROLE_MISMATCH'
      }
    }
  }
  
  return {
    hasPermissions: true,
    denialReason: null
  }
}

/**
 * 缓存策略选择器
 */
export function selectCacheStrategy(
  userRole: UserRole | null,
  requireRealTime: boolean = false
): CacheStrategy {
  // 管理员和TCM医生需要实时数据
  if (userRole === 'admin' || userRole === 'tcm_practitioner') {
    return requireRealTime ? CacheStrategy.FRESH : CacheStrategy.BALANCED
  }
  
  // 药房可以使用更激进的缓存
  if (userRole === 'pharmacy') {
    return CacheStrategy.AGGRESSIVE
  }
  
  // 默认平衡策略
  return CacheStrategy.BALANCED
}

/**
 * 重试策略计算器
 */
export function calculateRetryDelay(
  attempt: number, 
  baseDelay: number = 1000,
  maxDelay: number = 8000
): number {
  // 指数退避 + 随机抖动
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)
  const jitter = Math.random() * 0.3 // 30% 随机抖动
  
  return exponentialDelay * (1 + jitter)
}

/**
 * 加载状态决策器
 */
export function determineLoadingState(
  isAuthenticated: boolean,
  isLoading: boolean,
  hasError: boolean,
  cacheAge: number,
  cacheTimeout: number
): LoadingStateType {
  if (hasError) return 'error'
  if (!isAuthenticated) return 'complete'
  if (isLoading) {
    return cacheAge > cacheTimeout ? 'refreshing' : 'checking'
  }
  return 'complete'
}

/**
 * 开发环境诊断工具
 */
export const developmentDiagnostics = {
  logLoadingState(state: LoadingStateType, duration?: number, cacheHit?: boolean) {
    if (process.env.NODE_ENV !== 'development') return
    
    const timestamp = new Date().toISOString()
    const extra = []
    
    if (duration !== undefined) {
      extra.push(`duration: ${duration.toFixed(2)}ms`)
    }
    
    if (cacheHit !== undefined) {
      extra.push(`cache: ${cacheHit ? 'HIT' : 'MISS'}`)
    }
    
    console.log(
      `[LoadingStrategies] ${timestamp} - State: ${state}${extra.length ? ' | ' + extra.join(', ') : ''}`
    )
  },
  
  logPerformanceMetrics(metrics: LoadingPerformanceMetrics) {
    if (process.env.NODE_ENV !== 'development') return
    
    console.table({
      'Average Load Time': `${metrics.averageLoadTime.toFixed(2)}ms`,
      'Cache Hit Rate': `${(metrics.cacheHitRate * 100).toFixed(1)}%`,
      'Total Requests': metrics.totalRequests,
      'Error Rate': `${(metrics.errorRate * 100).toFixed(1)}%`,
      'State Transitions': metrics.stateTransitions
    })
  },
  
  logCacheStrategy(strategy: CacheStrategy, reason: string) {
    if (process.env.NODE_ENV !== 'development') return
    
    console.log(`[LoadingStrategies] Cache Strategy: ${strategy} | Reason: ${reason}`)
  }
}

/**
 * 生产环境优化的度量收集器
 */
export function createOptimizedTracker(enabled: boolean = true): LoadingPerformanceTracker | null {
  if (!enabled || process.env.NODE_ENV === 'production') {
    // 生产环境返回null，避免不必要的性能开销
    return null
  }
  
  return new LoadingPerformanceTracker(DEFAULT_LOADING_STRATEGY.performanceTracking)
}

/**
 * 测试辅助工具 - 仅开发环境
 */
export const testingUtils = process.env.NODE_ENV === 'development' ? {
  // 模拟慢加载
  async simulateSlowLoading(duration: number = 2000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration))
  },
  
  // 模拟缓存命中/未命中
  mockCacheResponse(hit: boolean, data?: UserClaims | null): Promise<UserClaims | null> {
    const delay = hit ? 10 : 500 // 缓存命中快速响应
    
    return new Promise(resolve => {
      setTimeout(() => resolve(data || null), delay)
    })
  },
  
  // 生成测试性能数据
  generateTestMetrics(): LoadingPerformanceMetrics {
    return {
      averageLoadTime: Math.random() * 100 + 50, // 50-150ms
      cacheHitRate: Math.random() * 0.3 + 0.7,   // 70-100%
      totalRequests: Math.floor(Math.random() * 50) + 10, // 10-60 requests
      errorRate: Math.random() * 0.05,           // 0-5% error rate
      stateTransitions: Math.floor(Math.random() * 20) + 5 // 5-25 transitions
    }
  }
} : undefined

// 类型导出
// 类型已在本文件内声明，避免重复导出造成冲突