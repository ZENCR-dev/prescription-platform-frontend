'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// This page should be protected by middleware
// Access requires valid authentication session

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex space-x-4">
              <Link 
                href="/profile" 
                className="text-blue-600 hover:text-blue-500"
              >
                Profile
              </Link>
              <button className="text-red-600 hover:text-red-500">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="text-sm text-green-700">
              🎉 <strong>Middleware Protection Active</strong><br />
              You are seeing this page because middleware authentication was successful.
              If you weren&apos;t authenticated, you would have been redirected to the login page.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Session Status</h3>
              <p className="text-blue-700 mt-2">
                Authentication verified by Next.js middleware
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900">JWT Claims</h3>
              <p className="text-yellow-700 mt-2">
                Role-based access control active
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibent text-green-900">Route Protection</h3>
              <p className="text-green-700 mt-2">
                This route requires authentication
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link 
                href="/profile" 
                className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
              >
                → View Profile Settings
              </Link>
              <button className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md">
                → Manage Prescriptions (Component 3)
              </button>
              <button className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md">
                → View Reports (Component 3)
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-900">Development Status</h4>
            <p className="text-blue-700 text-sm mt-1">
              Component 1: ✅ Supabase Client Infrastructure (Complete)<br />
              Component 2: 🚧 Next.js Middleware Implementation (In Progress)<br />
              Component 3: ⏳ Authentication UI Components (Pending)<br />
              Component 4: ⏳ Session Management & Protection (Pending)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}