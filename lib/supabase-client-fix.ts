import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Hardcoded production URL to ensure consistency
const SITE_URL = "https://www.sfdeputysheriff.com"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

export function createClientWithRedirectUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        // Explicitly set the site URL for redirects
        redirectTo: `${SITE_URL}/auth/callback`,
      },
    })
  }

  return supabaseClient
}

// Export a function to get the client
export function getSupabaseClient() {
  return createClientWithRedirectUrl()
}
