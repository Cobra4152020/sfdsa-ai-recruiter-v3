import { supabaseAdmin } from "./supabase-service"
import { format, subDays, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns"
import { mockAnalyticsData } from './mock-analytics-data';

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

type Period = 'week' | 'month' | 'quarter' | 'year';

/**
 * Get user growth data for the specified period
 */
export async function getUserGrowthData(period: Period): Promise<UserGrowthData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.growth[period];
  }
  // Add your actual data fetching logic here
  return mockAnalyticsData.growth[period];
}

/**
 * Get user engagement data for the specified period
 */
export async function getUserEngagementData(period: Period): Promise<UserEngagementData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.engagement[period];
  }
  // Add your actual data fetching logic here
  return mockAnalyticsData.engagement[period];
}

/**
 * Get conversion data for volunteer recruiters
 */
export async function getConversionData(period: Period): Promise<ConversionData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.conversion;
  }
  // Add your actual data fetching logic here
  return mockAnalyticsData.conversion;
}

/**
 * Get geographic distribution of users
 */
export async function getGeographicData(): Promise<GeographicData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.geographic;
  }
  // Add your actual data fetching logic here
  return mockAnalyticsData.geographic;
}

/**
 * Get user retention data
 */
export async function getRetentionData(weeks: number): Promise<RetentionData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.retention.slice(0, weeks);
  }
  // Add your actual data fetching logic here
  return mockAnalyticsData.retention.slice(0, weeks);
}

/**
 * Get badge distribution data
 */
export async function getBadgeDistributionData(): Promise<BadgeDistributionData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.badges;
  }
  // Add your actual data fetching logic here
  return mockAnalyticsData.badges;
}

/**
 * Get user activity summary
 */
export async function getUserActivitySummary(period: Period): Promise<UserActivitySummary[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.activity[period];
  }
  // Add your actual data fetching logic here
  return mockAnalyticsData.activity[period];
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
