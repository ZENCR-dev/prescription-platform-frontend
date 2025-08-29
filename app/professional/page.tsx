/**
 * Professional Dashboard Page
 * Dev-Step 2.2: TCM Practitioner role-specific protected route
 * 
 * Alternative dashboard for TCM practitioners with professional focus
 * Requires tcm_practitioner role and serves as role-appropriate landing page
 */

import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Dashboard - TCM Prescription Platform',
  description: 'Professional dashboard for Traditional Chinese Medicine practitioners.',
}

export default function ProfessionalDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443a55.381 55.381 0 015.25 2.882V15" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                    Professional Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">
                    Traditional Chinese Medicine Practice Management
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <Link
                href="/professional/license"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                License Status
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <nav className="sticky top-4 space-y-1">
              <Link href="/professional" className="bg-gray-100 text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-500 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Overview
              </Link>
              <Link href="/prescriptions" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-400 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M8.25 12l4.875 4.875L21 9" />
                </svg>
                Prescriptions
              </Link>
              <Link href="/patients" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-400 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Patients
              </Link>
              <Link href="/professional/license" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-400 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                License &amp; Verification
              </Link>
            </nav>
          </div>

          <main className="lg:col-span-9 xl:col-span-10">
            <div className="px-4 sm:px-0">
              
              {/* Role-based Welcome */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-emerald-800">TCM Practitioner Access</h3>
                    <div className="mt-2 text-sm text-emerald-700">
                      <p>Welcome to your professional dashboard. Access prescription management and patient care tools.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <Link href="/prescriptions/create" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500 rounded-lg shadow hover:shadow-md">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-emerald-50 text-emerald-600 ring-4 ring-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Create Prescription
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Create new TCM prescriptions for your patients
                    </p>
                  </div>
                </Link>

                <Link href="/patients/manage" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500 rounded-lg shadow hover:shadow-md">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Manage Patients
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      View and manage your patient records
                    </p>
                  </div>
                </Link>

                <Link href="/professional/license" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500 rounded-lg shadow hover:shadow-md">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-amber-50 text-amber-600 ring-4 ring-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Verification Status
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Check your professional license verification
                    </p>
                  </div>
                </Link>
              </div>

              {/* Practice Overview */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Practice Overview</h3>
                  
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Active Patients</div>
                      <div className="mt-1 text-2xl font-semibold text-gray-900">87</div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">This Month&apos;s Prescriptions</div>
                      <div className="mt-1 text-2xl font-semibold text-gray-900">41</div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Success Rate</div>
                      <div className="mt-1 text-2xl font-semibold text-gray-900">94%</div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Professional Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Prescription RX-2024-001 completed successfully
                        </div>
                        <div className="text-xs text-gray-400">2 hours ago</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-600">
                          New patient consultation scheduled
                        </div>
                        <div className="text-xs text-gray-400">4 hours ago</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-amber-400 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-600">
                          License verification documents reviewed
                        </div>
                        <div className="text-xs text-gray-400">1 day ago</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Link
                      href="/prescriptions"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View All Prescriptions
                    </Link>
                    <Link
                      href="/patients"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Manage Patients
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  )
}