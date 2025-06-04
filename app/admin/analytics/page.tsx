"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { UserGrowthChart } from "@/components/analytics/user-growth-chart";
import { UserEngagementChart } from "@/components/analytics/user-engagement-chart";
import { ConversionTable } from "@/components/analytics/conversion-table";
import { GeographicMap } from "@/components/analytics/geographic-map";
import { RetentionHeatmap } from "@/components/analytics/retention-heatmap";
import { BadgeDistributionChart } from "@/components/analytics/badge-distribution-chart";
import { ActivitySummaryChart } from "@/components/analytics/activity-summary-chart";
import { MonthlyReportGenerator } from "@/components/analytics/monthly-report-generator";
import { AnalyticsSummary } from "@/components/analytics/analytics-summary";
import {
  getUserGrowthData,
  getUserEngagementData,
  getConversionData,
  getGeographicData,
  getRetentionData,
  getBadgeDistributionData,
  getUserActivitySummary,
} from "@/lib/analytics-service";
import { RefreshCw, Download } from "lucide-react";
import type {
  ConversionData,
  BadgeDistributionData,
} from "@/app/types/analytics";
import { UserGrowthDataPoint } from "@/components/analytics/user-growth-chart";
import { UserEngagementDataPoint } from "@/components/analytics/user-engagement-chart";
import { RetentionHeatmapRow } from "@/components/analytics/retention-heatmap";

export default function AdminAnalyticsPage() {
  const { toast } = useToast();

  // State
  const [activeTab, setActiveTab] = useState("growth");
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">(
    "month",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data state
  const [growthData, setGrowthData] = useState<UserGrowthDataPoint[]>([]);
  const [engagementData, setEngagementData] = useState<
    UserEngagementDataPoint[]
  >([]);
  const [conversionData, setConversionData] = useState<ConversionData[]>([]);
  const [geographicData, setGeographicData] = useState<
    { zip_code: string; count: number }[]
  >([]);
  const [retentionData, setRetentionData] = useState<RetentionHeatmapRow[]>([]);
  const [badgeData, setBadgeData] = useState<BadgeDistributionData[]>([]);
  const [activityData, setActivityData] = useState<
    { activity_type: string; count: number; percentage: number }[]
  >([]);

  // Load data based on active tab and period
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load data based on active tab
      switch (activeTab) {
        case "growth":
          const growthData = await getUserGrowthData(period);
          setGrowthData(growthData);
          break;
        case "engagement":
          const engagementData = await getUserEngagementData(period);
          setEngagementData(engagementData);
          break;
        case "conversion":
          const conversionData = await getConversionData(
            period === "week" ? "month" : period,
          );
          setConversionData(conversionData);
          break;
        case "geographic":
          const geoData = await getGeographicData();
          setGeographicData(
            geoData.map((item: { zip_code: string; count: number }) => ({
              zip_code: item.zip_code,
              count: item.count,
            })),
          );
          break;
        case "retention":
          const retentionData = await getRetentionData(
            period === "week"
              ? 1
              : period === "month"
                ? 3
                : period === "quarter"
                  ? 6
                  : 12,
          );
          setRetentionData(retentionData);
          break;
        case "badges":
          const badgeData = await getBadgeDistributionData();
          setBadgeData(badgeData);
          break;
        case "activity":
          const activityData = await getUserActivitySummary(period);
          // Flatten UserActivitySummary to ActivitySummary[]
          const summary: {
            activity_type: string;
            count: number;
            percentage: number;
          }[] = [];
          if (activityData && activityData.length > 0) {
            const total = activityData.reduce(
              (acc, curr) =>
                acc +
                (curr.logins ?? 0) +
                (curr.profile_updates ?? 0) +
                (curr.applications ?? 0) +
                (curr.messages ?? 0),
              0,
            );
            activityData.forEach((item) => {
              if (item.logins !== undefined)
                summary.push({
                  activity_type: "logins",
                  count: item.logins,
                  percentage: total ? (item.logins / total) * 100 : 0,
                });
              if (item.profile_updates !== undefined)
                summary.push({
                  activity_type: "profile_updates",
                  count: item.profile_updates,
                  percentage: total ? (item.profile_updates / total) * 100 : 0,
                });
              if (item.applications !== undefined)
                summary.push({
                  activity_type: "applications",
                  count: item.applications,
                  percentage: total ? (item.applications / total) * 100 : 0,
                });
              if (item.messages !== undefined)
                summary.push({
                  activity_type: "messages",
                  count: item.messages,
                  percentage: total ? (item.messages / total) * 100 : 0,
                });
            });
          }
          setActivityData(summary);
          break;
        case "reports":
          // Reports tab doesn't need to load data here
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error loading ${activeTab} data:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${activeTab} data. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, period, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Analytics data has been refreshed.",
    });
  };

  const handleExportData = () => {
    let dataToExport: unknown[] = [];
    let filename = "";

    // Determine which data to export based on active tab
    switch (activeTab) {
      case "growth":
        dataToExport = growthData;
        filename = `user-growth-${period}-${new Date().toISOString().split("T")[0]}.csv`;
        break;
      case "engagement":
        dataToExport = engagementData;
        filename = `user-engagement-${period}-${new Date().toISOString().split("T")[0]}.csv`;
        break;
      case "conversion":
        dataToExport = conversionData;
        filename = `conversion-data-${period}-${new Date().toISOString().split("T")[0]}.csv`;
        break;
      case "geographic":
        dataToExport = geographicData;
        filename = `geographic-distribution-${new Date().toISOString().split("T")[0]}.csv`;
        break;
      case "retention":
        dataToExport = retentionData;
        filename = `retention-data-${new Date().toISOString().split("T")[0]}.csv`;
        break;
      case "badges":
        dataToExport = badgeData;
        filename = `badge-distribution-${new Date().toISOString().split("T")[0]}.csv`;
        break;
      case "activity":
        dataToExport = activityData;
        filename = `activity-summary-${period}-${new Date().toISOString().split("T")[0]}.csv`;
        break;
      default:
        toast({
          title: "Export Error",
          description: "No data available to export for this tab.",
          variant: "destructive",
        });
        return;
    }

    if (!dataToExport || dataToExport.length === 0) {
      toast({
        title: "Export Error",
        description: "No data available to export.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers =
      typeof dataToExport[0] === "object" && dataToExport[0] !== null
        ? Object.keys(dataToExport[0] as object)
        : [];
    let csvContent = headers.join(",") + "\n";

    dataToExport.forEach((row) => {
      const values = headers.map((header) => {
        const value = (row as Record<string, unknown>)[header];
        // Handle values that need quotes
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"') || value.includes("\n"))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += values.join(",") + "\n";
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Data exported to ${filename}`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">User Analytics</h1>
          <p className="text-gray-600">
            Insights and metrics about user behavior and growth
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing || isLoading}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
          <Button
            onClick={handleExportData}
            variant="outline"
            disabled={isLoading || activeTab === "reports"}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <AnalyticsSummary />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 mt-8">
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="growth">User Growth</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <div className="mb-6 flex justify-end">
            {activeTab !== "geographic" &&
              activeTab !== "badges" &&
              activeTab !== "reports" && (
                <Select
                  value={period}
                  onValueChange={(value) =>
                    setPeriod(value as "week" | "month" | "quarter" | "year")
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="quarter">Last 90 Days</SelectItem>
                    <SelectItem value="year">Last 365 Days</SelectItem>
                  </SelectContent>
                </Select>
              )}
          </div>

          <TabsContent value="growth">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Track new user registrations over time, broken down by user
                  type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserGrowthChart data={growthData} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>
                  Track active users, session time, and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserEngagementChart
                  data={engagementData}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Recruiter Conversion</CardTitle>
                <CardDescription>
                  Track how effectively volunteer recruiters are converting
                  referrals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConversionTable data={conversionData} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geographic">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>
                  View where users are located based on zip code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GeographicMap data={geographicData} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retention">
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>
                  Track how well users are retained over time by cohort
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RetentionHeatmap data={retentionData} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Badge Distribution</CardTitle>
                <CardDescription>
                  View which badges are most commonly earned by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BadgeDistributionChart
                  data={badgeData}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>
                  View the most common user activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivitySummaryChart
                  data={activityData}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Reports</CardTitle>
                <CardDescription>
                  Generate and download comprehensive monthly reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyReportGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
