"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart } from "@/components/ui/charts"
import { DateRangeSelector } from "@/components/analytics/date-range-selector"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export type DonationTrend = {
  period: string
  totalAmount: number
  donationCount: number
  recurringAmount: number
  onetimeAmount: number
  avgPointsPerDollar: number
}

export function DonationTrendsChart() {
  const [trendsData, setTrendsData] = useState<DonationTrend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
    preset: "last30",
  })
  const [interval, setInterval] = useState("day")

  useEffect(() => {
    fetchTrendsData()
  }, [dateRange, interval])

  const fetchTrendsData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        interval,
      })

      const response = await fetch(`/api/analytics/donations/trends?${params}`)

      if (!response.ok) {
        throw new Error(`Error fetching donation trends: ${response.statusText}`)
      }

      const data = await response.json()
      setTrendsData(data.trends || [])
    } catch (error) {
      console.error("Failed to fetch donation trends:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch donation trends")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateRangeChange = (range: { from: Date; to: Date; preset?: string }) => {
    setDateRange(range)
  }

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`
  const formatCount = (value: number) => `${value}`
  const formatPoints = (value: number) => `${value.toFixed(1)} pts`

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donation Trends</CardTitle>
          <CardDescription>Track donation amounts and frequency over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>Track donation amounts and frequency over time</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <DateRangeSelector onChange={handleDateRangeChange} defaultPreset="last30" />
            <select
              className="h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="amount">
          <TabsList>
            <TabsTrigger value="amount">Amount</TabsTrigger>
            <TabsTrigger value="count">Count</TabsTrigger>
            <TabsTrigger value="type">Type</TabsTrigger>
            <TabsTrigger value="points">Points</TabsTrigger>
          </TabsList>

          <TabsContent value="amount" className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : trendsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No donation data available for the selected period
              </div>
            ) : (
              <AreaChart
                data={trendsData}
                xField="period"
                series={["totalAmount"]}
                height={350}
                tooltipFormat={(value) => formatCurrency(value)}
              />
            )}
          </TabsContent>

          <TabsContent value="count" className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : trendsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No donation data available for the selected period
              </div>
            ) : (
              <AreaChart
                data={trendsData}
                xField="period"
                series={["donationCount"]}
                height={350}
                tooltipFormat={(value) => formatCount(value)}
              />
            )}
          </TabsContent>

          <TabsContent value="type" className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : trendsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No donation data available for the selected period
              </div>
            ) : (
              <AreaChart
                data={trendsData}
                xField="period"
                series={["recurringAmount", "onetimeAmount"]}
                height={350}
                tooltipFormat={(value) => formatCurrency(value)}
              />
            )}
          </TabsContent>

          <TabsContent value="points" className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : trendsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No donation data available for the selected period
              </div>
            ) : (
              <AreaChart
                data={trendsData}
                xField="period"
                series={["avgPointsPerDollar"]}
                height={350}
                tooltipFormat={(value) => formatPoints(value)}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
