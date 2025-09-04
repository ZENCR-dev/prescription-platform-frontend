'use client'

/**
 * Providers - M1.2 Dev-Step 4.1 Provider Composition
 * 
 * @description Centralized provider composition for Next.js App Router
 * @usage Wrap app layout with <Providers> to enable global contexts
 * 
 * Integration Guide:
 * 1. Import in app/layout.tsx
 * 2. Wrap children with <Providers>
 * 3. All pages automatically have access to auth context
 */

import React from 'react'
import AuthProvider from './AuthProvider'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Providers composition for the entire application
 * 
 * Current providers:
 * - AuthProvider: Global authentication state management
 * 
 * Future providers can be added here:
 * - ThemeProvider: Dark/light mode management
 * - LanguageProvider: Internationalization (en/zh-cn)
 * - ToastProvider: Global notification system
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {/* Future providers can be nested here */}
      {children}
    </AuthProvider>
  )
}

/**
 * Usage Example in app/layout.tsx:
 * 
 * import Providers from '@/contexts/Providers'
 * 
 * export default function RootLayout({
 *   children,
 * }: {
 *   children: React.ReactNode
 * }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <Providers>
 *           {children}
 *         </Providers>
 *       </body>
 *     </html>
 *   )
 * }
 */