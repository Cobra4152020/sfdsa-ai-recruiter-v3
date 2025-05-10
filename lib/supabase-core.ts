/**
 * Core Supabase utilities - consolidated from multiple files
 */
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side singleton pattern
let clientInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (clientInstance) return clientInstance

  clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)

  return clientInstance
}

// Server-side client with service role for admin operations
export function getServiceClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Helper for server components
export async function getServerSupabase() {
  "use server"
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Health check function
export async function checkSupabaseConnection() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("health_check").select("*").limit(1)

    if (error) throw error
    return { success: true, message: "Supabase connection successful" }
  } catch (error) {
    console.error("Supabase connection error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error connecting to Supabase",
    }
  }
}

// Execute SQL with error handling
export async function executeSql(sql: string, params: any[] = []) {
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql, params })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("SQL execution error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error executing SQL",
    }
  }
}
