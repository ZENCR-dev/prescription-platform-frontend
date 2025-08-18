import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="medical-container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-medical-text mb-4">
          Welcome to Prescription Platform
        </h1>
        <p className="text-xl text-medical-text-light mb-6">
          Digital prescription management for Traditional Chinese Medicine practitioners and pharmacies
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login" className="medical-button">
            Sign In
          </Link>
          <Link href="/auth/signup" className="medical-button">
            Sign Up
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="medical-card">
          <h3 className="text-xl font-semibold mb-3">For Practitioners</h3>
          <p className="text-medical-text-light">
            Create and manage digital prescriptions with TCM-specific formulation tools
          </p>
        </div>
        <div className="medical-card">
          <h3 className="text-xl font-semibold mb-3">For Pharmacies</h3>
          <p className="text-medical-text-light">
            Receive, process, and fulfill prescriptions with integrated inventory management
          </p>
        </div>
        <div className="medical-card">
          <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
          <p className="text-medical-text-light">
            GDPR & HIPAA compliant platform with no patient PII storage
          </p>
        </div>
      </div>
    </div>
  )
}