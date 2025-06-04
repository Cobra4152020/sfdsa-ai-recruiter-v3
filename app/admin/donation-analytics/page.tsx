"use client";

import { useState, useEffect } from "react";
import { DonationStatsCards } from "@/components/analytics/donation-stats-cards";
import { DonationTrendsChart } from "@/components/analytics/donation-trends-chart";
import { ConversionRatesChart } from "@/components/analytics/conversion-rates-chart";
import { PointDistributionChart } from "@/components/analytics/point-distribution-chart";
import { CampaignPerformanceTable } from "@/components/analytics/campaign-performance-table";
import { mockDonationData } from "@/lib/mock-donation-data";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DonationAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    stats: null,
    trends: null,
    conversions: null,
    points: null,
    campaigns: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use mock data for static export
        if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
          setData(mockDonationData);
          setIsLoading(false);
          return;
        }

        const [statsRes, trendsRes, conversionsRes, pointsRes, campaignsRes] =
          await Promise.all([
            fetch("/api/analytics/donations/stats"),
            fetch("/api/analytics/donations/trends"),
            fetch("/api/analytics/donations/conversion"),
            fetch("/api/analytics/donations/points"),
            fetch("/api/analytics/donations/campaigns"),
          ]);

        const [stats, trends, conversions, points, campaigns] =
          await Promise.all([
            statsRes.json(),
            trendsRes.json(),
            conversionsRes.json(),
            pointsRes.json(),
            campaignsRes.json(),
          ]);

        setData({ stats, trends, conversions, points, campaigns });
      } catch (error) {
        console.error("Error fetching donation analytics data:", error);
        // Fallback to mock data on error
        setData(mockDonationData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donation analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" && (
        <Card className="bg-yellow-50">
          <CardHeader>
            <CardTitle>Demo Mode</CardTitle>
            <CardDescription>
              This is a demo version with mock donation data. In production,
              this would show real-time donation analytics.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <DonationStatsCards data={data.stats} />
      <DonationTrendsChart data={data.trends} />
      <ConversionRatesChart data={data.conversions} />
      <PointDistributionChart data={data.points} />
      <CampaignPerformanceTable data={data.campaigns} />
    </div>
  );
}
