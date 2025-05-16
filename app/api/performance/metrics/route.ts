
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || getDefaultStartDate()
    const endDate = searchParams.get("endDate") || new Date().toISOString()
    const metricType = searchParams.get("metricType") || "all"
    const page = searchParams.get("page") || "all"

    // Build the query
    let query = supabase
      .from("performance_metrics")
      .select("*")
      .gte("timestamp", startDate)
      .lte("timestamp", endDate)
      .order("timestamp", { ascending: false })

    // Filter by metric type if specified
    if (metricType !== "all") {
      query = query.eq("metric_name", metricType)
    }

    // Filter by page if specified
    if (page !== "all") {
      query = query.eq("path", page)
    }

    // Execute the query
    const { data: metrics, error } = await query

    if (error) {
      console.error("Error fetching performance metrics:", error)
      return NextResponse.json({ success: false, message: "Failed to fetch performance metrics" }, { status: 500 })
    }

    // Get aggregated metrics by type
    const aggregatedMetrics = await getAggregatedMetrics(startDate, endDate)

    // Get metrics over time for trending
    const timeSeriesData = await getTimeSeriesData(startDate, endDate, metricType)

    // Get page performance data
    const pagePerformance = await getPagePerformance(startDate, endDate)

    // Get available pages and metric types for filtering
    const { pages, metricTypes } = await getFilterOptions()

    return NextResponse.json({
      success: true,
      metrics: metrics || [],
      aggregatedMetrics,
      timeSeriesData,
      pagePerformance,
      filterOptions: {
        pages,
        metricTypes,
      },
    })
  } catch (error) {
    console.error("Error processing performance metrics:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// Helper function to get default start date (7 days ago)
function getDefaultStartDate(): string {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date.toISOString()
}

// Get aggregated metrics (average, p75, p95) by type
async function getAggregatedMetrics(startDate: string, endDate: string) {
  const { data, error } = await supabase.rpc("get_aggregated_metrics", {
    start_date: startDate,
    end_date: endDate,
  })

  if (error) {
    console.error("Error fetching aggregated metrics:", error)

    // Fallback to manual aggregation if the RPC fails
    const { data: metricsData, error: metricsError } = await supabase
      .from("performance_metrics")
      .select("metric_name, metric_value")
      .gte("timestamp", startDate)
      .lte("timestamp", endDate)

    if (metricsError) {
      console.error("Error fetching metrics for manual aggregation:", metricsError)
      return []
    }

    // Group by metric name
    const metricsByName: Record<string, number[]> = {}
    metricsData?.forEach((metric) => {
      if (!metricsByName[metric.metric_name]) {
        metricsByName[metric.metric_name] = []
      }
      metricsByName[metric.metric_name].push(metric.metric_value)
    })

    // Calculate aggregates
    return Object.entries(metricsByName).map(([name, values]) => {
      values.sort((a, b) => a - b)
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length
      const p75Index = Math.floor(values.length * 0.75)
      const p95Index = Math.floor(values.length * 0.95)

      return {
        metric_name: name,
        avg_value: avg,
        p75_value: values[p75Index] || avg,
        p95_value: values[p95Index] || avg,
        sample_count: values.length,
      }
    })
  }

  return data || []
}

// Get time series data for trending charts
async function getTimeSeriesData(startDate: string, endDate: string, metricType: string) {
  // Create time buckets (daily)
  const buckets: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const currentDate = new Date(start)

  while (currentDate <= end) {
    buckets.push(currentDate.toISOString().split("T")[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Query for time series data
  let query = supabase
    .from("performance_metrics")
    .select("metric_name, metric_value, timestamp")
    .gte("timestamp", startDate)
    .lte("timestamp", endDate)

  if (metricType !== "all") {
    query = query.eq("metric_name", metricType)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching time series data:", error)
    return []
  }

  // Group by date and metric name
  const timeSeriesMap: Record<string, Record<string, number[]>> = {}

  buckets.forEach((bucket) => {
    timeSeriesMap[bucket] = {}
  })

  data?.forEach((item) => {
    const date = new Date(item.timestamp).toISOString().split("T")[0]
    if (!timeSeriesMap[date]) {
      timeSeriesMap[date] = {}
    }

    if (!timeSeriesMap[date][item.metric_name]) {
      timeSeriesMap[date][item.metric_name] = []
    }

    timeSeriesMap[date][item.metric_name].push(item.metric_value)
  })

  // Calculate daily averages
  return buckets.map((date) => {
    const metrics: Record<string, number> = { date }

    Object.entries(timeSeriesMap[date]).forEach(([metricName, values]) => {
      if (values.length > 0) {
        metrics[metricName] = values.reduce((sum, val) => sum + val, 0) / values.length
      }
    })

    return metrics
  })
}

// Get performance data by page
async function getPagePerformance(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from("performance_metrics")
    .select("path, metric_name, metric_value")
    .gte("timestamp", startDate)
    .lte("timestamp", endDate)
    .not("path", "is", null)

  if (error) {
    console.error("Error fetching page performance:", error)
    return []
  }

  // Group by page and metric name
  const pageMetrics: Record<string, Record<string, number[]>> = {}

  data?.forEach((item) => {
    if (!item.path) return

    if (!pageMetrics[item.path]) {
      pageMetrics[item.path] = {}
    }

    if (!pageMetrics[item.path][item.metric_name]) {
      pageMetrics[item.path][item.metric_name] = []
    }

    pageMetrics[item.path][item.metric_name].push(item.metric_value)
  })

  // Calculate aggregates by page
  return Object.entries(pageMetrics).map(([path, metrics]) => {
    const result: Record<string, any> = { path }

    Object.entries(metrics).forEach(([metricName, values]) => {
      values.sort((a, b) => a - b)
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length

      result[metricName] = {
        avg,
        count: values.length,
      }
    })

    return result
  })
}

// Get available pages and metric types for filtering
async function getFilterOptions() {
  // Get unique pages
  const { data: pageData, error: pageError } = await supabase
    .from("performance_metrics")
    .select("path")
    .not("path", "is", null)
    .order("path")

  if (pageError) {
    console.error("Error fetching unique pages:", pageError)
  }

  // Get unique metric types
  const { data: metricData, error: metricError } = await supabase
    .from("performance_metrics")
    .select("metric_name")
    .order("metric_name")

  if (metricError) {
    console.error("Error fetching unique metric types:", metricError)
  }

  // Extract unique values
  const pages = Array.from(new Set(pageData?.map((item) => item.path) || []))
  const metricTypes = Array.from(new Set(metricData?.map((item) => item.metric_name) || []))

  return { pages, metricTypes }
}
