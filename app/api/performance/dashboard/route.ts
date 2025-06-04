export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";

interface PerformanceMetric {
  day: string;
  metric_name: string;
  value: number;
  count: number;
}

// Generate static parameters for common time ranges
export function generateStaticParams() {
  const timeRanges = ["1d", "7d", "30d", "90d"];

  return timeRanges.map((timeRange) => ({ timeRange }));
}

export async function GET(request: Request) {
  try {
    // Only allow in production or when explicitly enabled
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== "true"
    ) {
      return NextResponse.json(
        { success: false, message: "Performance monitoring is disabled" },
        { status: 400 },
      );
    }

    // Get the URL parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "7d";

    // Calculate the start date based on the time range
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case "1d":
        startDate.setDate(now.getDate() - 1);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Generate mock data for the time range
    const mockData = generateMockData(startDate, now);

    return NextResponse.json({
      success: true,
      data: {
        coreVitals: mockData,
        timeRange,
        source: "static",
      },
    });
  } catch (error) {
    console.error("Error in performance dashboard API:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        source: "error",
      },
      { status: 500 },
    );
  }
}

function generateMockData(startDate: Date, endDate: Date): PerformanceMetric[] {
  const metrics = ["LCP", "FCP", "CLS", "TTFB"];
  const data: PerformanceMetric[] = [];

  // Generate daily data points
  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    metrics.forEach((metric) => {
      data.push({
        day: date.toISOString().split("T")[0],
        metric_name: metric,
        value: getRandomValue(metric),
        count: Math.floor(Math.random() * 1000) + 500,
      });
    });
  }

  return data;
}

function getRandomValue(metric: string): number {
  switch (metric) {
    case "LCP":
      return 2 + Math.random() * 1; // 2-3s
    case "FCP":
      return 1 + Math.random() * 0.5; // 1-1.5s
    case "CLS":
      return 0.05 + Math.random() * 0.1; // 0.05-0.15
    case "TTFB":
      return 0.5 + Math.random() * 0.5; // 0.5-1s
    default:
      return Math.random();
  }
}
