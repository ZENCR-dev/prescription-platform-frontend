/**
 * TCM Practitioner Onboarding
 * 
 * @implements Dev-Step 3.12: Post-Registration Journeys
 * @description First-time user onboarding for TCM practitioners
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthButton } from '@/components/auth/library/primitives/AuthButton'
import { dashboardAdapter } from '@/lib/adapters/dashboard-adapter'

const onboardingSteps = [
  {
    id: 'welcome',
    title: '欢迎加入中医处方平台',
    content: '我们致力于将传统中医药与现代科技相结合，为您提供专业、高效的处方管理服务。',
    icon: '🌿'
  },
  {
    id: 'profile',
    title: '完善您的专业资料',
    content: '请确保您的执业证号已通过验证，这将帮助患者和药房更好地信任您的处方。',
    icon: '👤'
  },
  {
    id: 'features',
    title: '探索平台功能',
    content: '您可以创建处方模板、管理患者信息、与药房协作，实现处方的全流程数字化管理。',
    icon: '🎯'
  },
  {
    id: 'ready',
    title: '准备就绪',
    content: '现在您可以开始使用平台的所有功能了。让我们一起传承中医药文化，服务更多患者。',
    icon: '✨'
  }
]

export default function TCMPractitionerOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      dashboardAdapter.saveOnboardingProgress(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleSkip = () => {
    dashboardAdapter.skipOnboarding()
    router.push('/dashboard/tcm_practitioner')
  }

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      await dashboardAdapter.updateOnboardingStatus(true)
      dashboardAdapter.saveOnboardingProgress(onboardingSteps.length)
      router.push('/dashboard/tcm_practitioner')
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  const step = onboardingSteps[currentStep]

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                步骤 {currentStep + 1} / {onboardingSteps.length}
              </span>
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                跳过引导
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-tcm-sage-400 to-tcm-bamboo-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{step.icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {step.title}
            </h2>
            <p className="text-gray-600 text-lg">
              {step.content}
            </p>
          </div>

          {/* Step-specific content */}
          {currentStep === 1 && (
            <div className="bg-tcm-sage-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-tcm-sage-800 mb-2">您的专业信息</h3>
              <div className="space-y-2 text-sm text-tcm-sage-700">
                <p>✅ 执业证号已验证</p>
                <p>✅ 邮箱已确认</p>
                <p>⏳ 专业资质审核中（预计24小时内完成）</p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">📝</div>
                <h4 className="font-medium text-gray-900">处方管理</h4>
                <p className="text-sm text-gray-600 mt-1">创建和管理中药处方</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">👥</div>
                <h4 className="font-medium text-gray-900">患者管理</h4>
                <p className="text-sm text-gray-600 mt-1">维护患者健康档案</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🏪</div>
                <h4 className="font-medium text-gray-900">药房协作</h4>
                <p className="text-sm text-gray-600 mt-1">与药房无缝对接</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <AuthButton
              variant="secondary"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6"
            >
              上一步
            </AuthButton>
            <AuthButton
              variant="primary"
              onClick={handleNext}
              loading={loading}
              className="px-8 bg-gradient-to-r from-tcm-sage-500 to-tcm-bamboo-500 hover:from-tcm-sage-600 hover:to-tcm-bamboo-600"
            >
              {currentStep === onboardingSteps.length - 1 ? '开始使用' : '下一步'}
            </AuthButton>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-tcm-sage-500'
                  : index < currentStep
                  ? 'bg-tcm-sage-300'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}