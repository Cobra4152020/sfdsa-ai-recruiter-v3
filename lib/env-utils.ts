/**
 * Checks if the required Supabase environment variables are set
 * Safe to use on client side
 */
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

/**
 * Gets the base URL for the application
 * Safe to use on client side
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  return "http://localhost:3000"
}

/**
 * Gets an environment variable with a fallback
 * Only use with NEXT_PUBLIC_ prefixed variables on client components
 * @param key The environment variable key
 * @param fallback Optional fallback value
 * @returns The environment variable value or fallback
 */
export function clientEnv(key: string, fallback = ""): string {
  if (!key.startsWith("NEXT_PUBLIC_") && typeof window !== "undefined") {
    console.warn(`Trying to access non-public env var '${key}' on the client. This will not work.`)
    return fallback
  }
  return process.env[key] || fallback
}

/**
 * Server-side only environment utilities
 * These functions should NEVER be imported in client components
 */
export const serverEnvUtils = {
  /**
   * Checks if the Supabase service role key is set (for admin operations)
   * Server-side only
   */
  isSupabaseServiceConfigured: (): boolean => {
    return !!process.env.SUPABASE_SERVICE_ROLE_KEY
  },

  /**
   * Checks if the application is running in development mode
   * Server-side only
   */
  isDevelopment: (): boolean => {
    return process.env.NODE_ENV === "development"
  },

  /**
   * Gets a server-side environment variable with a fallback
   * Server-side only
   */
  env: (key: string, fallback = ""): string => {
    return process.env[key] || fallback
  },
}
