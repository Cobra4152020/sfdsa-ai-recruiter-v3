import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

/**
 * Creates a Supabase client with service role privileges for server-side use.
 */
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * Gets a Supabase session for server-side authentication.
 * @returns The Supabase session or null if not authenticated.
 */
export async function getServerSession() {
  const supabase = createServerClient()
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error("Error getting server session:", error)
    return null
  }

  return data.session
}
