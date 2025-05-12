"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart } from "@/components/ui/charts"

export function PerformanceWidget() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/performance/dashboard?days=3&metric=LCP")

        if (!response.ok) {
          throw new Error("Failed to fetch performance data")
        }

        const result = await response.json()
        setData(result.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Format data for chart
  const chartData = data
    .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())
    .map((item) => ({
      date: new Date(item.day).toLocaleDateString(),
      LCP: item.avg_value,
    }))

  // Calculate average LCP
  const avgLCP = data.length > 0 ? data.reduce((sum, item) => sum + item.avg_value, 0) / data.length : 0

  // Determine performance rating
  let rating: "good" | "needs-improvement" | "poor" = "good"
  if (avgLCP > 4000) rating = "poor"
  else if (avgLCP > 2500) rating = "needs-improvement"

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Performance</span>
          {!loading && !error && (
            <Badge variant={rating === "good" ? "success" : rating === "needs-improvement" ? "warning" : "destructive"}>
              {rating === "good" ? "Good" : rating === "needs-improvement" ? "Needs Improvement" : "Poor"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[100px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading performance data...</p>
          </div>
        ) : error ? (
          <div className="h-[100px] flex items-center justify-center">
            <p className="text-sm text-red-500">Error: {error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[100px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No performance data available</p>
          </div>
        ) : (
          <>
            <div className="mb-2">
              <div className="text-2xl font-bold">{Math.round(avgLCP)}ms</div>
              <p className="text-xs text-muted-foreground">Avg. Largest Contentful Paint</p>
            </div>
            <div className="h-[100px]">
              <LineChart
                data={chartData}
                index="date"
                categories={["LCP"]}
                colors={["emerald"]}
                showLegend={false}
                showXAxis={true}
                showYAxis={true}
                showGridLines={false}
                valueFormatter={(value) => `${value.toFixed(0)}ms`}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
