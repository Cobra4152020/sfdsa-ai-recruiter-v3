import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../types/database"

/**
 * Creates a Supabase client for Server Components
 * This is the function expected by most of the application
 */
export function createServerClient() {
  try {
    // For server components, we need to use cookies() from next/headers
    const cookieStore = cookies()

    // First try to use the auth-helpers method
    try {
      return createServerComponentClient<Database>({ cookies: () => cookieStore })
    } catch (error) {
      console.warn("Failed to create server component client, falling back to direct client:", error)

      // Fallback to direct client creation
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase environment variables")
      }

      return createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    }
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}

// Export createServerClient with both names for backward compatibility
export const createClient = createServerClient

/**
 * Creates a Supabase client with service role privileges
 * This should only be used in server-side contexts
 */
export const getServiceSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
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

// Export getServiceSupabase with both names for backward compatibility
export const getServerSupabase = getServiceSupabase

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
