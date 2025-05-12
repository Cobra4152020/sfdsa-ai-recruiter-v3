import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Re-export createClient from @supabase/supabase-js
export { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a singleton instance for client-side usage
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  // If we already have a client, return it
  if (supabaseClient) return supabaseClient

  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are missing")

    // Return a mock client that won't throw errors when methods are called
    return {
      from: () => ({
        select: () => ({ data: null, error: new Error("Supabase client not initialized") }),
        insert: () => ({ data: null, error: new Error("Supabase client not initialized") }),
        update: () => ({ data: null, error: new Error("Supabase client not initialized") }),
        delete: () => ({ data: null, error: new Error("Supabase client not initialized") }),
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signIn: () => Promise.resolve({ data: null, error: new Error("Supabase client not initialized") }),
        signOut: () => Promise.resolve({ error: null }),
      },
    } as any
  }

  try {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })

    return supabaseClient
  } catch (error) {
    console.error("Error initializing Supabase client:", error)

    // Return a mock client that won't throw errors when methods are called
    return {
      from: () => ({
        select: () => ({ data: null, error: new Error("Failed to initialize Supabase client") }),
        insert: () => ({ data: null, error: new Error("Failed to initialize Supabase client") }),
        update: () => ({ data: null, error: new Error("Failed to initialize Supabase client") }),
        delete: () => ({ data: null, error: new Error("Failed to initialize Supabase client") }),
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signIn: () => Promise.resolve({ data: null, error: new Error("Failed to initialize Supabase client") }),
        signOut: () => Promise.resolve({ error: null }),
      },
    } as any
  }
}

export const supabase = createClient()
