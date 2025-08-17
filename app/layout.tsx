import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prescription Platform - Traditional Chinese Medicine',
  description: 'Digital prescription management platform for Traditional Chinese Medicine practitioners and pharmacies',
  keywords: 'TCM, Traditional Chinese Medicine, prescription, pharmacy, healthcare',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Prescription Platform</h1>
          <p className="text-blue-100">Traditional Chinese Medicine Management System</p>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-100 p-4 text-center text-gray-600">
          <p>&copy; 2024 Prescription Platform. GDPR & HIPAA Compliant.</p>
        </footer>
      </body>
    </html>
  )
}