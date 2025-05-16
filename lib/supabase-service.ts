import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

/**
 * Creates a Supabase client with service role privileges
 * This should only be used in server-side contexts
 */
export const getServiceSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables for service role")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
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
    throw new Error("Missing Supabase environment variables for anon key")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

/**
 * Retry function for Supabase operations
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 * @param delay Delay between retries in milliseconds
 * @returns Promise with the result of the function
 */
export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: any

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      console.warn(`Attempt ${i + 1}/${maxRetries} failed:`, error)
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
    }
  }

  console.error(`All ${maxRetries} retry attempts failed`)
  throw lastError
}

// Create and export the client-side Supabase instance
// This is a singleton that can be imported throughout the app
let _supabase: ReturnType<typeof getClientSupabase> | null = null

export const supabase = (() => {
  if (typeof window === "undefined") {
    // Server-side: Create a new instance each time
    try {
      return getClientSupabase()
    } catch (error) {
      console.warn("Failed to initialize server-side Supabase client:", error)
      // Return a mock client for SSR that won't throw errors
      return createClient("https://placeholder.supabase.co", "placeholder-key")
    }
  }

  // Client-side: Use singleton pattern
  if (!_supabase) {
    try {
      _supabase = getClientSupabase()
    } catch (error) {
      console.error("Failed to initialize client-side Supabase client:", error)
      // Return a mock client that won't throw errors
      _supabase = createClient("https://placeholder.supabase.co", "placeholder-key")
    }
  }

  return _supabase
})()

// Export the admin client as a named export
export const supabaseAdmin = (() => {
  try {
    return getServiceSupabase()
  } catch (error) {
    console.warn("Failed to initialize admin Supabase client:", error)
    // Return a mock client for SSR that won't throw errors
    return createClient("https://placeholder.supabase.co", "placeholder-key")
  }
})()

// Re-export createClient
export { createClient }
