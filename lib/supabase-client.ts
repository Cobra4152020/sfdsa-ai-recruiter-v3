import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Re-export createClient from @supabase/supabase-js
export { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a singleton instance for client-side usage
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })

  return supabaseClient
}

export const supabase = createClient()
