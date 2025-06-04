import { format, subDays, eachMonthOfInterval } from "date-fns";
import { mockAnalyticsData } from "./mock-analytics-data";
import type { UserActivitySummary } from "@/app/types/analytics";

// Types for analytics data
export interface UserGrowthData {
  date: string;
  total: number;
  recruits: number;
  volunteers: number;
}

export interface UserEngagementData {
  date: string;
  active_users: number;
  average_session_time: number;
  interactions: number;
}

export interface ConversionData {
  volunteer_id: string;
  volunteer_name: string;
  referrals: number;
  conversions: number;
  conversion_rate: number;
}

export interface GeographicData {
  zip_code: string;
  count: number;
  latitude?: number;
  longitude?: number;
}

export interface RetentionData {
  cohort: string;
  users: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  week6: number;
  week7: number;
  week8: number;
}

export interface BadgeDistributionData {
  badge_id: string;
  badge_name: string;
  count: number;
  percentage: number;
}

export type Period = "week" | "month" | "quarter" | "year";

// Error types
export class AnalyticsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalyticsError";
  }
}

// Response types
export interface AnalyticsResponse<T> {
  data: T;
  error?: string;
}

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new AnalyticsError(error.message || "Failed to fetch analytics data");
  }
  return response.json();
}

/**
 * Get user growth data for the specified period
 */
export async function getUserGrowthData(
  period: Period,
): Promise<UserGrowthData[]> {
  try {
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      return mockAnalyticsData.growth[period];
    }
    return handleApiResponse<UserGrowthData[]>(
      await fetch(`/api/analytics?type=growth&period=${period}`),
    );
  } catch (error) {
    console.error("Error fetching growth data:", error);
    throw new AnalyticsError(
      error instanceof Error ? error.message : "Failed to fetch growth data",
    );
  }
}

/**
 * Get user engagement data for the specified period
 */
export async function getUserEngagementData(
  period: Period,
): Promise<UserEngagementData[]> {
  try {
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      return mockAnalyticsData.engagement[period];
    }
    return handleApiResponse<UserEngagementData[]>(
      await fetch(`/api/analytics?type=engagement&period=${period}`),
    );
  } catch (error) {
    console.error("Error fetching engagement data:", error);
    throw new AnalyticsError(
      error instanceof Error
        ? error.message
        : "Failed to fetch engagement data",
    );
  }
}

/**
 * Get conversion data for volunteer recruiters
 */
export async function getConversionData(
  period: Period,
): Promise<ConversionData[]> {
  try {
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      return mockAnalyticsData.conversion;
    }
    return handleApiResponse<ConversionData[]>(
      await fetch(`/api/analytics?type=conversion&period=${period}`),
    );
  } catch (error) {
    console.error("Error fetching conversion data:", error);
    throw new AnalyticsError(
      error instanceof Error
        ? error.message
        : "Failed to fetch conversion data",
    );
  }
}

/**
 * Get geographic distribution of users
 */
export async function getGeographicData(): Promise<GeographicData[]> {
  try {
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      return mockAnalyticsData.geographic;
    }
    return handleApiResponse<GeographicData[]>(
      await fetch("/api/analytics?type=geographic"),
    );
  } catch (error) {
    console.error("Error fetching geographic data:", error);
    throw new AnalyticsError(
      error instanceof Error
        ? error.message
        : "Failed to fetch geographic data",
    );
  }
}

/**
 * Get user retention data
 */
export async function getRetentionData(
  weeks: number,
): Promise<RetentionData[]> {
  try {
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      return mockAnalyticsData.retention.slice(0, weeks);
    }
    return handleApiResponse<RetentionData[]>(
      await fetch(`/api/analytics?type=retention&weeks=${weeks}`),
    );
  } catch (error) {
    console.error("Error fetching retention data:", error);
    throw new AnalyticsError(
      error instanceof Error ? error.message : "Failed to fetch retention data",
    );
  }
}

/**
 * Get badge distribution data
 */
export async function getBadgeDistributionData(): Promise<
  BadgeDistributionData[]
> {
  try {
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      return mockAnalyticsData.badges;
    }
    return handleApiResponse<BadgeDistributionData[]>(
      await fetch("/api/analytics?type=badges"),
    );
  } catch (error) {
    console.error("Error fetching badge data:", error);
    throw new AnalyticsError(
      error instanceof Error ? error.message : "Failed to fetch badge data",
    );
  }
}

/**
 * Get user activity summary
 */
export async function getUserActivitySummary(
  period: Period,
): Promise<UserActivitySummary[]> {
  try {
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      return mockAnalyticsData.activity[period];
    }
    return handleApiResponse<UserActivitySummary[]>(
      await fetch(`/api/analytics?type=activity&period=${period}`),
    );
  } catch (error) {
    console.error("Error fetching activity data:", error);
    throw new AnalyticsError(
      error instanceof Error ? error.message : "Failed to fetch activity data",
    );
  }
}

export interface TopAction {
  action: string;
  count: number;
}

export interface TopConversionPath {
  path: string;
  count: number;
}

export interface TopRevenueSource {
  source: string;
  amount: number;
}

export interface EngagementMetrics {
  totalActions: number;
  averageActionsPerUser: number;
  topActions: TopAction[];
}

export interface ConversionMetrics {
  totalConversions: number;
  conversionRate: number;
  topConversionPaths: TopConversionPath[];
}

export interface RevenueMetrics {
  totalRevenue: number;
  averageRevenuePerUser: number;
  topRevenueSources: TopRevenueSource[];
}

export interface MonthlyReport {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  engagementMetrics: EngagementMetrics;
  conversionMetrics: ConversionMetrics;
  revenueMetrics?: RevenueMetrics;
}

/**
 * Generate monthly report data
 */
export async function generateMonthlyReport(
  month: Date = new Date(),
): Promise<MonthlyReport> {
  try {
    return handleApiResponse<MonthlyReport>(
      await fetch(
        `/api/analytics?type=monthly-report&month=${month.toISOString()}`,
      ),
    );
  } catch (error) {
    console.error("Error generating monthly report:", error);
    throw new AnalyticsError(
      error instanceof Error
        ? error.message
        : "Failed to generate monthly report",
    );
  }
}

/**
 * Export data as CSV
 */
export function exportAsCSV(
  data: Array<Record<string, string | number | boolean>>,
  filename: string, // eslint-disable-line @typescript-eslint/no-unused-vars
): string {
  if (!data || data.length === 0) {
    return "";
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV header row
  let csv = headers.join(",") + "\n";

  // Add data rows
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Handle values that need quotes (strings with commas, quotes, or newlines)
      if (
        typeof value === "string" &&
        (value.includes(",") || value.includes('"') || value.includes("\n"))
      ) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csv += values.join(",") + "\n";
  });

  return csv;
}

export interface MonthOption {
  label: string;
  value: string;
}

/**
 * Get available months for reports
 */
export function getAvailableMonths(months = 12): MonthOption[] {
  const endDate = new Date();
  const startDate = subDays(endDate, months * 30);

  const monthsRange = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  });

  return monthsRange
    .map((date) => ({
      label: format(date, "MMMM yyyy"),
      value: date.toISOString(),
    }))
    .reverse();
}
