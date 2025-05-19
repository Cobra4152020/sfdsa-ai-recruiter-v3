import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"
import { startOfMonth, endOfMonth } from "date-fns"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const period = searchParams.get("period") as "week" | "month" | "quarter" | "year"

  try {
    switch (type) {
      case "growth":
        const { data: growthData, error: growthError } = await getServiceSupabase()
          .from("user_growth_stats")
          .select("*")
          .order("date", { ascending: true })
        if (growthError) throw growthError
        return NextResponse.json(growthData)

      case "engagement":
        const { data: engagementData, error: engagementError } = await getServiceSupabase()
          .from("user_engagement_stats")
          .select("*")
          .order("date", { ascending: true })
        if (engagementError) throw engagementError
        return NextResponse.json(engagementData)

      case "conversion":
        const { data: conversionData, error: conversionError } = await getServiceSupabase()
          .from("volunteer_conversion_stats")
          .select("*")
          .order("conversion_rate", { ascending: false })
        if (conversionError) throw conversionError
        return NextResponse.json(conversionData)

      case "geographic":
        const { data: geographicData, error: geographicError } = await getServiceSupabase()
          .from("user_geographic_stats")
          .select("*")
        if (geographicError) throw geographicError
        return NextResponse.json(geographicData)

      case "retention":
        const { data: retentionData, error: retentionError } = await getServiceSupabase()
          .from("user_retention_stats")
          .select("*")
          .order("cohort", { ascending: false })
        if (retentionError) throw retentionError
        return NextResponse.json(retentionData)

      case "badges":
        const { data: badgeData, error: badgeError } = await getServiceSupabase()
          .from("badge_distribution_stats")
          .select("*")
          .order("count", { ascending: false })
        if (badgeError) throw badgeError
        return NextResponse.json(badgeData)

      case "activity":
        const { data: activityData, error: activityError } = await getServiceSupabase()
          .from("user_activity_stats")
          .select("*")
          .order("count", { ascending: false })
        if (activityError) throw activityError
        return NextResponse.json(activityData)

      case "monthly-report":
        const month = new Date(searchParams.get("month") || new Date().toISOString())
        const firstDay = startOfMonth(month)
        const lastDay = endOfMonth(month)
        const { data: reportData, error: reportError } = await getServiceSupabase().rpc(
          "generate_monthly_report",
          {
            start_date: firstDay.toISOString(),
            end_date: lastDay.toISOString(),
          }
        )
        if (reportError) throw reportError
        return NextResponse.json(reportData)

      default:
        return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 