/**
 * Login Page - M1.2 Authentication Entry Point
 * 
 * @implements Frontend Lead Dev-Step 3.4
 * @route /auth/login
 * @description Main login page for TCM practitioners, pharmacies, and administrators
 */

import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return <LoginForm />
}