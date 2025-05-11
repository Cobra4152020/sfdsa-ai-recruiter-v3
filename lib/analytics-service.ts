import { supabaseAdmin } from "./supabase-service"
import { format, subDays, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns"

// Types for analytics data
export interface UserGrowthData {
  date: string
  total: number
  recruits: number
  volunteers: number
}

export interface UserEngagementData {
  date: string
  active_users: number
  average_session_time: number
  interactions: number
}

export interface ConversionData {
  volunteer_id: string
  volunteer_name: string
  referrals: number
  conversions: number
  conversion_rate: number
}

export interface GeographicData {
  zip_code: string
  count: number
  latitude?: number
  longitude?: number
}

export interface RetentionData {
  cohort: string
  users: number
  week1: number
  week2: number
  week3: number
  week4: number
  week5: number
  week6: number
  week7: number
  week8: number
}

export interface BadgeDistributionData {
  badge_id: string
  badge_name: string
  count: number
  percentage: number
}

export interface UserActivitySummary {
  activity_type: string
  count: number
  percentage: number
}

/**
 * Get user growth data for the specified period
 */
export async function getUserGrowthData(
  period: "week" | "month" | "quarter" | "year" = "month",
): Promise<UserGrowthData[]> {
  let startDate: Date
  const endDate = new Date()

  // Calculate start date based on period
  switch (period) {
    case "week":
      startDate = subDays(endDate, 7)
      break
    case "month":
      startDate = subDays(endDate, 30)
      break
    case "quarter":
      startDate = subDays(endDate, 90)
      break
    case "year":
      startDate = subDays(endDate, 365)
      break
    default:
      startDate = subDays(endDate, 30)
  }

  try {
    // Query for user growth data
    const { data, error } = await supabaseAdmin.rpc("get_user_growth_data", {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      period_interval: period,
    })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching user growth data:", error)
    throw error
  }
}

/**
 * Get user engagement data for the specified period
 */
export async function getUserEngagementData(
  period: "week" | "month" | "quarter" | "year" = "month",
): Promise<UserEngagementData[]> {
  let startDate: Date
  const endDate = new Date()

  // Calculate start date based on period
  switch (period) {
    case "week":
      startDate = subDays(endDate, 7)
      break
    case "month":
      startDate = subDays(endDate, 30)
      break
    case "quarter":
      startDate = subDays(endDate, 90)
      break
    case "year":
      startDate = subDays(endDate, 365)
      break
    default:
      startDate = subDays(endDate, 30)
  }

  try {
    // Query for user engagement data
    const { data, error } = await supabaseAdmin.rpc("get_user_engagement_data", {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      period_interval: period,
    })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching user engagement data:", error)
    throw error
  }
}

/**
 * Get conversion data for volunteer recruiters
 */
export async function getConversionData(
  period: "month" | "quarter" | "year" = "month",
  limit = 10,
): Promise<ConversionData[]> {
  let startDate: Date
  const endDate = new Date()

  // Calculate start date based on period
  switch (period) {
    case "month":
      startDate = subDays(endDate, 30)
      break
    case "quarter":
      startDate = subDays(endDate, 90)
      break
    case "year":
      startDate = subDays(endDate, 365)
      break
    default:
      startDate = subDays(endDate, 30)
  }

  try {
    // Query for conversion data
    const { data, error } = await supabaseAdmin.rpc("get_volunteer_conversion_data", {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      result_limit: limit,
    })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching conversion data:", error)
    throw error
  }
}

/**
 * Get geographic distribution of users
 */
export async function getGeographicData(userType: "all" | "recruit" | "volunteer" = "all"): Promise<GeographicData[]> {
  try {
    // Query for geographic data
    const { data, error } = await supabaseAdmin.rpc("get_geographic_distribution", {
      user_type: userType,
    })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching geographic data:", error)
    throw error
  }
}

/**
 * Get user retention data
 */
export async function getRetentionData(months = 6): Promise<RetentionData[]> {
  try {
    const endDate = new Date()
    const startDate = subDays(endDate, months * 30)

    // Query for retention data
    const { data, error } = await supabaseAdmin.rpc("get_user_retention_data", {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching retention data:", error)
    throw error
  }
}

/**
 * Get badge distribution data
 */
export async function getBadgeDistributionData(): Promise<BadgeDistributionData[]> {
  try {
    // Query for badge distribution data
    const { data, error } = await supabaseAdmin.rpc("get_badge_distribution_data")

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching badge distribution data:", error)
    throw error
  }
}

/**
 * Get user activity summary
 */
export async function getUserActivitySummary(
  period: "week" | "month" | "quarter" | "year" = "month",
): Promise<UserActivitySummary[]> {
  let startDate: Date
  const endDate = new Date()

  // Calculate start date based on period
  switch (period) {
    case "week":
      startDate = subDays(endDate, 7)
      break
    case "month":
      startDate = subDays(endDate, 30)
      break
    case "quarter":
      startDate = subDays(endDate, 90)
      break
    case "year":
      startDate = subDays(endDate, 365)
      break
    default:
      startDate = subDays(endDate, 30)
  }

  try {
    // Query for user activity summary
    const { data, error } = await supabaseAdmin.rpc("get_user_activity_summary", {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching user activity summary:", error)
    throw error
  }
}

/**
 * Generate monthly report data
 */
export async function generateMonthlyReport(month: Date = new Date()): Promise<any> {
  const firstDay = startOfMonth(month)
  const lastDay = endOfMonth(month)

  try {
    // Query for monthly report data
    const { data, error } = await supabaseAdmin.rpc("generate_monthly_report", {
      start_date: firstDay.toISOString(),
      end_date: lastDay.toISOString(),
    })

    if (error) throw error

    return data || {}
  } catch (error) {
    console.error("Error generating monthly report:", error)
    throw error
  }
}

/**
 * Export data as CSV
 */
export function exportAsCSV(data: any[], filename: string): string {
  if (!data || data.length === 0) {
    return ""
  }

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create CSV header row
  let csv = headers.join(",") + "\n"

  // Add data rows
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header]
      // Handle values that need quotes (strings with commas, quotes, or newlines)
      if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csv += values.join(",") + "\n"
  })

  return csv
}

/**
 * Get available months for reports
 */
export function getAvailableMonths(months = 12): { label: string; value: string }[] {
  const endDate = new Date()
  const startDate = subDays(endDate, months * 30)

  const monthsRange = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  })

  return monthsRange
    .map((date) => ({
      label: format(date, "MMMM yyyy"),
      value: date.toISOString(),
    }))
    .reverse()
}
