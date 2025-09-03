/**
 * Registration Page - Real Implementation with EdgeFunctionAdapter Integration
 * 
 * @implements Global Architect Directive - Frontend Lead EUD 
 * @description Replaced placeholder logic with real RegistrationForm component
 * @integration Uses RegistrationService -> EdgeFunctionRegistrationAdapter -> EdgeFunctionAdapter
 */

import RegistrationForm from '@/components/auth/RegistrationForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register - TCM Prescription Platform',
  description: 'Create your account for Traditional Chinese Medicine prescription platform with professional license verification.',
}

export default function RegisterPage() {
  return <RegistrationForm />
}