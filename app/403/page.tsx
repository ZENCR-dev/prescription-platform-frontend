/**
 * 403 Access Denied Page
 * Dev-Step 2.2: Role-based access control error handling
 * 
 * Displayed when users attempt to access routes they don't have permission for
 * Provides clear messaging and appropriate redirect options based on user role
 */

import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Access Denied - TCM Prescription Platform',
  description: 'You do not have permission to access this resource.',
}

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-400">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Access Denied
          </h1>
          <p className="mt-2 text-base text-gray-600">
            You don&apos;t have permission to access this resource.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            
            {/* Role-based guidance */}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <div className="text-sm text-amber-700">
                <h3 className="font-medium mb-2">Need Access?</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure you&apos;re logged in with the correct account</li>
                  <li>Contact your administrator if you believe you should have access</li>
                  <li>Verify your account verification status is complete</li>
                </ul>
              </div>
            </div>

            {/* Navigation options */}
            <div className="space-y-4">
              <div>
                <Link
                  href="/dashboard"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Dashboard
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href="/profile"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Check Profile Status →
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href="/support"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Contact Support →
                </Link>
              </div>
            </div>

            {/* Role-specific information */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-2">Access Levels</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>TCM Practitioners:</strong> Access prescriptions &amp; patient management</div>
                <div><strong>Pharmacies:</strong> Access order fulfillment &amp; inventory</div>
                <div><strong>Administrators:</strong> Access user management &amp; system settings</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}