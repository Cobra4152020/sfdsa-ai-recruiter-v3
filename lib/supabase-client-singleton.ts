import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
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
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return supabaseClient
}

// Export a singleton instance
export const supabase = getSupabaseClient()
