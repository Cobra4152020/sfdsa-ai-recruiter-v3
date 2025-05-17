"use client"

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

let supabaseInstance: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  })

  return supabaseInstance
}

// Export a singleton instance
export const supabase: SupabaseClient<Database> = getSupabaseClient()

// For backward compatibility with existing code
export function createClient() {
  return supabase
}

// Export the singleton instance as default for convenience
export default supabase
