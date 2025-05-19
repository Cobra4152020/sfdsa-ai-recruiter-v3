// Remove dynamic export for static compatibility
// export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"
import type { PerformanceMetric } from "@/lib/performance-monitoring"

export async function POST(request: Request) {
  try {
    // For static export or when monitoring is disabled, log to console in development
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" || 
        (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== "true")) {
      
      // Parse the metric
      const metric: PerformanceMetric = await request.json()

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log("[Performance Metric]", metric)
      }

      return NextResponse.json({ 
        success: true, 
        message: "Performance metric logged (static mode)",
        source: 'static'
      })
    }

    // Parse the request body
    const metric: PerformanceMetric = await request.json()

    // Validate the metric
    if (!metric || !metric.name || typeof metric.value !== "number") {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid metric data",
        source: 'error'
      }, { status: 400 })
    }

    try {
      // Insert the metric into the database
      const { error } = await getServiceSupabase.from("performance_metrics").insert({
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
    console.error("Error recording performance metric:", error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to record metric",
      source: 'error'
    }, { status: 500 })
  }
}
