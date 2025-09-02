/**
 * Dashboard Main Page - Role Redirect
 * 
 * @implements Dev-Step 3.12: Post-Registration Journeys
 * @description Detects user role and redirects to appropriate dashboard
 */

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get role from user metadata
  const role = user.user_metadata?.role as string

  // Redirect based on role
  switch (role) {
    case 'tcm_practitioner':
      redirect('/dashboard/tcm_practitioner')
    case 'pharmacy':
      redirect('/dashboard/pharmacy')
    case 'admin':
      redirect('/dashboard/admin')
    default:
      // If no role, show role selection page
      return (
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              选择您的角色 / Select Your Role
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              请选择您的账户类型以继续
            </p>
            <div className="space-y-3">
              <a
                href="/dashboard/tcm_practitioner"
                className="block w-full px-4 py-3 bg-tcm-sage-500 text-white rounded-md hover:bg-tcm-sage-600 text-center transition-colors"
              >
                中医师 / TCM Practitioner
              </a>
              <a
                href="/dashboard/pharmacy"
                className="block w-full px-4 py-3 bg-tcm-bamboo-500 text-white rounded-md hover:bg-tcm-bamboo-600 text-center transition-colors"
              >
                药房 / Pharmacy
              </a>
              <a
                href="/dashboard/admin"
                className="block w-full px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-center transition-colors"
              >
                管理员 / Admin
              </a>
            </div>
          </div>
        </div>
      )
  }
}