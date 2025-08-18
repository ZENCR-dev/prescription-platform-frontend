'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Sign in successful!')
      }
    } catch {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="medical-container py-8">
      <div className="max-w-md mx-auto">
        <div className="medical-card">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                placeholder="practitioner@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full medical-button"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-medical-text-light">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-medical-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}