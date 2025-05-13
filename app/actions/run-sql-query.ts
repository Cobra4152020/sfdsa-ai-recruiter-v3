"use server"

import { getServiceSupabase } from "@/lib/supabase-service"
import { revalidatePath } from "next/cache"

export async function runSqlQuery(query: string, revalidatePaths: string[] = []) {
  try {
    const supabase = getServiceSupabase()

    // Execute the SQL query using the exec_sql RPC function
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: query })

    if (error) {
      console.error("Error executing SQL query:", error)
      return {
        success: false,
        error: error.message,
        query,
      }
    }

    // Revalidate any paths that might be affected by this query
    if (revalidatePaths.length > 0) {
      revalidatePaths.forEach((path) => revalidatePath(path))
    }

    return {
      success: true,
      data,
      query,
    }
  } catch (error) {
    console.error("Unexpected error executing SQL query:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      query,
    }
  }
}
