"use client"

import { useState, useEffect } from "react"
import { DonationStatsCards } from "@/components/analytics/donation-stats-cards"
import { DonationTrendsChart } from "@/components/analytics/donation-trends-chart"
import { ConversionRatesChart } from "@/components/analytics/conversion-rates-chart"
import { PointDistributionChart } from "@/components/analytics/point-distribution-chart"
import { CampaignPerformanceTable } from "@/components/analytics/campaign-performance-table"

export default function DonationAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    stats: null,
    trends: null,
    conversions: null,
    points: null,
    campaigns: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trendsRes, conversionsRes, pointsRes, campaignsRes] = await Promise.all([
          fetch('/api/analytics/donations/stats'),
          fetch('/api/analytics/donations/trends'),
          fetch('/api/analytics/donations/conversion'),
          fetch('/api/analytics/donations/points'),
          fetch('/api/analytics/donations/campaigns')
        ])

        const [stats, trends, conversions, points, campaigns] = await Promise.all([
          statsRes.json(),
          trendsRes.json(),
          conversionsRes.json(),
          pointsRes.json(),
          campaignsRes.json()
        ])

        setData({ stats, trends, conversions, points, campaigns })
      } catch (error) {
        console.error('Error fetching donation analytics data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <DonationStatsCards data={data.stats} />
      <DonationTrendsChart data={data.trends} />
      <ConversionRatesChart data={data.conversions} />
      <PointDistributionChart data={data.points} />
      <CampaignPerformanceTable data={data.campaigns} />
    </div>
  )
}
