import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-service"
import { revalidatePath } from "next/cache"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function generateStaticParams() {
  // Add dummy params for testing
  return []
}

export async function POST(request: Request) {
  try {
    const { query, revalidatePaths = [] } = await request.json()
    const supabase = getServiceSupabase()

    // Execute the SQL query using the exec_sql RPC function
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: query })

    if (error) {
      console.error("Error executing SQL query:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
        query,
      }, { status: 500 })
    }

    // Revalidate any paths that might be affected by this query
    if (revalidatePaths.length > 0) {
      revalidatePaths.forEach((path) => revalidatePath(path))
    }

    return NextResponse.json({
      success: true,
      data,
      query,
    })
  } catch (error) {
    console.error("Unexpected error executing SQL query:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      query,
    }, { status: 500 })
  }
} 