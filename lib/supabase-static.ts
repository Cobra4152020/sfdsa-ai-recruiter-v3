import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

/**
 * Creates a Supabase client that works with static exports
 * This is the main client creation function used throughout the application
 */
export function createStaticClient() {
  // For GitHub Pages deployment, return a mock client
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return getMockClient()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables, using mock client")
    return getMockClient()
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

/**
 * Returns a mock Supabase client that won't throw errors
 * Used for static exports and when environment variables are missing
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
    rpc: () => ({
      data: null,
      error: null,
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  } as any
}

// Create and export a singleton instance
export const supabase = createStaticClient() 