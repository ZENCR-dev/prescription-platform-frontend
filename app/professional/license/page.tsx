'use client'

/**
 * Professional License Verification Page
 * 
 * @implements Global Architect Directive - Frontend Lead EUD
 * @description Standalone license verification using EdgeFunctionAdapter directly
 * @integration Direct EdgeFunctionAdapter usage, not through registration wrapper
 * @access Login required, no role verification required
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EdgeFunctionAdapter } from '@/services/auth/adapters/edge-function.adapter'
import { 
  LicenseVerificationRequest,
  VerificationState,
  LicenseType,
  isVerificationSuccess,
  isVerificationError,
  
} from '@/types/registration.types'

type LicenseFormData = {
  type: LicenseType | ''
  license_number: string
}

export default function ProfessionalLicensePage() {
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState<LicenseFormData>({
    type: '',
    license_number: ''
  })
  
  // Verification state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<VerificationState | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // EdgeFunctionAdapter instance
  const [adapter] = useState(() => new EdgeFunctionAdapter())
  
  // Service availability check
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null)
  
  useEffect(() => {
    // Check service availability on component mount
    const checkService = async () => {
      try {
        const available = await adapter.isServiceAvailable()
        setServiceAvailable(available)
      } catch (error) {
        console.error('[LicensePage] Service check failed:', error)
        setServiceAvailable(false)
      }
    }
    checkService()
  }, [adapter])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear previous results when form changes
    setError('')
    setSuccess('')
    setVerificationId(null)
    setVerificationStatus(null)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)
    
    try {
      // Basic validation
      if (!formData.type || !formData.license_number.trim()) {
        setError('请选择执照类型并输入执照号码')
        return
      }
      
      // Prepare verification request (license_expiry auto-calculated by adapter)
      const verificationRequest: LicenseVerificationRequest = {
        type: formData.type as LicenseType,
        license_number: formData.license_number.trim(),
        license_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // +1 year
      }
      
      console.log('[LicensePage] Submitting verification request')
      
      // Submit license verification
      const result = await adapter.submitLicenseVerification(verificationRequest)
      
      if (isVerificationError(result)) {
        const errorMessage = adapter.getErrorMessage(result.error.code)
        setError(errorMessage)
        return
      }
      
      if (isVerificationSuccess(result) && result.data.verification_id) {
        setVerificationId(result.data.verification_id)
        setVerificationStatus(result.data.status)
        
        console.log('[LicensePage] Verification submitted, starting polling')
        
        // Start polling for completion (≤3 attempts, 1-2s intervals)
        const pollingResult = await adapter.pollVerificationStatus(
          result.data.verification_id,
          {
            maxAttempts: 3,
            intervalMs: 1500, // 1.5 seconds
            backoffMultiplier: 1.0 // No backoff for quick testing
          }
        )
        
        if (isVerificationError(pollingResult)) {
          const errorMessage = adapter.getErrorMessage(pollingResult.error.code)
          setError(errorMessage)
          setVerificationStatus(null)
          return
        }
        
        if (isVerificationSuccess(pollingResult)) {
          setVerificationStatus(pollingResult.data.status)
          
          if (pollingResult.data.status === 'verified') {
            setSuccess('执照验证成功！您的执照已通过审核。')
          } else if (pollingResult.data.status === 'rejected') {
            const reason = pollingResult.data.rejection_reason || '执照验证未通过'
            setError(reason)
          }
        }
      }
      
    } catch (error) {
      console.error('[LicensePage] Verification failed:', error)
      setError('验证请求失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Service unavailable UI
  if (serviceAvailable === false) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-lg">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">验证服务暂不可用</h3>
              <p className="text-sm text-gray-500 mb-6">
                执照验证服务当前无法连接，请稍后重试或联系技术支持。
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                重新尝试
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                    执照验证
                  </h1>
                  <p className="text-sm text-gray-500">
                    验证您的专业执照状态
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                提交执照验证
              </h3>
              
              {/* Verification Status Panel */}
              {verificationId && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {verificationStatus === 'pending' || verificationStatus === 'verifying' ? (
                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : verificationStatus === 'verified' ? (
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">
                        验证状态: {
                          verificationStatus === 'pending' ? '待处理' :
                          verificationStatus === 'verifying' ? '验证中' :
                          verificationStatus === 'verified' ? '已通过' :
                          verificationStatus === 'rejected' ? '已拒绝' : 
                          '未知状态'
                        }
                      </h4>
                      <p className="text-sm text-blue-700">
                        验证ID: {verificationId}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-6 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* License Verification Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    执照类型
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isSubmitting}
                  >
                    <option value="">请选择执照类型</option>
                    <option value="tcm_practitioner">中医执业医师</option>
                    <option value="pharmacy">药房营业执照</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 mb-2">
                    执照号码
                  </label>
                  <input
                    type="text"
                    id="license_number"
                    name="license_number"
                    required
                    value={formData.license_number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="请输入您的执照号码"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ type: '', license_number: '' })
                      setError('')
                      setSuccess('')
                      setVerificationId(null)
                      setVerificationStatus(null)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    清空
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.type || !formData.license_number.trim()}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        验证中...
                      </span>
                    ) : (
                      '提交验证'
                    )}
                  </button>
                </div>
              </form>

              {/* Test Scenarios Help */}
              <div className="mt-8 p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-2">测试场景</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• <code className="bg-white px-1 rounded">TCM-100001</code> - 应该验证通过</p>
                  <p>• <code className="bg-white px-1 rounded">TCM-900001</code> - 应该验证拒绝</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}