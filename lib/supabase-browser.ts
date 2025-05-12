import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Create a single supabase client for the browser
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function createBrowserClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return supabaseClient
}
