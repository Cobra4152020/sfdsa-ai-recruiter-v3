"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangeSelector } from "@/components/analytics/date-range-selector"
import { AlertTriangle, ArrowDown, ArrowUp, CreditCard, DollarSign, Loader2, TrendingUp, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DonationStatsCards() {
  const [stats, setStats] = useState<{
    totalAmount: number
    totalCount: number
    averageAmount: number
    totalPoints: number
    pointsPerDollar: number
    periodicComparison: {
      amountChange: number
      countChange: number
      pointsChange: number
    }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
    preset: "last30",
  })

  useEffect(() => {
    fetchStats()
  }, [dateRange])

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Get current period stats
      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      })

      const response = await fetch(`/api/analytics/donations/stats?${params}`)

      if (!response.ok) {
        throw new Error(`Error fetching donation stats: ${response.statusText}`)
      }

      const data = await response.json()

      // Calculate previous period for comparison
      const periodDays = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
      const prevStartDate = new Date(dateRange.from)
      prevStartDate.setDate(prevStartDate.getDate() - periodDays)
      const prevEndDate = new Date(dateRange.from)
      prevEndDate.setDate(prevEndDate.getDate() - 1)

      const prevParams = new URLSearchParams({
        startDate: prevStartDate.toISOString(),
        endDate: prevEndDate.toISOString(),
      })

      const prevResponse = await fetch(`/api/analytics/donations/stats?${prevParams}`)

      if (!prevResponse.ok) {
        throw new Error(`Error fetching previous period stats: ${prevResponse.statusText}`)
      }

      const prevData = await prevResponse.json()

      // Calculate percent changes
      const amountChange =
        prevData.totalAmount === 0 ? 100 : ((data.totalAmount - prevData.totalAmount) / prevData.totalAmount) * 100

      const countChange =
        prevData.totalCount === 0 ? 100 : ((data.totalCount - prevData.totalCount) / prevData.totalCount) * 100

      const pointsChange =
        prevData.totalPoints === 0 ? 100 : ((data.totalPoints - prevData.totalPoints) / prevData.totalPoints) * 100

      setStats({
        ...data,
        periodicComparison: {
          amountChange,
          countChange,
          pointsChange,
        },
      })
    } catch (error) {
      console.error("Failed to fetch donation stats:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch donation stats")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateRangeChange = (range: { from: Date; to: Date; preset?: string }) => {
    setDateRange(range)
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Alert variant="destructive" className="col-span-full">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full flex justify-center items-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold tracking-tight">Donation Overview</h2>
        <DateRangeSelector onChange={handleDateRangeChange} defaultPreset="last30" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {stats?.periodicComparison.amountChange > 0 ? (
                <>
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">
                    {Math.abs(stats?.periodicComparison.amountChange).toFixed(1)}%{" "}
                  </span>
                </>
              ) : stats?.periodicComparison.amountChange < 0 ? (
                <>
                  <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">{Math.abs(stats?.periodicComparison.amountChange).toFixed(1)}% </span>
                </>
              ) : (
                <span>0% </span>
              )}
              from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donation Count</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCount}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {stats?.periodicComparison.countChange > 0 ? (
                <>
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">{Math.abs(stats?.periodicComparison.countChange).toFixed(1)}% </span>
                </>
              ) : stats?.periodicComparison.countChange < 0 ? (
                <>
                  <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">{Math.abs(stats?.periodicComparison.countChange).toFixed(1)}% </span>
                </>
              ) : (
                <span>0% </span>
              )}
              from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.averageAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Per donation average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {stats?.periodicComparison.pointsChange > 0 ? (
                <>
                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">
                    {Math.abs(stats?.periodicComparison.pointsChange).toFixed(1)}%{" "}
                  </span>
                </>
              ) : stats?.periodicComparison.pointsChange < 0 ? (
                <>
                  <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">{Math.abs(stats?.periodicComparison.pointsChange).toFixed(1)}% </span>
                </>
              ) : (
                <span>0% </span>
              )}
              from previous period
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
