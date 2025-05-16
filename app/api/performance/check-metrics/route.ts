
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-service"

export async function GET() {
  try {
    const supabase = getServiceSupabase()

    // Check if the table exists
    const { data: tableExists, error: tableCheckError } = await supabase.rpc("table_exists", {
      table_name: "performance_metrics",
    })

    if (tableCheckError || !tableExists) {
      return NextResponse.json({
        success: false,
        message: "Performance metrics table does not exist",
        error: tableCheckError?.message,
      })
    }

    // Get the count of metrics
    const { count, error: countError } = await supabase
      .from("performance_metrics")
      .select("*", { count: "exact", head: true })

    if (countError) {
      return NextResponse.json({
        success: false,
        message: "Failed to count metrics",
        error: countError.message,
      })
    }

    // Get the latest metrics
    const { data: latestMetrics, error: metricsError } = await supabase
      .from("performance_metrics")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(10)

    if (metricsError) {
      return NextResponse.json({
        success: false,
        message: "Failed to retrieve latest metrics",
        error: metricsError.message,
      })
    }

    return NextResponse.json({
      success: true,
      count,
      latestMetrics,
    })
  } catch (error: any) {
    console.error("Error checking metrics:", error)
    return NextResponse.json({
      success: false,
      message: "Error checking metrics",
      error: error.message,
    })
  }
}
