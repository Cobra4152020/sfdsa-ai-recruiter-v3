import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

/**
 * Creates a Supabase client for Server Components
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

      return createClient<Database>(supabaseUrl, supabaseKey, {
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

// This is the renamed function for better clarity
export function createClient() {
  // Simply call the original function to avoid code duplication
  return createServerClient()
}
