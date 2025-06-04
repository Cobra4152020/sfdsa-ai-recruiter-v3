"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts";
import { DateRangeSelector } from "@/components/analytics/date-range-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type PointDistribution = {
  pointRange: string;
  donationCount: number;
  totalPoints: number;
  avgAmount: number;
};

export function PointDistributionChart() {
  const [distributionData, setDistributionData] = useState<PointDistribution[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
    preset: "last30",
  });

  useEffect(() => {
    fetchDistributionData();
  }, [dateRange]);

  const fetchDistributionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });

      const response = await fetch(
        `/api/analytics/donations/points/distribution?${params}`,
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching point distribution: ${response.statusText}`,
        );
      }

      const data = await response.json();
      setDistributionData(data.distribution || []);
    } catch (error) {
      console.error("Failed to fetch point distribution:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch point distribution",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (range: {
    from: Date;
    to: Date;
    preset?: string;
  }) => {
    setDateRange(range);
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatCount = (value: number) => `${value}`;
  const formatPoints = (value: number) => `${value.toLocaleString()} pts`;

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Point Distribution</CardTitle>
          <CardDescription>
            Analyze how donation points are distributed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Point Distribution</CardTitle>
            <CardDescription>
              Analyze how donation points are distributed
            </CardDescription>
          </div>
          <DateRangeSelector
            onChange={handleDateRangeChange}
            defaultPreset="last30"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="count">
          <TabsList>
            <TabsTrigger value="count">Donation Count</TabsTrigger>
            <TabsTrigger value="points">Total Points</TabsTrigger>
            <TabsTrigger value="amount">Avg Amount</TabsTrigger>
          </TabsList>

          <TabsContent value="count" className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : distributionData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No point distribution data available for the selected period
              </div>
            ) : (
              <BarChart
                data={distributionData}
                xField="pointRange"
                series={["donationCount"]}
                height={350}
                tooltipFormat={(value) => formatCount(value)}
              />
            )}
          </TabsContent>

          <TabsContent value="points" className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : distributionData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No point distribution data available for the selected period
              </div>
            ) : (
              <BarChart
                data={distributionData}
                xField="pointRange"
                series={["totalPoints"]}
                height={350}
                tooltipFormat={(value) => formatPoints(value)}
              />
            )}
          </TabsContent>

          <TabsContent value="amount" className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : distributionData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No point distribution data available for the selected period
              </div>
            ) : (
              <BarChart
                data={distributionData}
                xField="pointRange"
                series={["avgAmount"]}
                height={350}
                tooltipFormat={(value) => formatCurrency(value)}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
