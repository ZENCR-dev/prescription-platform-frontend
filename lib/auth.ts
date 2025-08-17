import { supabase } from './supabase'
import type { AuthError, User, Session } from '@supabase/supabase-js'

export type AuthResponse = {
  user: User | null
  session: Session | null
  error: AuthError | null
}

export type SignUpData = {
  email: string
  password: string
}

export type SignInData = {
  email: string
  password: string
}

/**
 * Sign up a new user
 */
export async function signUp({ email, password }: SignUpData): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  return {
    user: data.user,
    session: data.session,
    error,
  }
}

/**
 * Sign in an existing user
 */
export async function signIn({ email, password }: SignInData): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return {
    user: data.user,
    session: data.session,
    error,
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get the current user session
 */
export async function getCurrentSession(): Promise<{ session: Session | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.getSession()
  return {
    session: data.session,
    error,
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.getUser()
  return {
    user: data.user,
    error,
  }
}