/**
 * Checks if the required Supabase environment variables are available
 * @returns boolean indicating if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
  )
}

/**
 * Gets the Supabase URL from environment variables
 * @returns The Supabase URL or null if not available
 */
export function getSupabaseUrl(): string | null {
  if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
  }
  return null
}

/**
 * Gets the Supabase key from environment variables
 * @param preferServiceRole Whether to prefer the service role key over the anon key
 * @returns The Supabase key or null if not available
 */
export function getSupabaseKey(preferServiceRole = true): string | null {
  if (typeof process === "undefined" || !process.env) {
    return null
  }

  if (preferServiceRole && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }

  return null
}

/**
 * Logs the availability of environment variables for debugging
 */
export function logEnvironmentStatus(): void {
  console.log("Environment variables status:")
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "Available" : "Missing"}`)
  console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Available" : "Missing"}`)
  console.log(`- SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "Available" : "Missing"}`)
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`)
}
