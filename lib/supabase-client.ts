"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

// Create a singleton instance for client-side usage
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

// For backward compatibility with existing code
export function createClient() {
  return createClientSupabase()
}

export function createClientSupabase() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables for client")
    throw new Error("Missing required environment variables for Supabase client")
  }

  supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseClient
}

// Export the singleton instance for convenience
export const supabase = createClientSupabase()
