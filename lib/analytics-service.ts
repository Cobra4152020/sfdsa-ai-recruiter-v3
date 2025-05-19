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
  const response = await fetch(`/api/analytics?type=growth&period=${period}`);
  if (!response.ok) throw new Error('Failed to fetch growth data');
  return response.json();
}

/**
 * Get user engagement data for the specified period
 */
export async function getUserEngagementData(period: Period): Promise<UserEngagementData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.engagement[period];
  }
  const response = await fetch(`/api/analytics?type=engagement&period=${period}`);
  if (!response.ok) throw new Error('Failed to fetch engagement data');
  return response.json();
}

/**
 * Get conversion data for volunteer recruiters
 */
export async function getConversionData(period: Period): Promise<ConversionData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.conversion;
  }
  const response = await fetch(`/api/analytics?type=conversion&period=${period}`);
  if (!response.ok) throw new Error('Failed to fetch conversion data');
  return response.json();
}

/**
 * Get geographic distribution of users
 */
export async function getGeographicData(): Promise<GeographicData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.geographic;
  }
  const response = await fetch('/api/analytics?type=geographic');
  if (!response.ok) throw new Error('Failed to fetch geographic data');
  return response.json();
}

/**
 * Get user retention data
 */
export async function getRetentionData(weeks: number): Promise<RetentionData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.retention.slice(0, weeks);
  }
  const response = await fetch(`/api/analytics?type=retention&weeks=${weeks}`);
  if (!response.ok) throw new Error('Failed to fetch retention data');
  return response.json();
}

/**
 * Get badge distribution data
 */
export async function getBadgeDistributionData(): Promise<BadgeDistributionData[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.badges;
  }
  const response = await fetch('/api/analytics?type=badges');
  if (!response.ok) throw new Error('Failed to fetch badge data');
  return response.json();
}

/**
 * Get user activity summary
 */
export async function getUserActivitySummary(period: Period): Promise<UserActivitySummary[]> {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
    return mockAnalyticsData.activity[period];
  }
  const response = await fetch(`/api/analytics?type=activity&period=${period}`);
  if (!response.ok) throw new Error('Failed to fetch activity data');
  return response.json();
}

/**
 * Generate monthly report data
 */
export async function generateMonthlyReport(month: Date = new Date()): Promise<any> {
  const response = await fetch(`/api/analytics?type=monthly-report&month=${month.toISOString()}`);
  if (!response.ok) throw new Error('Failed to generate monthly report');
  return response.json();
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
