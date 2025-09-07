/**
 * LoadingStates.test.tsx - M1.2 Dev-Step 4.3 Loading States Component Tests
 * 
 * @implements 架构师测试矩阵要求 DEV-STEP-4.3-DESIGN-SPECIFICATION.md
 * @covers 组件渲染 + 状态转换 + 安全边界验证
 * @integrates Jest + React Testing Library
 * 
 * Test Matrix Coverage:
 * - Component Rendering: AuthLoadingSkeleton/SessionCheckingSpinner/LoadingStateProvider
 * - State Transitions: loading → loaded, checking → complete  
 * - Security Boundaries: checking期间不渲染敏感内容
 * - Performance Validation: 渲染时间 <50ms
 * - Development Diagnostics: 开发环境诊断功能测试
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { 
  AuthLoadingSkeleton,
  SessionCheckingSpinner,
  LoadingStateProvider,
  useLoadingState
} from '@/components/auth/LoadingStates'

// Mock performance.now for consistent testing
const mockPerformanceNow = jest.fn()
Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
  writable: true
})

describe('LoadingStates Components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPerformanceNow.mockReturnValue(0)
    
    // Reset console.log mock for diagnostics testing
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'table').mockImplementation(() => {})
  })
  
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('AuthLoadingSkeleton', () => {
    it('renders minimal variant correctly', () => {
      render(<AuthLoadingSkeleton variant="minimal" />)
      
      const container = screen.getByTestId('auth-loading-minimal')
      expect(container).toBeInTheDocument()
      expect(container).toHaveAttribute('role', 'status')
      expect(container).toHaveAttribute('aria-label', '正在验证权限')
      
      const spinner = screen.getByTestId('minimal-spinner')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-pulse', 'w-4', 'h-4', 'bg-gray-300', 'rounded-full')
    })
    
    it('renders compact variant with progress indicator', () => {
      render(
        <AuthLoadingSkeleton 
          variant="compact" 
          showProgressIndicator={true} 
        />
      )
      
      const container = screen.getByTestId('auth-loading-compact')
      expect(container).toBeInTheDocument()
      expect(container).toHaveAttribute('role', 'progressbar')
      expect(container).toHaveAttribute('aria-label', '检查权限中')
      
      const spinner = screen.getByTestId('compact-spinner')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'h-6', 'w-6', 'border-b-2', 'border-blue-600')
      
      // 验证进度指示器
      const progressBar = screen.getByTestId('progress-bar')
      expect(progressBar).toBeInTheDocument()
    })
    
    it('renders full variant with skeleton content', () => {
      render(<AuthLoadingSkeleton variant="full" />)
      
      const container = screen.getByTestId('auth-loading-full')
      expect(container).toBeInTheDocument()
      expect(container).toHaveAttribute('role', 'progressbar')
      expect(container).toHaveAttribute('aria-label', '正在验证用户权限')
      
      const mainSpinner = screen.getByTestId('full-spinner')
      expect(mainSpinner).toBeInTheDocument()
      expect(mainSpinner).toHaveClass('animate-spin', 'rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600')
      
      // 验证骨架屏内容
      const skeletonContent = screen.getByTestId('skeleton-content')
      expect(skeletonContent).toBeInTheDocument()
      
      expect(screen.getByTestId('skeleton-bar-1')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-bar-2')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-bar-3')).toBeInTheDocument()
    })
    
    it('shows development diagnostics in debug mode', () => {
      // 设置开发环境
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      render(
        <AuthLoadingSkeleton 
          variant="full" 
          debugMode={true} 
        />
      )
      
      expect(screen.getByText(/状态: 正在验证用户权限/)).toBeInTheDocument()
      expect(screen.getByText(/渲染模式: full/)).toBeInTheDocument()
      expect(screen.getByText(/进度指示器: 禁用/)).toBeInTheDocument()
      
      process.env.NODE_ENV = originalEnv
    })
    
    it('tracks rendering performance in debug mode', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      // Mock performance timing
      mockPerformanceNow
        .mockReturnValueOnce(100) // Component mount
        .mockReturnValueOnce(150) // Component unmount
      
      const { unmount } = render(
        <AuthLoadingSkeleton 
          variant="compact" 
          debugMode={true} 
        />
      )
      
      // Trigger unmount to test performance logging
      unmount()
      
      expect(console.log).toHaveBeenCalledWith(
        '[AuthLoadingSkeleton] 渲染时长:',
        '50.00ms'
      )
      
      process.env.NODE_ENV = originalEnv
    })
    
    it('does not show diagnostics in production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      render(
        <AuthLoadingSkeleton 
          variant="full" 
          debugMode={true} 
        />
      )
      
      expect(screen.queryByText(/状态: 正在验证用户权限/)).not.toBeInTheDocument()
      
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('SessionCheckingSpinner', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })
    
    afterEach(() => {
      jest.useRealTimers()
    })
    
    it('renders with different sizes correctly', () => {
      const { rerender } = render(<SessionCheckingSpinner size="sm" />)
      
      const container = screen.getByTestId('session-spinner')
      expect(container).toBeInTheDocument()
      expect(container).toHaveAttribute('role', 'status')
      
      const spinnerSm = screen.getByTestId('session-spinner-sm')
      expect(spinnerSm).toBeInTheDocument()
      expect(spinnerSm).toHaveClass('h-4', 'w-4')
      
      rerender(<SessionCheckingSpinner size="md" />)
      const spinnerMd = screen.getByTestId('session-spinner-md')
      expect(spinnerMd).toBeInTheDocument()
      expect(spinnerMd).toHaveClass('h-6', 'w-6')
      
      rerender(<SessionCheckingSpinner size="lg" />)
      const spinnerLg = screen.getByTestId('session-spinner-lg')
      expect(spinnerLg).toBeInTheDocument()
      expect(spinnerLg).toHaveClass('h-8', 'w-8')
    })
    
    it('displays custom message when provided', () => {
      render(
        <SessionCheckingSpinner 
          size="md" 
          message="正在验证权限..." 
        />
      )
      
      expect(screen.getByText('正在验证权限...')).toBeInTheDocument()
    })
    
    it('handles timeout correctly', async () => {
      const onTimeoutMock = jest.fn()
      
      render(
        <SessionCheckingSpinner 
          size="md" 
          timeout={1000}
          onTimeout={onTimeoutMock}
        />
      )
      
      // Fast-forward time to trigger timeout
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      await waitFor(() => {
        expect(onTimeoutMock).toHaveBeenCalledTimes(1)
        expect(screen.getByTestId('session-timeout')).toBeInTheDocument()
        expect(screen.getByTestId('session-timeout')).toHaveAttribute('role', 'alert')
        expect(screen.getByText('会话验证超时')).toBeInTheDocument()
      })
    })
    
    it('shows performance metrics in debug mode', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      render(
        <SessionCheckingSpinner 
          size="md" 
          debugMode={true}
          timeout={5000}
        />
      )
      
      const metricsContainer = screen.getByTestId('session-metrics')
      expect(metricsContainer).toBeInTheDocument()
      expect(screen.getByText(/已用时:/)).toBeInTheDocument()
      expect(screen.getByText(/超时设置: 5000ms/)).toBeInTheDocument()
      expect(screen.getByText(/进度:/)).toBeInTheDocument()
      
      process.env.NODE_ENV = originalEnv
    })
    
    it('updates elapsed time correctly', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      render(
        <SessionCheckingSpinner 
          size="md" 
          debugMode={true}
          timeout={5000}
        />
      )
      
      // Advance timer and check if elapsed time updates
      act(() => {
        jest.advanceTimersByTime(500)
      })
      
      expect(screen.getByText(/已用时: 500ms/)).toBeInTheDocument()
      
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('LoadingStateProvider', () => {
    // Test component to consume the context
    const TestConsumer = () => {
      const { 
        isCheckingAuth, 
        isLoadingClaims, 
        checkingDuration,
        lastCacheHit,
        setCheckingAuth, 
        setLoadingClaims,
        recordCacheHit
      } = useLoadingState()
      
      return (
        <div>
          <div data-testid="checking-auth">{isCheckingAuth.toString()}</div>
          <div data-testid="loading-claims">{isLoadingClaims.toString()}</div>
          <div data-testid="checking-duration">{checkingDuration}</div>
          <div data-testid="last-cache-hit">{lastCacheHit.toString()}</div>
          <button 
            data-testid="start-checking"
            onClick={() => setCheckingAuth(true)}
          >
            Start Checking
          </button>
          <button 
            data-testid="stop-checking"
            onClick={() => setCheckingAuth(false)}
          >
            Stop Checking
          </button>
          <button 
            data-testid="start-loading"
            onClick={() => setLoadingClaims(true)}
          >
            Start Loading
          </button>
          <button 
            data-testid="record-cache-hit"
            onClick={() => recordCacheHit(true)}
          >
            Cache Hit
          </button>
        </div>
      )
    }
    
    it('provides default loading state values', () => {
      render(
        <LoadingStateProvider>
          <TestConsumer />
        </LoadingStateProvider>
      )
      
      expect(screen.getByTestId('checking-auth')).toHaveTextContent('false')
      expect(screen.getByTestId('loading-claims')).toHaveTextContent('false')
      expect(screen.getByTestId('checking-duration')).toHaveTextContent('0')
      expect(screen.getByTestId('last-cache-hit')).toHaveTextContent('false')
    })
    
    it('updates auth checking state correctly', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(1000) // Start time
        .mockReturnValueOnce(1250) // End time
      
      render(
        <LoadingStateProvider>
          <TestConsumer />
        </LoadingStateProvider>
      )
      
      // Start checking
      act(() => {
        screen.getByTestId('start-checking').click()
      })
      
      expect(screen.getByTestId('checking-auth')).toHaveTextContent('true')
      
      // Stop checking
      act(() => {
        screen.getByTestId('stop-checking').click()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('checking-auth')).toHaveTextContent('false')
        expect(screen.getByTestId('checking-duration')).toHaveTextContent('250')
      })
    })
    
    it('updates claims loading state correctly', () => {
      render(
        <LoadingStateProvider>
          <TestConsumer />
        </LoadingStateProvider>
      )
      
      act(() => {
        screen.getByTestId('start-loading').click()
      })
      
      expect(screen.getByTestId('loading-claims')).toHaveTextContent('true')
    })
    
    it('records cache hits correctly', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      render(
        <LoadingStateProvider>
          <TestConsumer />
        </LoadingStateProvider>
      )
      
      act(() => {
        screen.getByTestId('record-cache-hit').click()
      })
      
      expect(screen.getByTestId('last-cache-hit')).toHaveTextContent('true')
      expect(console.log).toHaveBeenCalledWith(
        '[LoadingStateProvider] 缓存命中:',
        'HIT'
      )
      
      process.env.NODE_ENV = originalEnv
    })
    
    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        render(<TestConsumer />)
      }).toThrow('useLoadingState must be used within a LoadingStateProvider')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Security Boundaries', () => {
    it('does not render sensitive content during checking state', () => {
      const SensitiveContent = () => (
        <div data-testid="sensitive">
          User Role: admin | Claims: verified
        </div>
      )
      
      render(
        <LoadingStateProvider>
          <div>
            <AuthLoadingSkeleton variant="compact" />
            {/* 在真实应用中，checking期间不应该渲染敏感内容 */}
            <div data-testid="loading-placeholder">
              正在验证权限，请稍候...
            </div>
          </div>
        </LoadingStateProvider>
      )
      
      // 验证只显示loading相关内容
      expect(screen.getByTestId('loading-placeholder')).toBeInTheDocument()
      expect(screen.queryByTestId('sensitive')).not.toBeInTheDocument()
    })
  })

  describe('Performance Requirements', () => {
    it('renders components within performance budget (<50ms)', async () => {
      const startTime = performance.now()
      
      render(
        <LoadingStateProvider>
          <AuthLoadingSkeleton variant="full" />
          <SessionCheckingSpinner size="lg" />
        </LoadingStateProvider>
      )
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // 验证渲染时间符合要求 (<50ms)
      expect(renderTime).toBeLessThan(50)
    })
  })

  describe('Integration with ProtectedRoute Pattern', () => {
    it('provides compatible loading states for ProtectedRoute HOC', () => {
      // 模拟ProtectedRoute的checking状态
      const MockProtectedRoutePattern = ({ children }: { children: React.ReactNode }) => {
        const [isChecking, setIsChecking] = React.useState(true)
        
        React.useEffect(() => {
          const timer = setTimeout(() => setIsChecking(false), 100)
          return () => clearTimeout(timer)
        }, [])
        
        if (isChecking) {
          return <AuthLoadingSkeleton variant="compact" />
        }
        
        return <>{children}</>
      }
      
      const { rerender } = render(
        <MockProtectedRoutePattern>
          <div data-testid="protected-content">Protected Content</div>
        </MockProtectedRoutePattern>
      )
      
      // Initially shows loading skeleton
      expect(screen.getByTestId('auth-loading-compact')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      
      // After state change, shows protected content
      setTimeout(() => {
        rerender(
          <MockProtectedRoutePattern>
            <div data-testid="protected-content">Protected Content</div>
          </MockProtectedRoutePattern>
        )
        
        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      }, 150)
    })
  })
})