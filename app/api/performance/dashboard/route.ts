import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET(request: Request) {
  try {
    // Only allow in production or when explicitly enabled
    if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== "true") {
      return NextResponse.json({ success: false, message: "Performance monitoring is disabled" }, { status: 400 })
    }

    // Get the URL parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"

    // Calculate the start date based on the time range
    const now = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case "1d":
        startDate.setDate(now.getDate() - 1)
        break
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Format dates for SQL query
    const startDateStr = startDate.toISOString()
    const endDateStr = now.toISOString()

    // Get core web vitals data
    const { data: coreVitalsData, error: coreVitalsError } = await supabase
      .from("performance_metrics_daily")
      .select("*")
      .in("metric_name", ["LCP", "FCP", "CLS", "TTFB"])
      .gte("day", startDateStr)
      .lte("day", endDateStr)
      .order("day", { ascending: true })

    if (coreVitalsError) {
      console.error("Error fetching core vitals:", coreVitalsError)
      return NextResponse.json({ success: false, message: "Failed to fetch core vitals data" }, { status: 500 })
    }

    // Get resource metrics data
    const { data: resourceData, error: resourceError } = await supabase
      .from("performance_metrics")
      .select("*")
      .like("metric_name", "resource-%")
      .gte("timestamp", startDateStr)
      .lte("timestamp", endDateStr)

    if (resourceError) {
      console.error("Error fetching resource metrics:", resourceError)
      return NextResponse.json({ success: false, message: "Failed to fetch resource metrics data" }, { status: 500 })
    }

    // Get page metrics data
    const { data: pageData, error: pageError } = await supabase
      .from("performance_metrics_by_page")
      .select("*")
      .in("metric_name", ["LCP", "FCP", "CLS", "TTFB"])
      .gte("day", startDateStr)
      .lte("day", endDateStr)

    if (pageError) {
      console.error("Error fetching page metrics:", pageError)
      return NextResponse.json({ success: false, message: "Failed to fetch page metrics data" }, { status: 500 })
    }

    // Process core vitals data
    const coreVitals = processWebVitalsData(coreVitalsData || [])

    // Process resource metrics data
    const resourceMetrics = processResourceData(resourceData || [])

    // Process page metrics data
    const pageMetrics = processPageData(pageData || [])

    return NextResponse.json({
      success: true,
      coreVitals,
      resourceMetrics,
      pageMetrics,
    })
  } catch (error) {
    console.error("Error processing performance dashboard data:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// Helper functions to process the data
function processWebVitalsData(data: any[]) {
  const metricsByName: Record<string, any[]> = {}

  // Group by metric name
  data.forEach((item) => {
    if (!metricsByName[item.metric_name]) {
      metricsByName[item.metric_name] = []
    }

    metricsByName[item.metric_name].push({
      date: formatDate(item.day),
      value: item.avg_value,
    })
  })

  // Convert to array format
  return Object.entries(metricsByName).map(([name, data]) => ({
    name,
    data,
  }))
}

function processResourceData(data: any[]) {
  const resourceTypes: Record<string, number[]> = {}

  // Group by resource type
  data.forEach((item) => {
    if (!resourceTypes[item.metric_name]) {
      resourceTypes[item.metric_name] = []
    }

    resourceTypes[item.metric_name].push(item.metric_value)
  })

  // Calculate average for each resource type
  return Object.entries(resourceTypes).map(([name, values]) => {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length

    return {
      name,
      data: [{ date: "Current", value: avg }],
    }
  })
}

function processPageData(data: any[]) {
  const pageMetrics: Record<string, Record<string, any>> = {}

  // Group by page path and metric name
  data.forEach((item) => {
    const path = item.path || "/"

    if (!pageMetrics[path]) {
      pageMetrics[path] = {}
    }

    pageMetrics[path][item.metric_name] = {
      avg: item.avg_value,
      p75: item.p75_value,
      p95: item.p95_value,
      samples: item.sample_count,
      rating: item.common_rating,
    }
  })

  // Convert to array format
  return Object.entries(pageMetrics).map(([path, metrics]) => ({
    path,
    metrics,
  }))
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
