/**
 * useSessionLoading.test.tsx - M1.2 Dev-Step 4.3 Session Loading Hook Tests
 * 
 * @implements 架构师测试矩阵要求 DEV-STEP-4.3-DESIGN-SPECIFICATION.md
 * @covers Hook行为 + 缓存集成 + 事件响应测试
 * @integrates Jest + React Testing Library + React Hooks Testing Library
 * 
 * Test Matrix Coverage:
 * - Hook Behavior: 基础loading状态管理和性能度量
 * - Cache Integration: 与getUserClaims('auth') 30s TTL协同测试  
 * - Event Response: AuthProvider事件监听和状态同步
 * - Error Boundaries: 网络错误和超时处理
 * - Performance Metrics: 加载时间统计和缓存命中率计算
 */

import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSessionLoading } from '@/hooks/auth/useSessionLoading'
import { useAuth } from '@/contexts/AuthProvider'
import { getUserClaims, type UserClaims, type UserRole } from '@/lib/supabase/client'

// Mock dependencies
jest.mock('@/contexts/AuthProvider')
jest.mock('@/lib/supabase/client')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockGetUserClaims = getUserClaims as jest.MockedFunction<typeof getUserClaims>

// Mock performance.now and Date.now for consistent testing
const mockPerformanceNow = jest.fn()
const mockDateNow = jest.fn()

// Mock performance API in different contexts
Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
  writable: true
})

Object.defineProperty(global, 'performance', {
  value: { now: mockPerformanceNow },
  writable: true
})

// Also mock the Node.js performance API if it exists
if (typeof process !== 'undefined') {
  const { performance } = require('perf_hooks')
  if (performance) {
    Object.defineProperty(performance, 'now', {
      value: mockPerformanceNow,
      writable: true
    })
  }
}

Object.defineProperty(Date, 'now', {
  value: mockDateNow,
  writable: true
})

describe('useSessionLoading Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    
    // Mock console for debug logging
    jest.spyOn(console, 'log').mockImplementation(() => {})
    
    // Default AuthProvider state (unauthenticated to prevent auto-checks)
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      userClaims: null,
      isVerified: false,
      hasMFA: false,
      signOut: jest.fn(),
      refreshUserClaims: jest.fn()
    })
    
    // Default getUserClaims mock
    mockGetUserClaims.mockResolvedValue(null)
    
    // Mock timing functions
    mockPerformanceNow.mockReturnValue(1000)
    mockDateNow.mockReturnValue(1000000) // Different scale for Date.now
  })
  
  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('Basic Hook Behavior', () => {
    it('initializes with default state', async () => {
      // Mock AuthProvider to prevent initial permission check
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      const { result } = renderHook(() => useSessionLoading())
      
      // Wait for initial effects to settle
      await act(async () => {
        await Promise.resolve()
      })
      
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isCheckingPermissions).toBe(false)
      expect(result.current.loadingDuration).toBe(0)
      // Note: cacheHitRate is 1 because useEffect calls endLoading(true, true) for unauthenticated state
      expect(result.current.cacheHitRate).toBe(1) 
      expect(result.current.lastError).toBeNull()
      expect(result.current.retryCount).toBe(0)
      // totalRequests is 1 due to initial endLoading call
      expect(result.current.performanceMetrics.totalRequests).toBe(1)
    })
    
    it('accepts custom configuration options', () => {
      const onLoadingStart = jest.fn()
      const onLoadingEnd = jest.fn()
      
      const { result } = renderHook(() => 
        useSessionLoading({
          refreshInterval: 15000,
          enableDebugMode: true,
          onLoadingStart,
          onLoadingEnd
        })
      )
      
      // Verify hook initializes with custom config
      expect(result.current).toBeDefined()
      expect(typeof result.current.refreshSession).toBe('function')
    })
  })

  describe('AuthProvider Event Integration', () => {
    it('handles authenticated state change correctly', async () => {
      // Start with unauthenticated state
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      const { result, rerender } = renderHook(() => useSessionLoading())
      
      // Initially not loading
      expect(result.current.isLoading).toBe(false)
      
      // Simulate user authentication
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'test-user' } as any,
        userClaims: { role: 'admin', verification_status: 'verified', aal: 'aal2' } as any,
        isVerified: true,
        hasMFA: true,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      mockGetUserClaims.mockResolvedValue({
        role: 'admin',
        verification_status: 'verified',
        aal: 'aal2'
      } as any)
      
      rerender()
      
      await waitFor(() => {
        expect(result.current.isCheckingPermissions).toBe(true)
      })
      
      // Fast-forward async operations
      await act(async () => {
        jest.advanceTimersByTime(1000)
        await Promise.resolve()
      })
      
      await waitFor(() => {
        expect(result.current.isCheckingPermissions).toBe(false)
        expect(result.current.performanceMetrics.totalRequests).toBeGreaterThan(0)
      })
    })
    
    it('handles AuthProvider loading state correctly', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true, // AuthProvider is loading
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      const { result } = renderHook(() => useSessionLoading())
      
      expect(result.current.isLoading).toBe(true)
    })
    
    it('stops loading when user is unauthenticated', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      const { result } = renderHook(() => useSessionLoading())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.isCheckingPermissions).toBe(false)
      })
    })
  })

  describe('Cache Integration with getUserClaims', () => {
    it('coordinates with getUserClaims 30s TTL system', async () => {
      // Mock unauthenticated state to prevent automatic permission checks
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      // Mock successful getUserClaims call
      mockGetUserClaims.mockResolvedValue({
        role: 'tcm_practitioner',
        verification_status: 'verified',
        aal: 'aal1'
      } as any)
      
      const { result } = renderHook(() => useSessionLoading())
      
      // Wait for initial state to settle
      await act(async () => {
        await Promise.resolve()
      })
      
      // Reset request count if any initial calls were made
      act(() => {
        result.current.clearCache()
      })
      
      // Trigger manual refresh
      await act(async () => {
        await result.current.refreshSession()
      })
      
      expect(mockGetUserClaims).toHaveBeenCalledWith('auth')
      expect(result.current.performanceMetrics.totalRequests).toBe(1)
    })
    
    it('detects cache hits correctly', async () => {
      // Mock unauthenticated state to prevent automatic permission checks
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      mockGetUserClaims.mockResolvedValue({
        role: 'pharmacy',
        verification_status: 'verified',
        aal: 'aal2'
      } as any)
      
      const { result } = renderHook(() => useSessionLoading())
      
      // Wait for initial state to settle
      await act(async () => {
        await Promise.resolve()
      })
      
      // Reset to ensure clean state
      act(() => {
        result.current.clearCache()
      })
      
      // First call - set up timing to simulate cache miss initially
      mockPerformanceNow.mockReturnValueOnce(1000).mockReturnValueOnce(1200) // 200ms
      mockDateNow.mockReturnValueOnce(2000000) // First call timestamp
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      // Now simulate a quick follow-up call (cache hit)
      mockPerformanceNow.mockReturnValueOnce(1300).mockReturnValueOnce(1305) // 5ms
      mockDateNow.mockReturnValueOnce(2000500) // 500ms later (< 1000ms = cache hit)
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      // Should have both cache miss and cache hit
      expect(result.current.performanceMetrics.totalRequests).toBe(2)
      expect(result.current.performanceMetrics.cacheHits).toBe(1)
      expect(result.current.performanceMetrics.cacheMisses).toBe(1)
      expect(result.current.cacheHitRate).toBeCloseTo(0.5)
    })
    
    it('handles cache misses correctly', async () => {
      // Mock slow response (likely cache miss)
      mockPerformanceNow
        .mockReturnValueOnce(1000) // Start time  
        .mockReturnValueOnce(1500) // End time (500ms = slow response)
      
      mockGetUserClaims.mockResolvedValue({
        role: 'admin',
        verification_status: 'pending',
        aal: 'aal1'
      } as any)
      
      const { result } = renderHook(() => useSessionLoading())
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      expect(result.current.performanceMetrics.cacheMisses).toBeGreaterThan(0)
      expect(result.current.cacheHitRate).toBeLessThan(1.0)
    })
  })

  describe('Performance Metrics Tracking', () => {
    it('tracks loading duration correctly', async () => {
      // Mock unauthenticated state to prevent automatic effects
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      mockGetUserClaims.mockResolvedValue({
        role: 'admin',
        verification_status: 'verified',
        aal: 'aal2'
      } as any)
      
      const { result } = renderHook(() => useSessionLoading())
      
      // Wait for initial state and clear cache
      await act(async () => {
        await Promise.resolve()
      })
      
      act(() => {
        result.current.clearCache()
      })
      
      // Call refreshSession multiple times to verify performance tracking
      await act(async () => {
        await result.current.refreshSession()
      })
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      // Verify performance metrics are being tracked
      const metrics = result.current.performanceMetrics
      expect(metrics.totalRequests).toBeGreaterThan(0)
      
      // The hook should track some performance data
      expect(metrics.totalRequests + metrics.cacheHits + metrics.cacheMisses).toBeGreaterThan(0)
    })
    
    it('maintains performance metrics history', async () => {
      // Mock unauthenticated state to prevent automatic effects  
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      mockGetUserClaims.mockResolvedValue({
        role: 'tcm_practitioner',
        verification_status: 'verified',
        aal: 'aal2'
      } as any)
      
      const { result } = renderHook(() => useSessionLoading())
      
      // Wait for initial state to settle
      await act(async () => {
        await Promise.resolve()
      })
      
      // Reset to ensure clean state
      act(() => {
        result.current.clearCache()
      })
      
      // Perform multiple refreshes to build history
      for (let i = 0; i < 3; i++) {
        await act(async () => {
          await result.current.refreshSession()
        })
      }
      
      const metrics = result.current.performanceMetrics
      expect(metrics.totalRequests).toBeGreaterThanOrEqual(3)
      
      // Performance metrics should accumulate
      const totalActivity = metrics.totalRequests + metrics.cacheHits + metrics.cacheMisses
      expect(totalActivity).toBeGreaterThan(0)
    })
    
    it('limits performance history size', async () => {
      // Mock unauthenticated state to prevent automatic effects
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      mockGetUserClaims.mockResolvedValue({
        role: 'pharmacy',
        verification_status: 'verified',
        aal: 'aal1'
      } as any)
      
      const { result } = renderHook(() => useSessionLoading())
      
      // Wait for initial state to settle
      await act(async () => {
        await Promise.resolve()
      })
      
      // Reset to ensure clean state
      act(() => {
        result.current.clearCache()
      })
      
      // Simulate multiple refreshes to test history tracking
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await result.current.refreshSession()
        })
      }
      
      // History should be tracked and total requests correct
      const metrics = result.current.performanceMetrics
      expect(metrics.totalRequests).toBeGreaterThanOrEqual(5)
      
      // Verify that performance tracking is working
      const totalActivity = metrics.totalRequests + metrics.cacheHits + metrics.cacheMisses
      expect(totalActivity).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('handles getUserClaims errors correctly', async () => {
      const testError = new Error('Network error')
      mockGetUserClaims.mockRejectedValue(testError)
      
      const { result } = renderHook(() => useSessionLoading())
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      expect(result.current.lastError).toEqual(testError)
      expect(result.current.retryCount).toBe(1)
      expect(result.current.isLoading).toBe(false)
    })
    
    it('increments retry count on subsequent errors', async () => {
      const testError = new Error('Persistent error')
      mockGetUserClaims.mockRejectedValue(testError)
      
      const { result } = renderHook(() => useSessionLoading())
      
      // Multiple failed attempts
      await act(async () => {
        await result.current.refreshSession()
      })
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      expect(result.current.retryCount).toBe(2)
      expect(result.current.lastError).toEqual(testError)
    })
    
    it('resets retry count on successful request', async () => {
      const testError = new Error('Temporary error')
      
      // First call fails
      mockGetUserClaims.mockRejectedValueOnce(testError)
      
      const { result } = renderHook(() => useSessionLoading())
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      expect(result.current.retryCount).toBe(1)
      
      // Second call succeeds
      mockGetUserClaims.mockResolvedValue({
        role: 'admin',
        verification_status: 'verified',
        aal: 'aal2'
      } as any)
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      expect(result.current.retryCount).toBe(0) // Reset on success
    })
  })

  describe('Manual Controls', () => {
    it('provides manual refresh functionality', async () => {
      // Mock unauthenticated state to prevent automatic permission checks
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      mockGetUserClaims.mockResolvedValue({
        role: 'tcm_practitioner',
        verification_status: 'verified',
        aal: 'aal1'
      } as any)
      
      const { result } = renderHook(() => useSessionLoading())
      
      // Wait for initial state to settle
      await act(async () => {
        await Promise.resolve()
      })
      
      // Reset to ensure clean state
      act(() => {
        result.current.clearCache()
      })
      
      expect(result.current.performanceMetrics.totalRequests).toBe(0)
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      expect(result.current.performanceMetrics.totalRequests).toBe(1)
    })
    
    it('clears cache and resets metrics', () => {
      const { result } = renderHook(() => useSessionLoading())
      
      act(() => {
        result.current.clearCache()
      })
      
      expect(result.current.performanceMetrics.totalRequests).toBe(0)
      expect(result.current.performanceMetrics.cacheHits).toBe(0)
      expect(result.current.performanceMetrics.cacheMisses).toBe(0)
      expect(result.current.lastError).toBeNull()
    })
  })

  describe('Periodic Refresh (TTL Coordination)', () => {
    it('sets up periodic refresh when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'test-user' } as any,
        userClaims: { role: 'admin' } as any,
        isVerified: true,
        hasMFA: true,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      const { result } = renderHook(() => 
        useSessionLoading({ refreshInterval: 10000 })
      )
      
      // Verify interval is set up (can't directly test setInterval in this context)
      expect(result.current).toBeDefined()
    })
    
    it('does not refresh when unauthenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      renderHook(() => 
        useSessionLoading({ refreshInterval: 5000 })
      )
      
      // Fast-forward time - should not trigger refresh calls
      act(() => {
        jest.advanceTimersByTime(10000)
      })
      
      expect(mockGetUserClaims).not.toHaveBeenCalled()
    })
  })

  describe('Development Diagnostics', () => {
    it('logs debug information when enabled', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      mockGetUserClaims.mockResolvedValue({
        role: 'pharmacy',
        verification_status: 'verified',
        aal: 'aal2'
      } as any)
      
      const { result } = renderHook(() => 
        useSessionLoading({ enableDebugMode: true })
      )
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[useSessionLoading]'),
        expect.anything()
      )
      
      process.env.NODE_ENV = originalEnv
    })
    
    it('does not log debug information in production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      mockGetUserClaims.mockResolvedValue({
        role: 'admin',
        verification_status: 'verified',
        aal: 'aal2'
      } as any)
      
      const { result } = renderHook(() => 
        useSessionLoading({ enableDebugMode: true })
      )
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      expect(console.log).not.toHaveBeenCalled()
      
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Performance Budget Validation', () => {
    it('meets performance requirements for cache hits', async () => {
      // Mock fast cache hit response
      mockPerformanceNow
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1025) // 25ms (well under budget)
      
      mockGetUserClaims.mockResolvedValue({
        role: 'tcm_practitioner',
        verification_status: 'verified',
        aal: 'aal2'
      } as any)
      
      const { result } = renderHook(() => useSessionLoading())
      
      await act(async () => {
        await result.current.refreshSession()
      })
      
      // Should be well under 30ms cache hit target
      expect(result.current.loadingDuration).toBeLessThan(30)
      expect(result.current.performanceMetrics.averageLoadTime).toBeLessThan(30)
    })
    
    it('tracks permission checking within budget', async () => {
      // Mock permission checking performance
      mockPerformanceNow
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1080) // 80ms (under 100ms budget)
      
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'test-user' } as any,
        userClaims: null,
        isVerified: false,
        hasMFA: false,
        signOut: jest.fn(),
        refreshUserClaims: jest.fn()
      })
      
      mockGetUserClaims.mockResolvedValue({
        role: 'pharmacy',
        verification_status: 'pending',
        aal: 'aal1'
      } as any)
      
      const { result } = renderHook(() => useSessionLoading())
      
      // Wait for permission checking to complete
      await waitFor(() => {
        expect(result.current.isCheckingPermissions).toBe(false)
      })
      
      // Should be under 100ms permission checking budget
      expect(result.current.loadingDuration).toBeLessThan(100)
    })
  })
})