import { createClient as createSupabaseClient } from "@supabase/supabase-js"
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

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
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
export const getAnonSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase environment variables")
    // Return a mock client that won't throw errors
    return {
      from: () => ({
        select: () => ({
          order: () => ({
            data: [],
            error: null,
          }),
        }),
        insert: () => ({
          select: () => ({
            data: [],
            error: null,
          }),
        }),
      }),
    } as any
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseKey)
}
