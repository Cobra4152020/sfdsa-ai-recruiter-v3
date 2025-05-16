import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"
import { createStaticClient } from "./supabase-static"

/**
 * Creates a Supabase client with service role privileges
 * This should only be used in server-side contexts
 */
export const getServiceSupabase = () => {
  // For GitHub Pages deployment, return a mock client
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return createStaticClient()
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Missing Supabase environment variables for service role, using mock client")
    return createStaticClient()
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
  return createStaticClient()
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
export const supabase = getClientSupabase()

// Export the admin client as a named export
export const supabaseAdmin = getServiceSupabase()

// Re-export createClient
export { createClient }
