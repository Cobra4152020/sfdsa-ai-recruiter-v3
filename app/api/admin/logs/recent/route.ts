import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const component = url.searchParams.get("component")
    const level = url.searchParams.get("level")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50", 10)

    // Get supabase client
    const supabase = getServiceSupabase()

    // Build query
    let query = supabase.from("system_logs").select("*").order("timestamp", { ascending: false }).limit(limit)

    // Add filters if provided
    if (component) {
      query = query.filter("context->component", "eq", component)
    }

    if (level) {
      query = query.eq("level", level)
    }

    // Execute query
    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      logs: data,
      count: data.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching logs:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch logs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
