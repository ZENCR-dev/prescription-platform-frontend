import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          TCM Prescription Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Traditional Chinese Medicine Prescription Fulfillment Platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">TCM Practitioners</h3>
            <p className="text-gray-600 mb-4">
              Manage prescriptions and patient consultations
            </p>
            <Link 
              href="/auth/login?role=tcm_practitioner" 
              className="text-blue-600 hover:underline"
            >
              Practitioner Login →
            </Link>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Pharmacies</h3>
            <p className="text-gray-600 mb-4">
              Process prescriptions and manage inventory
            </p>
            <Link 
              href="/auth/login?role=pharmacy" 
              className="text-blue-600 hover:underline"
            >
              Pharmacy Login →
            </Link>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Administrators</h3>
            <p className="text-gray-600 mb-4">
              System management and oversight
            </p>
            <Link 
              href="/auth/login?role=admin" 
              className="text-blue-600 hover:underline"
            >
              Admin Login →
            </Link>
          </div>
        </div>
        
        <div className="space-x-4">
          <Link 
            href="/auth/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/register" 
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}