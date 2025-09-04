/**
 * Contexts Index - M1.2 Dev-Step 4.1 Context Exports
 * 
 * Central export file for all React contexts and related hooks
 */

// AuthProvider exports
export { default as AuthProvider } from './AuthProvider'
export { useAuth, useAuthUser, useAuthRole, useAuthSession } from './AuthProvider'
export type { AuthContextType } from './AuthProvider'

// Future context exports can be added here
// export { default as ThemeProvider } from './ThemeProvider'
// export { default as LanguageProvider } from './LanguageProvider'