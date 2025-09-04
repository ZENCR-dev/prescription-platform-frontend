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
              
              {/* Enhanced Verification Status Panel */}
              {verificationId && (
                <div className={`mb-6 p-4 rounded-md border ${
                  verificationStatus === 'verified' 
                    ? 'bg-green-50 border-green-200' 
                    : verificationStatus === 'rejected'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {verificationStatus === 'pending' || verificationStatus === 'verifying' ? (
                        <div className="relative">
                          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      ) : verificationStatus === 'verified' ? (
                        <div className="rounded-full bg-green-100 p-1">
                          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="rounded-full bg-red-100 p-1">
                          <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${
                          verificationStatus === 'verified' ? 'text-green-800' :
                          verificationStatus === 'rejected' ? 'text-red-800' : 'text-blue-800'
                        }`}>
                          {verificationStatus === 'pending' ? '📄 验证请求已提交' :
                           verificationStatus === 'verifying' ? '🔍 正在验证中...' :
                           verificationStatus === 'verified' ? '✅ 验证通过' :
                           verificationStatus === 'rejected' ? '❌ 验证未通过' : 
                           '⚠️ 状态未知'}
                        </h4>
                        {(verificationStatus === 'pending' || verificationStatus === 'verifying') && (
                          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            预计 1-3 秒
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        verificationStatus === 'verified' ? 'text-green-700' :
                        verificationStatus === 'rejected' ? 'text-red-700' : 'text-blue-700'
                      }`}>
                        {verificationStatus === 'pending' ? 
                          '您的执照验证请求已成功提交，系统正在处理中...' :
                         verificationStatus === 'verifying' ? 
                          '正在与执照管理部门验证信息，请耐心等待...' :
                         verificationStatus === 'verified' ? 
                          '恭喜！您的执照验证已通过，可以继续后续操作。' :
                         verificationStatus === 'rejected' ? 
                          '抱歉，您的执照验证未通过，请检查信息或联系客服。' :
                          ''}
                      </p>
                      
                      <div className="mt-2 text-xs text-gray-600">
                        验证ID: <code className="bg-white px-1 rounded">{verificationId}</code>
                      </div>
                      
                      {/* Progress Steps Indicator */}
                      {(verificationStatus === 'pending' || verificationStatus === 'verifying') && (
                        <div className="mt-3">
                          <div className="flex items-center text-xs text-gray-600">
                            <div className="flex items-center">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              <div className="ml-2">提交验证</div>
                            </div>
                            <div className="flex-1 h-px bg-gray-300 mx-3"></div>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full ${
                                verificationStatus === 'verifying' ? 'bg-blue-500' : 'bg-gray-300'
                              }`}></div>
                              <div className="ml-2">系统验证</div>
                            </div>
                            <div className="flex-1 h-px bg-gray-300 mx-3"></div>
                            <div className="flex items-center">
                              <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                              <div className="ml-2">验证完成</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Next Steps for Success */}
                      {verificationStatus === 'verified' && (
                        <div className="mt-3 p-2 bg-green-100 rounded">
                          <p className="text-sm font-medium text-green-800 mb-1">🎉 下一步操作建议：</p>
                          <ul className="text-xs text-green-700 space-y-1">
                            <li>• 完善您的个人档案信息</li>
                            <li>• 设置账户安全选项</li>
                            <li>• 开始使用平台相关服务</li>
                          </ul>
                        </div>
                      )}

                      {/* Retry Guidance for Rejection */}
                      {verificationStatus === 'rejected' && (
                        <div className="mt-3 p-2 bg-red-100 rounded">
                          <p className="text-sm font-medium text-red-800 mb-1">🔧 问题排查建议：</p>
                          <ul className="text-xs text-red-700 space-y-1">
                            <li>• 检查执照号码是否输入正确</li>
                            <li>• 确认执照类型选择是否匹配</li>
                            <li>• 验证执照是否在有效期内</li>
                            <li>• 如有疑问请联系客服支持</li>
                          </ul>
                        </div>
                      )}
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

              {/* Enhanced Error Message */}
              {error && (
                <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-red-100 p-1">
                        <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-red-800 mb-1">❌ 验证遇到问题</h4>
                      <p className="text-sm text-red-700 mb-2">{error}</p>
                      
                      {/* Contextual Help based on error type */}
                      <div className="mt-3 p-2 bg-red-100 rounded">
                        <p className="text-sm font-medium text-red-800 mb-1">💡 解决建议：</p>
                        <ul className="text-xs text-red-700 space-y-1">
                          {error.includes('格式') || error.includes('输入') ? (
                            <>
                              <li>• 中医执业医师执照格式：TCM-XXXXXX（6位数字）</li>
                              <li>• 药房营业执照格式：PHARM-XXXXXX（6位数字）</li>
                              <li>• 请确保没有多余的空格或特殊字符</li>
                            </>
                          ) : error.includes('过期') ? (
                            <>
                              <li>• 请检查您的执照是否在有效期内</li>
                              <li>• 如果执照已更新，请使用最新的执照号码</li>
                              <li>• 可联系发证机关确认执照状态</li>
                            </>
                          ) : error.includes('网络') || error.includes('连接') || error.includes('请求失败') ? (
                            <>
                              <li>• 请检查您的网络连接是否正常</li>
                              <li>• 尝试刷新页面后重新提交</li>
                              <li>• 如果问题持续，请联系技术支持</li>
                            </>
                          ) : error.includes('登录') || error.includes('权限') ? (
                            <>
                              <li>• 请确保您已正确登录账户</li>
                              <li>• 尝试退出登录后重新登录</li>
                              <li>• 检查账户是否有执照验证权限</li>
                            </>
                          ) : (
                            <>
                              <li>• 请仔细检查输入的信息是否正确</li>
                              <li>• 确认执照类型与执照号码匹配</li>
                              <li>• 可以尝试使用测试号码验证功能是否正常</li>
                              <li>• 如需帮助，请联系客服：400-XXX-XXXX</li>
                            </>
                          )}
                        </ul>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => {
                            setError('')
                            setSuccess('')
                            setVerificationId(null)
                            setVerificationStatus(null)
                          }}
                          className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          🔄 重新尝试
                        </button>
                        <button
                          onClick={() => window.location.reload()}
                          className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          🔄 刷新页面
                        </button>
                      </div>
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

              {/* Enhanced Test Scenarios & User Guidance */}
              <div className="mt-8 space-y-6">
                {/* Process Guide */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">验证流程说明</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>1. 选择执照类型并输入执照号码</p>
                        <p>2. 系统将提交验证请求（通常需要1-3秒）</p>
                        <p>3. 验证完成后将显示结果和下一步操作建议</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Test Scenarios */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">测试场景参考</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">中医执业医师测试</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>• <code className="bg-white px-1 rounded text-green-700">TCM-100001</code> - 验证通过</p>
                        <p>• <code className="bg-white px-1 rounded text-red-700">TCM-900001</code> - 验证拒绝</p>
                        <p>• <code className="bg-white px-1 rounded text-yellow-700">TCM-500001</code> - 执照过期</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">药房营业执照测试</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>• <code className="bg-white px-1 rounded text-green-700">PHARM-200001</code> - 验证通过</p>
                        <p>• <code className="bg-white px-1 rounded text-red-700">PHARM-800001</code> - 验证拒绝</p>
                        <p>• <code className="bg-white px-1 rounded text-yellow-700">PHARM-600001</code> - 格式错误</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      💡 提示：这些测试号码仅用于演示，真实验证请使用您的实际执照号码
                    </p>
                  </div>
                </div>

                {/* User Feedback Collection */}
                {verificationStatus && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.78 1.417 3.229 3.158 3.229h.865a.75.75 0 00.671-.415l.946-1.893a.75.75 0 01.671-.415h2.378c.254 0 .485.125.629.334l1.705 2.482a.75.75 0 001.029.275l1.125-.563c.235-.117.462-.312.629-.563l1.705-2.482a.75.75 0 00-.254-1.029L18.5 10.375c-.129-.065-.28-.125-.447-.125H15.75a.75.75 0 01-.671-.415l-.946-1.893a.75.75 0 00-.671-.415H9.75z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2">体验反馈</h4>
                        <div className="text-sm text-yellow-700 space-y-1">
                          <p>验证流程完成！请评价一下您的使用体验：</p>
                          <div className="mt-2 flex space-x-3">
                            <button className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200">
                              😊 很满意
                            </button>
                            <button className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">
                              😐 一般
                            </button>
                            <button className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200">
                              😞 需改进
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}