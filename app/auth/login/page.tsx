/**
 * Login Page - M1.2 Authentication Entry Point
 * 
 * @implements Frontend Lead Dev-Step 3.4
 * @route /auth/login
 * @description Main login page for TCM practitioners, pharmacies, and administrators
 */

'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'

// Dev-Step 2.3: Session failure reason mapping for user-friendly messages
const REASON_MESSAGES: Record<string, string> = {
  expired: '会话已过期，请重新登录。',
  invalid_session: '会话无效或已失效，请重新登录。',
  refresh_failed: '会话刷新失败，请重新登录。',
  no_session: '未检测到有效会话，请登录。',
  error: '发生意外错误，请重试登录。'
}

function LoginPageContent() {
  const searchParams = useSearchParams()
  const [info, setInfo] = useState<string | null>(null)
  const [returnUrl, setReturnUrl] = useState<string | null>(null)

  useEffect(() => {
    const reason = searchParams.get('reason')
    const ret = searchParams.get('return')
    if (reason && REASON_MESSAGES[reason]) {
      setInfo(REASON_MESSAGES[reason])
    }
    if (ret) setReturnUrl(ret)
  }, [searchParams])

  return (
    <div className="max-w-md mx-auto mt-10">
      {info && (
        <div className="mb-4 rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          {info}
        </div>
      )}

      {/* Loading indicator placeholder for auth transitions */}
      <div className="flex items-center mb-4" aria-hidden>
        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full mr-2"></div>
        <span className="text-xs text-gray-500">准备登录...</span>
      </div>

      <LoginForm />

      {returnUrl && (
        <p className="mt-3 text-xs text-gray-500">登录后将返回：{returnUrl}</p>
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-10 text-gray-500"><span className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full mr-2"></span>加载中...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}