import type { Metadata } from "next"
import { DonationStatsCards } from "@/components/analytics/donation-stats-cards"
import { DonationTrendsChart } from "@/components/analytics/donation-trends-chart"
import { ConversionRatesChart } from "@/components/analytics/conversion-rates-chart"
import { PointDistributionChart } from "@/components/analytics/point-distribution-chart"
import { CampaignPerformanceTable } from "@/components/analytics/campaign-performance-table"

export const metadata: Metadata = {
  title: "Donation Analytics Dashboard",
  description: "Monitor donation trends, conversion rates, and point distribution",
}

export default function DonationAnalyticsDashboard() {
  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Donation Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor donation trends, conversion rates, and point distribution over time
        </p>
      </div>

      <DonationStatsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <DonationTrendsChart />
        <ConversionRatesChart />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PointDistributionChart />
        <CampaignPerformanceTable />
      </div>
    </div>
  )
}
