/**
 * Error Boundary Component
 * 
 * @implements Dev-Step 3.9: Enhanced UI States - Error recovery mechanisms
 * @description Graceful error catching with analytics and recovery options
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  analyticsCallback?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorCount: number
  lastErrorTime?: Date
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      errorCount: 0
    }
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorCount: 1,
      lastErrorTime: new Date()
    }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, errorInfo)
    }
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    
    // Send to analytics if callback provided
    if (this.props.analyticsCallback) {
      this.props.analyticsCallback(error, errorInfo)
    }
    
    // Update error count
    this.setState(prevState => ({
      errorCount: prevState.errorCount + 1,
      lastErrorTime: new Date()
    }))
  }
  
  retry = () => {
    this.setState({
      hasError: false,
      error: undefined
    })
  }
  
  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.retry)
      }
      
      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />
    }
    
    return this.props.children
  }
}

// Default error fallback component
interface DefaultErrorFallbackProps {
  error: Error
  retry: () => void
}

function DefaultErrorFallback({ error, retry }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-red-100">
          {/* Error icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          
          {/* Error message */}
          <h2 className="text-xl font-medium text-gray-900 text-center mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          
          {/* Error details (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-3 bg-gray-50 rounded text-xs text-gray-700 font-mono">
              {error.message}
            </div>
          )}
          
          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={retry}
              className="w-full py-3 bg-sage-600 text-white rounded hover:bg-sage-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Retryable Error Component with exponential backoff
export interface RetryableErrorProps {
  error: Error | string
  onRetry: () => Promise<void>
  maxAttempts?: number
  backoffStrategy?: 'linear' | 'exponential'
  analyticsCallback?: (error: Error | string, attempt: number) => void
  className?: string
}

export function RetryableError({
  error,
  onRetry,
  maxAttempts = 3,
  backoffStrategy = 'exponential',
  analyticsCallback,
  className = ''
}: RetryableErrorProps) {
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [attemptCount, setAttemptCount] = React.useState(0)
  const [countdown, setCountdown] = React.useState(0)
  const countdownInterval = React.useRef<NodeJS.Timeout>()
  
  const errorMessage = typeof error === 'string' ? error : error.message
  
  // Calculate backoff delay
  const getBackoffDelay = (attempt: number): number => {
    if (backoffStrategy === 'linear') {
      return (attempt + 1) * 1000 // 1s, 2s, 3s...
    } else {
      return Math.min(1000 * Math.pow(2, attempt), 30000) // 1s, 2s, 4s... max 30s
    }
  }
  
  const handleRetry = async () => {
    if (attemptCount >= maxAttempts) {
      return
    }
    
    setIsRetrying(true)
    const nextAttempt = attemptCount + 1
    
    // Send to analytics
    if (analyticsCallback) {
      analyticsCallback(error, nextAttempt)
    }
    
    // Start countdown
    const delay = getBackoffDelay(attemptCount)
    setCountdown(Math.ceil(delay / 1000))
    
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    // Wait for backoff delay
    await new Promise(resolve => setTimeout(resolve, delay))
    
    try {
      await onRetry()
      // Success - clear error state
      setIsRetrying(false)
      setAttemptCount(0)
    } catch {
      // Failed - increment attempt count
      setAttemptCount(nextAttempt)
      setIsRetrying(false)
    }
  }
  
  // Cleanup countdown on unmount
  React.useEffect(() => {
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current)
      }
    }
  }, [])
  
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        {/* Error icon */}
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        {/* Error content */}
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">
            {errorMessage}
          </p>
          
          {/* Retry status */}
          {attemptCount > 0 && (
            <p className="text-xs text-red-600 mt-1">
              Attempt {attemptCount} of {maxAttempts} failed
            </p>
          )}
          
          {/* Countdown */}
          {countdown > 0 && (
            <p className="text-xs text-red-600 mt-1">
              Retrying in {countdown} seconds...
            </p>
          )}
        </div>
        
        {/* Retry button */}
        {!isRetrying && attemptCount < maxAttempts && (
          <button
            onClick={handleRetry}
            className="flex-shrink-0 ml-4 px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        )}
        
        {/* Spinner during retry */}
        {isRetrying && (
          <div className="flex-shrink-0 ml-4">
            <svg className="animate-spin h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      
      {/* Max attempts reached message */}
      {attemptCount >= maxAttempts && (
        <div className="mt-3 pt-3 border-t border-red-200">
          <p className="text-xs text-red-700">
            Maximum retry attempts reached. Please check your connection and try again later.
          </p>
        </div>
      )}
    </div>
  )
}