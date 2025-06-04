"use client";

import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, LineChart, AreaChart } from "@/components/ui/charts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { addDays } from "date-fns";

type MetricData = {
  metric_name: string;
  avg_value: number;
  p75_value: number;
  p95_value: number;
  sample_count: number;
};

type TimeSeriesEntry = {
  date: string;
  [metric: string]: number | string;
};

type TimeSeriesData = TimeSeriesEntry[];

type PagePerformance = {
  path: string;
  [metric: string]: number | string;
};

type FilterOptions = {
  pages: string[];
  metricTypes: string[];
};

// Add static mock data for export build
const STATIC_MOCK_DATA = {
  aggregatedMetrics: [
    {
      metric_name: "LCP",
      avg_value: 2100,
      p75_value: 2400,
      p95_value: 2800,
      sample_count: 1000,
    },
    {
      metric_name: "FID",
      avg_value: 80,
      p75_value: 95,
      p95_value: 120,
      sample_count: 1000,
    },
    {
      metric_name: "CLS",
      avg_value: 0.08,
      p75_value: 0.12,
      p95_value: 0.15,
      sample_count: 1000,
    },
    {
      metric_name: "FCP",
      avg_value: 1500,
      p75_value: 1800,
      p95_value: 2200,
      sample_count: 1000,
    },
    {
      metric_name: "TTFB",
      avg_value: 600,
      p75_value: 750,
      p95_value: 900,
      sample_count: 1000,
    },
  ],
  timeSeriesData: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    LCP: 2000 + Math.random() * 200,
    FID: 75 + Math.random() * 20,
    CLS: 0.07 + Math.random() * 0.02,
    FCP: 1400 + Math.random() * 200,
    TTFB: 550 + Math.random() * 100,
  })),
  pagePerformance: [
    {
      path: "/",
      LCP: 1900,
      FID: 70,
      CLS: 0.06,
      FCP: 1300,
      TTFB: 500,
    },
    {
      path: "/dashboard",
      LCP: 2200,
      FID: 85,
      CLS: 0.09,
      FCP: 1600,
      TTFB: 650,
    },
  ],
  filterOptions: {
    pages: ["/", "/dashboard", "/profile", "/settings"],
    metricTypes: ["LCP", "FID", "CLS", "FCP", "TTFB"],
  },
};

export function PerformanceDashboard() {
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  // Filter states
  const [metricType, setMetricType] = useState<string>("all");
  const [page, setPage] = useState<string>("all");

  // Data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aggregatedMetrics, setAggregatedMetrics] = useState<MetricData[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData>([]);
  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    pages: [],
    metricTypes: [],
  });

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use static data for export build
      if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
        setAggregatedMetrics(STATIC_MOCK_DATA.aggregatedMetrics);
        setTimeSeriesData(STATIC_MOCK_DATA.timeSeriesData);
        setPagePerformance(STATIC_MOCK_DATA.pagePerformance);
        setFilterOptions(STATIC_MOCK_DATA.filterOptions);
        return;
      }

      const startDate =
        dateRange.from?.toISOString() || addDays(new Date(), -7).toISOString();
      const endDate = dateRange.to?.toISOString() || new Date().toISOString();

      const response = await fetch(
        `/api/performance/metrics?startDate=${startDate}&endDate=${endDate}&metricType=${metricType}&page=${page}`,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch performance data: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch performance data");
      }

      setAggregatedMetrics(data.aggregatedMetrics || []);
      setTimeSeriesData(data.timeSeriesData || []);
      setPagePerformance(data.pagePerformance || []);
      setFilterOptions(data.filterOptions || { pages: [], metricTypes: [] });
    } catch (err) {
      console.error("Error fetching performance data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load and when filters change
  useEffect(() => {
    fetchData();
  }, [dateRange, metricType, page]);

  // Format metric name for display
  const formatMetricName = (name: string): string => {
    const nameMap: Record<string, string> = {
      LCP: "Largest Contentful Paint",
      FID: "First Input Delay",
      CLS: "Cumulative Layout Shift",
      FCP: "First Contentful Paint",
      TTFB: "Time to First Byte",
      INP: "Interaction to Next Paint",
    };

    if (name.startsWith("resource-")) {
      return `${name.replace("resource-", "")} Resources`;
    }

    return nameMap[name] || name;
  };

  // Format metric value for display
  const formatMetricValue = (name: string, value: number): string => {
    if (name === "CLS") {
      return value.toFixed(3);
    } else if (name.startsWith("memory-")) {
      return `${value.toFixed(1)}%`;
    } else {
      return `${value.toFixed(0)}ms`;
    }
  };

  // Get rating color based on metric value
  const getRatingColor = (name: string, value: number): string => {
    let rating = "good";

    switch (name) {
      case "CLS":
        rating =
          value <= 0.1 ? "good" : value <= 0.25 ? "needs-improvement" : "poor";
        break;
      case "FCP":
        rating =
          value <= 1800 ? "good" : value <= 3000 ? "needs-improvement" : "poor";
        break;
      case "FID":
        rating =
          value <= 100 ? "good" : value <= 300 ? "needs-improvement" : "poor";
        break;
      case "LCP":
        rating =
          value <= 2500 ? "good" : value <= 4000 ? "needs-improvement" : "poor";
        break;
      case "TTFB":
        rating =
          value <= 800 ? "good" : value <= 1800 ? "needs-improvement" : "poor";
        break;
      case "INP":
        rating =
          value <= 200 ? "good" : value <= 500 ? "needs-improvement" : "poor";
        break;
    }

    switch (rating) {
      case "good":
        return "bg-green-100 text-green-800";
      case "needs-improvement":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format path for display
  const formatPath = (path: string): string => {
    if (path === "/") return "Homepage";
    return path.replace(/^\//, "").replace(/-/g, " ").replace(/\//g, " › ");
  };

  // Handle date range change
  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics Dashboard</CardTitle>
          <CardDescription>
            Monitor and analyze application performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date Range
              </label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={handleDateRangeChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Metric Type
              </label>
              <Select value={metricType} onValueChange={setMetricType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Metrics</SelectItem>
                  {filterOptions.metricTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatMetricName(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Page</label>
              <Select value={page} onValueChange={setPage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  {filterOptions.pages.map((p) => (
                    <SelectItem key={p} value={p}>
                      {formatPath(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={fetchData} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Dashboard content */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="pages">Page Performance</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))
            ) : aggregatedMetrics.length > 0 ? (
              aggregatedMetrics
                .filter((metric) => !metric.metric_name.startsWith("resource-"))
                .map((metric) => (
                  <Card key={metric.metric_name}>
                    <CardHeader>
                      <CardTitle>
                        {formatMetricName(metric.metric_name)}
                      </CardTitle>
                      <CardDescription>
                        Based on {metric.sample_count} samples
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-3xl font-bold">
                            {formatMetricValue(
                              metric.metric_name,
                              metric.avg_value,
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Average
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xl font-semibold">
                              {formatMetricValue(
                                metric.metric_name,
                                metric.p75_value,
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              75th Percentile
                            </div>
                          </div>
                          <div>
                            <div className="text-xl font-semibold">
                              {formatMetricValue(
                                metric.metric_name,
                                metric.p95_value,
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              95th Percentile
                            </div>
                          </div>
                        </div>
                        <div>
                          <Badge
                            className={getRatingColor(
                              metric.metric_name,
                              metric.avg_value,
                            )}
                          >
                            {metric.avg_value <=
                            getThreshold(metric.metric_name, "good")
                              ? "Good"
                              : metric.avg_value <=
                                  getThreshold(
                                    metric.metric_name,
                                    "needs-improvement",
                                  )
                                ? "Needs Improvement"
                                : "Poor"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">
                  No performance metrics data available for the selected
                  filters.
                </p>
              </div>
            )}
          </div>

          {/* Resource metrics */}
          {!loading &&
            aggregatedMetrics.some((metric) =>
              metric.metric_name.startsWith("resource-"),
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle>Resource Load Times</CardTitle>
                  <CardDescription>
                    Average load time by resource type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <BarChart
                      data={aggregatedMetrics
                        .filter((metric) =>
                          metric.metric_name.startsWith("resource-"),
                        )
                        .map((metric) => ({
                          name: formatMetricName(metric.metric_name),
                          value: metric.avg_value,
                        }))}
                      tooltipFormat={(value: number) => `${value.toFixed(0)}ms`}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
        </TabsContent>

        {/* Trends tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : timeSeriesData.length > 0 ? (
            <>
              {/* Core Web Vitals trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals Trends</CardTitle>
                  <CardDescription>
                    Performance metrics over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <LineChart
                      data={timeSeriesData}
                      tooltipFormat={(value: number, name: string) =>
                        formatMetricValue(name || "", value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Resource trends */}
              {hasResourceMetrics(timeSeriesData) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Load Time Trends</CardTitle>
                    <CardDescription>
                      Resource performance over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <AreaChart
                        data={timeSeriesData}
                        tooltipFormat={(value: number) =>
                          `${value.toFixed(0)}ms`
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No trend data available for the selected filters.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Pages tab */}
        <TabsContent value="pages" className="space-y-6 mt-6">
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : pagePerformance.length > 0 ? (
            <div className="space-y-4">
              {pagePerformance.map((page) => (
                <Card key={page.path}>
                  <CardHeader>
                    <CardTitle>{formatPath(page.path)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(page)
                        .filter(([key]) => key !== "path")
                        .map(([metricName, data]) => {
                          const metricData = data as {
                            avg: number;
                            count: number;
                          };
                          return (
                            <div
                              key={metricName}
                              className="p-4 border rounded-lg"
                            >
                              <div className="text-sm font-medium">
                                {formatMetricName(metricName)}
                              </div>
                              <div className="text-2xl font-bold mt-1">
                                {formatMetricValue(metricName, metricData.avg)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Based on {metricData.count} samples
                              </div>
                              <div
                                className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${getRatingColor(
                                  metricName,
                                  metricData.avg,
                                )}`}
                              >
                                {metricData.avg <=
                                getThreshold(metricName, "good")
                                  ? "Good"
                                  : metricData.avg <=
                                      getThreshold(
                                        metricName,
                                        "needs-improvement",
                                      )
                                    ? "Needs Improvement"
                                    : "Poor"}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No page performance data available for the selected filters.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get threshold values for different metrics
function getThreshold(
  metricName: string,
  level: "good" | "needs-improvement",
): number {
  const thresholds: Record<string, Record<string, number>> = {
    CLS: { good: 0.1, "needs-improvement": 0.25 },
    FCP: { good: 1800, "needs-improvement": 3000 },
    FID: { good: 100, "needs-improvement": 300 },
    LCP: { good: 2500, "needs-improvement": 4000 },
    TTFB: { good: 800, "needs-improvement": 1800 },
    INP: { good: 200, "needs-improvement": 500 },
  };

  return thresholds[metricName]?.[level] || 0;
}

// Helper function to check if resource metrics exist in time series data
function hasResourceMetrics(data: TimeSeriesData): boolean {
  if (data.length === 0) return false;
  return Object.keys(data[0]).some((key) => key.startsWith("resource-"));
}
