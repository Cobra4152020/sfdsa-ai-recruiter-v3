import { createClient as supabaseCreateClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

/**
 * Creates a Supabase client with service role privileges
 * This should only be used in server-side contexts
 */
export const getServiceSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return supabaseCreateClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * Creates a Supabase client with anonymous privileges
 * This can be used in both client and server contexts
 */
export const getClientSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return supabaseCreateClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

/**
 * Creates a Supabase client
 * This is maintained for backward compatibility
 */
export const createClient = (url?: string, key?: string, options?: any) => {
  const supabaseUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return supabaseCreateClient<Database>(supabaseUrl, supabaseKey, options)
}

// Also export the singleton instance for convenience
export const supabase = supabaseCreateClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)
