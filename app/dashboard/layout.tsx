/**
 * Dashboard Layout
 * 
 * @implements Dev-Step 3.12: Post-Registration Journeys
 * @description Shared dashboard layout with role detection and TCM theme
 */

import React from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?reason=session_required')
  }

  // Get user role from metadata
  const role = user.user_metadata?.role

  return (
    <div className="min-h-screen bg-gradient-to-br from-tcm-sage-50 via-white to-tcm-bamboo-50">
      {/* TCM Theme Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237e998a' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Top Navigation Bar */}
      <nav className="relative bg-white border-b border-tcm-sage-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* TCM Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-tcm-sage-400 to-tcm-bamboo-400 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 7a2.5 2.5 0 012.5 2.5c0 1.38-1.12 2.5-2.5 2.5a2.5 2.5 0 01-2.5-2.5A2.5 2.5 0 0112 7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 12a2.5 2.5 0 012.5 2.5c0 1.38-1.12 2.5-2.5 2.5a2.5 2.5 0 01-2.5-2.5A2.5 2.5 0 0112 12z" />
                  </svg>
                </div>
                <h1 className="ml-3 text-xl font-semibold text-tcm-sage-800">
                  中医处方平台
                </h1>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-tcm-sage-600 capitalize">{role?.replace('_', ' ')}</p>
              </div>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm text-tcm-sage-700 hover:text-tcm-sage-900 hover:bg-tcm-sage-50 rounded-md transition-colors"
                >
                  退出
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative mt-auto border-t border-tcm-sage-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-4 text-xs text-tcm-sage-600">
            <span>© 2025 中医处方平台</span>
            <span>•</span>
            <span>医道传承 · 科技赋能</span>
            <span>•</span>
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  )
}