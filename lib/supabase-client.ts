"use client"

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

// Environment checks
const STATIC_BUILD = process.env.NEXT_PUBLIC_STATIC_BUILD === 'true'
const DISABLE_DATABASE_CHECKS = process.env.NEXT_PUBLIC_DISABLE_DATABASE_CHECKS === 'true'

// Hardcoded production URL to ensure consistency
const SITE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sfdeputysheriff.com'

// Client instances
let anonClient: SupabaseClient<Database> | null = null
let serviceClient: SupabaseClient<Database> | null = null

/**
 * Get Supabase client with anonymous privileges
 * This can be used in both client and server contexts
 */
export function getAnonClient(): SupabaseClient<Database> {
  if (anonClient) return anonClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Fallback for static builds
  if (!supabaseUrl && (typeof window === 'undefined' || STATIC_BUILD || DISABLE_DATABASE_CHECKS)) {
    console.warn('Using placeholder Supabase config for static build')
    return createSupabaseClient('https://placeholder-url.supabase.co', 'placeholder-key')
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  anonClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      redirectTo: `${SITE_URL}/auth/callback`,
      storageKey: 'sfdsa_auth_token',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    db: {
      schema: 'public',
    },
  })

  return anonClient
}

/**
 * Get Supabase client with service role privileges
 * This should only be used in server-side contexts
 */
export function getServiceClient(): SupabaseClient<Database> {
  if (serviceClient) return serviceClient

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service role environment variables')
  }

  serviceClient = createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return serviceClient
}

// Default export for more consistent imports
export const supabase: SupabaseClient<Database> = getAnonClient()

// For backward compatibility with existing code
export function createClient() {
  return supabase
}

// Export the singleton instance as default for convenience
export default supabase
