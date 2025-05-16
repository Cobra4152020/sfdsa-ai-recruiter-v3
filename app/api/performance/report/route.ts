
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-service"
import type { PerformanceMetric } from "@/lib/performance-monitoring"

export async function POST(request: Request) {
  try {
    // Only allow in production or when explicitly enabled
    if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== "true") {
      return NextResponse.json({ success: false, message: "Performance monitoring is disabled" }, { status: 400 })
    }

    // Parse the request body
    const metric: PerformanceMetric = await request.json()

    // Validate the metric
    if (!metric || !metric.name || typeof metric.value !== "number") {
      return NextResponse.json({ success: false, message: "Invalid metric data" }, { status: 400 })
    }

    try {
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
        // If the error is because the table doesn't exist, log it but don't treat as fatal
        if (error.message && error.message.includes("does not exist")) {
          console.log("Performance metrics table doesn't exist yet. Metrics will be logged to console only.")
          return NextResponse.json({ success: true, message: "Metric logged to console (table doesn't exist)" })
        }

        // If it's an RLS error, handle it gracefully
        if (error.message && error.message.includes("violates row-level security policy")) {
          console.log("RLS policy prevented metric insertion. This is expected for anonymous users.")
          return NextResponse.json({ success: true, message: "Metric logged to console (RLS policy)" })
        }

        console.error("Error storing performance metric:", error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error("Database operation failed:", dbError)
      // Return success anyway to avoid client-side errors
      return NextResponse.json({ success: true, message: "Metric logged to console (database error)" })
    }
  } catch (error) {
    console.error("Error processing performance metric:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
