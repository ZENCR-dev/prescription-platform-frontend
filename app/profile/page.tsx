'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// This page should be protected by middleware
// Access requires valid authentication session

export default function ProfilePage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <div className="flex space-x-4">
              <Link 
                href="/dashboard" 
                className="text-blue-600 hover:text-blue-500"
              >
                Dashboard
              </Link>
              <button className="text-red-600 hover:text-red-500">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="text-sm text-green-700">
              🛡️ <strong>Protected Route</strong><br />
              This profile page is protected by middleware. JWT claims would be displayed here.
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-500">
                user@example.com (from JWT claims)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-500">
                tcm_practitioner (from JWT role claim)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-500">
                Example TCM Clinic (from user_metadata)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-500">
                TCM-12345 (from user_metadata)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Status
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-gray-500">
                active (from enhanced JWT claims)
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="font-medium text-yellow-900">Implementation Note</h4>
            <p className="text-yellow-700 text-sm mt-1">
              The actual user data will be populated in Component 3 (Authentication UI Components)
              using the Component 1 Supabase client to retrieve JWT claims and user metadata.
            </p>
          </div>

          <div className="mt-6 flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update Profile (Component 3)
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
              Change Password (Component 3)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}