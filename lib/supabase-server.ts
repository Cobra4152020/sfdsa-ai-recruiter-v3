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
      const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.warn("Missing Supabase environment variables, using mock client")
        // Return a mock client that won't throw errors
        return getMockClient()
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
    return getMockClient() // Return a mock client instead of throwing
  }
}

// Export aliases for backward compatibility
export const getServerClient = createServerClient
export const createClient = createServerClient

/**
 * Creates a Supabase client with service role privileges
 * This should only be used in server-side contexts
 */
export const getServiceSupabase = () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Missing Supabase environment variables for service role, using mock client")
      return getMockClient()
    }

    return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  } catch (error) {
    console.error("Error creating service Supabase client:", error)
    return getMockClient()
  }
}

// Export aliases for backward compatibility
export const getServerSupabase = getServiceSupabase
export const getAdminSupabase = getServiceSupabase

/**
 * Creates a Supabase client with anonymous privileges
 * This can be used in both client and server contexts
 */
export const getAnonSupabase = () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Missing Supabase environment variables for anon client, using mock client")
      return getMockClient()
    }

    return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } catch (error) {
    console.error("Error creating anon Supabase client:", error)
    return getMockClient()
  }
}

/**
 * Returns a mock Supabase client that won't throw errors
 * Used as a fallback when environment variables are missing
 */
function getMockClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          limit: () => ({
            data: [],
            error: null,
          }),
          order: () => ({
            limit: () => ({
              data: [],
              error: null,
            }),
          }),
          single: () => ({
            data: null,
            error: null,
          }),
        }),
        order: () => ({
          limit: () => ({
            data: [],
            error: null,
          }),
        }),
        limit: () => ({
          data: [],
          error: null,
        }),
        single: () => ({
          data: null,
          error: null,
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => ({
            data: null,
            error: null,
          }),
          data: null,
          error: null,
        }),
      }),
      update: () => ({
        eq: () => ({
          data: null,
          error: null,
        }),
      }),
      delete: () => ({
        eq: () => ({
          data: null,
          error: null,
        }),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
  } as any
}
