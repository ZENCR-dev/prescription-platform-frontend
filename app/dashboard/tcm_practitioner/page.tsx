/**
 * TCM Practitioner Dashboard
 * 
 * @implements Dev-Step 3.12: Post-Registration Journeys
 * @description Dashboard for Traditional Chinese Medicine practitioners
 */

'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { dashboardAdapter } from '@/lib/adapters/dashboard-adapter'
import type { PractitionerDashboard, UserProfile } from '@/lib/adapters/dashboard-adapter'

export default function TCMPractitionerDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [dashboard, setDashboard] = useState<PractitionerDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  const loadDashboardData = useCallback(async () => {
    try {
      const [userProfile, dashboardData] = await Promise.all([
        dashboardAdapter.getUserProfile(),
        dashboardAdapter.getPractitionerData()
      ])

      setProfile(userProfile)
      setDashboard(dashboardData)

      // Check if onboarding is needed
      if (!userProfile.hasCompletedOnboarding) {
        router.push('/dashboard/tcm_practitioner/onboarding')
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tcm-sage-500 mx-auto"></div>
          <p className="mt-4 text-tcm-sage-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">加载仪表板数据失败</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          欢迎回来，{profile?.fullName || '医生'}
        </h1>
        <p className="mt-2 text-gray-600">
          今日是传承中医药文化，服务患者健康的美好一天
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-tcm-sage-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-tcm-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">总患者数</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboard.stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-tcm-bamboo-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-tcm-bamboo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">活跃处方</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboard.stats.activePrescriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-tcm-herb-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-tcm-herb-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">待审核</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboard.stats.pendingReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">本月咨询</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboard.stats.monthlyConsultations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboard.quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => router.push(action.href)}
              className={`p-4 rounded-lg border-2 border-${action.color}-200 hover:border-${action.color}-400 transition-colors text-left`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{action.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{action.labelZh}</h3>
                  <p className="text-sm text-gray-500">{action.label}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h2>
        <div className="space-y-3">
          {dashboard.recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activity.status === 'completed' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {activity.status === 'completed' ? '已完成' : '待处理'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TCM Quote */}
      <div className="bg-gradient-to-r from-tcm-sage-50 to-tcm-bamboo-50 rounded-lg p-6">
        <div className="text-center">
          <p className="text-lg text-tcm-sage-700 italic">&quot;上工治未病，不治已病&quot;</p>
          <p className="text-sm text-tcm-sage-600 mt-2">
            — 《黄帝内经》
          </p>
        </div>
      </div>
    </div>
  )
}