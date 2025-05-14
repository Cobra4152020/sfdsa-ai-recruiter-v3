"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "@/components/ui/charts"
import { DateRangeSelector } from "@/components/analytics/date-range-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export type ConversionRate = {
  referralSource: string
  pageViews: number
  formStarts: number
  completions: number
  conversionRate: number
  avgAmount: number
}

export function ConversionRatesChart() {
  const [conversionData, setConversionData] = useState<ConversionRate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
    preset: "last30",
  })

  useEffect(() => {
    fetchConversionData()
  }, [dateRange])

  const fetchConversionData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      })

      const response = await fetch(`/api/analytics/donations/conversion?${params}`)

      if (!response.ok) {
        throw new Error(`Error fetching conversion rates: ${response.statusText}`)
      }

      const data = await response.json()
      setConversionData(data.conversionRates || [])
    } catch (error) {
      console.error("Failed to fetch conversion rates:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch conversion rates")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateRangeChange = (range: { from: Date; to: Date; preset?: string }) => {
    setDateRange(range)
  }

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`
  const formatCount = (value: number) => `${value}`

  // Process data for the chart
  const chartData = conversionData
    .map((item) => ({
      referralSource: formatReferralSource(item.referralSource),
      pageViews: item.pageViews,
      formStarts: item.formStarts,
      completions: item.completions,
      conversionRate: item.conversionRate,
      avgAmount: item.avgAmount,
    }))
    .sort((a, b) => b.pageViews - a.pageViews)
    .slice(0, 10)

  function formatReferralSource(source: string): string {
    if (source === "direct") return "Direct"
    if (source.startsWith("http")) {
      try {
        const url = new URL(source)
        return url.hostname.replace("www.", "")
      } catch (e) {
        return source
      }
    }
    return source.charAt(0).toUpperCase() + source.slice(1)
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rates</CardTitle>
          <CardDescription>Analyze donation conversion by traffic source</CardDescription>
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
            <CardTitle>Conversion Rates</CardTitle>
            <CardDescription>Analyze donation conversion by traffic source</CardDescription>
          </div>
          <DateRangeSelector onChange={handleDateRangeChange} defaultPreset="last30" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rate">
          <TabsList>
            <TabsTrigger value="rate">Conversion Rate</TabsTrigger>
            <TabsTrigger value="funnel">Funnel Steps</TabsTrigger>
            <TabsTrigger value="amount">Avg Amount</TabsTrigger>
          </TabsList>

          <TabsContent value="rate" className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No conversion data available for the selected period
              </div>
            ) : (
              <BarChart
                data={chartData}
                xField="referralSource"
                series={["conversionRate"]}
                height={350}
                tooltipFormat={(value) => formatPercentage(value)}
              />
            )}
          </TabsContent>

          <TabsContent value="funnel" className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No conversion data available for the selected period
              </div>
            ) : (
              <BarChart
                data={chartData}
                xField="referralSource"
                series={["pageViews", "formStarts", "completions"]}
                height={350}
                tooltipFormat={(value) => formatCount(value)}
              />
            )}
          </TabsContent>

          <TabsContent value="amount" className="h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No conversion data available for the selected period
              </div>
            ) : (
              <BarChart
                data={chartData}
                xField="referralSource"
                series={["avgAmount"]}
                height={350}
                tooltipFormat={(value) => formatCurrency(value)}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
