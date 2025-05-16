import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase-types"

// Error handling wrapper for Supabase client
export function createSafeClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Create a singleton instance for client-side usage
let clientSideClient: ReturnType<typeof createSafeClient> | null = null

export function getClientSideSupabase() {
  if (typeof window === "undefined") {
    throw new Error("getClientSideSupabase should only be called on the client side")
  }

  if (!clientSideClient) {
    clientSideClient = createSafeClient()
  }

  return clientSideClient
}

// Server-side client creation (for use in Server Components or API routes)
export function getServerSupabase() {
  return createSafeClient()
}
