
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET(request: Request) {
  try {
    // Only allow in production or when explicitly enabled
    if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== "true") {
      return NextResponse.json({ success: false, message: "Performance monitoring is disabled" }, { status: 400 })
    }

    // Parse query parameters
    const url = new URL(request.url)
    const timeRange = url.searchParams.get("timeRange") || "7d"
    const journeyName = url.searchParams.get("journey") || "all"

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "7d":
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
    }

    const startDateStr = startDate.toISOString()

    // Fetch journey summaries
    let journeySummaryQuery = supabase.from("journey_performance_summary").select("*")

    // Fetch journey steps
    let journeyStepsQuery = supabase.from("journey_step_performance").select("*")

    // Fetch journey funnels
    let journeyFunnelQuery = supabase.from("journey_funnel_analysis").select("*")

    // Apply journey filter if specified
    if (journeyName !== "all") {
      journeySummaryQuery = journeySummaryQuery.eq("journey_name", journeyName)
      journeyStepsQuery = journeyStepsQuery.eq("journey_name", journeyName)
      journeyFunnelQuery = journeyFunnelQuery.eq("journey_name", journeyName)
    }

    // Execute queries
    const [summariesResponse, stepsResponse, funnelsResponse] = await Promise.all([
      journeySummaryQuery,
      journeyStepsQuery,
      journeyFunnelQuery,
    ])

    // Check for errors
    if (summariesResponse.error) {
      console.error("Error fetching journey summaries:", summariesResponse.error)
      return NextResponse.json({ success: false, message: "Failed to fetch journey summaries" }, { status: 500 })
    }

    if (stepsResponse.error) {
      console.error("Error fetching journey steps:", stepsResponse.error)
      return NextResponse.json({ success: false, message: "Failed to fetch journey steps" }, { status: 500 })
    }

    if (funnelsResponse.error) {
      console.error("Error fetching journey funnels:", funnelsResponse.error)
      return NextResponse.json({ success: false, message: "Failed to fetch journey funnels" }, { status: 500 })
    }

    // Return the data
    return NextResponse.json({
      success: true,
      summaries: summariesResponse.data || [],
      steps: stepsResponse.data || [],
      funnels: funnelsResponse.data || [],
    })
  } catch (error) {
    console.error("Error processing journey data request:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
