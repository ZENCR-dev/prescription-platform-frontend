/**
 * Auth Callback API Route - Server Session Sync
 * 
 * @implements Global Architect Directive - Auth Cookie Sync Chain
 * @description Receives client session and writes server-side cookies for SSR/middleware
 * @integration Uses @supabase/ssr server client for proper cookie handling
 */

import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { event, session } = await request.json()
    
    // Create server client for cookie operations
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // Handle cookie setting errors in API routes
              console.warn('Failed to set cookie in API route:', error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 })
            } catch (error) {
              console.warn('Failed to remove cookie in API route:', error)
            }
          },
        },
      }
    )

    // Sync session to server-side cookies
    if (session) {
      await supabase.auth.setSession(session)
      
      // Immediately validate session was written successfully
      const { data: { session: verifySession }, error: verifyError } = await supabase.auth.getSession()
      
      if (verifyError || !verifySession) {
        console.error('Session validation failed after setSession:', verifyError?.message || 'No session returned')
        return NextResponse.json(
          { error: 'Session sync failed', shouldRetry: true },
          { status: 500 }
        )
      }
      
      console.log('Session successfully synced and verified')
    } else if (event === 'SIGNED_OUT') {
      await supabase.auth.signOut()
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}