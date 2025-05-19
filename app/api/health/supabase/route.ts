import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"
import { API_CACHE_HEADERS } from "@/lib/cache-utils"

export const dynamic = "force-static"
export const revalidate = 3600 // Revalidate every hour

interface TableCheckResult {
  table: string
  exists: boolean
  error: string | null
  responseTimeMs?: number
}

interface PermissionsCheck {
  success: boolean
  error: string | null
}

export async function GET() {
  const startTime = Date.now()
  try {
    const supabase = getServiceSupabase()
    const connectionTime = Date.now() - startTime

    // Test database connection with a simple query
    const { data: connectionTest, error: connectionError } = await supabase
      .from("users")
      .select("count")
      .limit(1)
      .single()

    if (connectionError) {
      return NextResponse.json(
        {
          success: false,
          message: `Supabase connection error: ${connectionError.message}`,
          details: {
            error: connectionError,
            connectionTimeMs: connectionTime,
          },
        },
        { status: 500, headers: API_CACHE_HEADERS },
      )
    }

    // Check required tables
    const requiredTables = [
      "users",
      "badges",
      "user_badges",
      "user_activities",
      "user_nft_awards",
      "leaderboard",
      "performance_metrics",
    ]

    const tableChecks: TableCheckResult[] = []

    for (const table of requiredTables) {
      const tableStartTime = Date.now()
      const { error: tableError } = await supabase.from(table).select("count").limit(1)

      tableChecks.push({
        table,
        exists: !tableError,
        error: tableError ? tableError.message : null,
        responseTimeMs: Date.now() - tableStartTime,
      })
    }

    const missingTables = tableChecks.filter((check) => !check.exists)

    // Check permissions by attempting a write operation to a test table
    let permissionsCheck: PermissionsCheck = { success: true, error: null }
    try {
      // Try to insert and immediately delete a test record
      const testTable = "performance_metrics" // Using an existing table that should allow writes
      const { error: insertError, data: insertData } = await supabase
        .from(testTable)
        .insert({
          page_url: "/health-check",
          event_name: "health_check",
          value: 0,
          user_id: "health-check",
          timestamp: new Date().toISOString(),
        })
        .select()

      if (insertError) {
        permissionsCheck = {
          success: false,
          error: `Write permission error: ${insertError.message}`,
        }
      } else if (insertData && insertData.length > 0) {
        // Delete the test record
        const { error: deleteError } = await supabase.from(testTable).delete().eq("id", insertData[0].id)

        if (deleteError) {
          permissionsCheck = {
            success: false,
            error: `Delete permission error: ${deleteError.message}`,
          }
        }
      }
    } catch (error: any) {
      permissionsCheck = {
        success: false,
        error: `Permission check error: ${error.message}`,
      }
    }

    // Calculate total response time
    const totalResponseTime = Date.now() - startTime

    // Determine overall status
    const isHealthy = missingTables.length === 0 && permissionsCheck.success

    return NextResponse.json(
      {
        success: isHealthy,
        message: isHealthy ? "Supabase connection is healthy" : "Supabase connection has issues",
        details: {
          connectionTimeMs: connectionTime,
          totalResponseTimeMs: totalResponseTime,
          tablesChecked: tableChecks,
          missingTables: missingTables.map((t) => t.table),
          permissions: permissionsCheck,
          environment: {
            hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          },
        },
      },
      {
        status: isHealthy ? 200 : 500,
        headers: API_CACHE_HEADERS,
      },
    )
  } catch (error: any) {
    const totalResponseTime = Date.now() - startTime

    return NextResponse.json(
      {
        success: false,
        message: `Supabase health check failed: ${error.message}`,
        details: {
          error: error.message,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
          totalResponseTimeMs: totalResponseTime,
        },
      },
      { status: 500, headers: API_CACHE_HEADERS },
    )
  }
}
