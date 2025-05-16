
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"
import { API_CACHE_HEADERS } from "@/lib/cache-utils"

export async function GET() {
  try {
    const supabase = getServiceSupabase()

    // Test database connection
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      return NextResponse.json(
        { success: false, message: `Database connection error: ${error.message}` },
        { status: 500, headers: API_CACHE_HEADERS },
      )
    }

    // Check required tables
    const requiredTables = ["users", "badges", "user_activities", "user_nft_awards"]
    const tableChecks = []

    for (const table of requiredTables) {
      const { error: tableError } = await supabase.from(table).select("count").limit(1)
      tableChecks.push({
        table,
        exists: !tableError,
        error: tableError ? tableError.message : null,
      })
    }

    const missingTables = tableChecks.filter((check) => !check.exists)

    if (missingTables.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required tables: ${missingTables.map((t) => t.table).join(", ")}`,
          details: tableChecks,
        },
        { status: 500, headers: API_CACHE_HEADERS },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Database connection successful",
        details: tableChecks,
      },
      { headers: API_CACHE_HEADERS },
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Database health check failed: ${error}` },
      { status: 500, headers: API_CACHE_HEADERS },
    )
  }
}
