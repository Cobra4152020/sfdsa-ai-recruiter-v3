import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-clients"
import { supabaseAdmin } from "@/lib/supabase-service"

export async function GET(request: Request) {
  try {
    // Check if the user is authenticated and has admin privileges
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Verify admin role
    const { data: userTypeData } = await supabase
      .from("user_types")
      .select("user_type")
      .eq("user_id", session.user.id)
      .single()

    if (!userTypeData || userTypeData.user_type !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
    }

    // Get query parameters
    const url = new URL(request.url)
    const timeRange = url.searchParams.get("timeRange") || "7d"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case "24h":
        startDate.setHours(startDate.getHours() - 24)
        break
      case "7d":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30d":
        startDate.setDate(startDate.getDate() - 30)
        break
      case "90d":
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Get login metrics
    const { data: loginMetrics, error: metricsError } = await supabaseAdmin
      .from("login_metrics")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })

    if (metricsError) {
      console.error("Error fetching login metrics:", metricsError)
      return NextResponse.json({ success: false, message: "Failed to fetch login metrics" }, { status: 500 })
    }

    // Get recent login errors
    const { data: loginErrors, error: errorsError } = await supabaseAdmin
      .from("login_errors")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (errorsError) {
      console.error("Error fetching login errors:", errorsError)
      return NextResponse.json({ success: false, message: "Failed to fetch login errors" }, { status: 500 })
    }

    // Process and aggregate the data
    const totalLogins = loginMetrics.length
    const successfulLogins = loginMetrics.filter((m) => m.success).length
    const failedLogins = totalLogins - successfulLogins

    // Calculate average response time
    const avgResponseTime =
      loginMetrics.filter((m) => m.response_time_ms).reduce((sum, m) => sum + (m.response_time_ms || 0), 0) /
        loginMetrics.filter((m) => m.response_time_ms).length || 0

    // Count by role
    const byRole = loginMetrics.reduce(
      (acc, m) => {
        acc[m.user_role] = (acc[m.user_role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Count by method
    const byMethod = loginMetrics.reduce(
      (acc, m) => {
        acc[m.login_method] = (acc[m.login_method] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Format recent errors
    const recentErrors = loginErrors.map((e) => ({
      created_at: e.created_at,
      error_type: e.error_type,
      error_message: e.error_message,
      details: e.details,
    }))

    // Get unique users
    const uniqueUserIds = new Set(loginMetrics.map((m) => m.user_id).filter(Boolean))

    // Group by day
    const byDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const day = date.toLocaleDateString("en-US", { weekday: "short" })

      const dayMetrics = loginMetrics.filter((m) => {
        const metricDate = new Date(m.created_at)
        return (
          metricDate.getDate() === date.getDate() &&
          metricDate.getMonth() === date.getMonth() &&
          metricDate.getFullYear() === date.getFullYear()
        )
      })

      const count = dayMetrics.length
      const successCount = dayMetrics.filter((m) => m.success).length
      const successRate = count > 0 ? (successCount / count) * 100 : 0

      return {
        day,
        count,
        success_rate: Number.parseFloat(successRate.toFixed(1)),
      }
    }).reverse()

    return NextResponse.json({
      success: true,
      data: {
        total_logins: totalLogins,
        successful_logins: successfulLogins,
        failed_logins: failedLogins,
        avg_response_time_ms: Math.round(avgResponseTime),
        unique_users: uniqueUserIds.size,
        by_role: byRole,
        by_method: byMethod,
        recent_errors: recentErrors,
        by_day: byDay,
      },
    })
  } catch (error) {
    console.error("Unexpected error in login audit API:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
