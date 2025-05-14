import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-service"
import type { PerformanceMetric } from "@/lib/performance-monitoring"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const metric: PerformanceMetric = await request.json()

    // Validate the metric
    if (!metric || !metric.name || typeof metric.value !== "number") {
      return NextResponse.json({ success: false, message: "Invalid metric data" }, { status: 400 })
    }

    // Insert the metric into the database
    const { error } = await supabase.from("performance_metrics").insert({
      metric_name: metric.name,
      metric_value: metric.value,
      rating: metric.rating,
      path: metric.path || null,
      user_agent: metric.userAgent || null,
      navigation_type: metric.navigationType || null,
      metric_id: metric.id || null,
      timestamp: new Date(metric.timestamp).toISOString(),
    })

    if (error) {
      console.error("Error storing test metric:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Test metric stored successfully" })
  } catch (error: any) {
    console.error("Error processing test metric:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
