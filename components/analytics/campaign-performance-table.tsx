"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangeSelector } from "@/components/analytics/date-range-selector"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export type CampaignPerformance = {
  campaignId: string
  campaignName: string
  totalDonations: number
  totalAmount: number
  totalPoints: number
  pointsPerDollar: number
  avgDonation: number
}

export function CampaignPerformanceTable() {
  const [campaignData, setCampaignData] = useState<CampaignPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    to: new Date(),
    preset: "last90",
  })

  const fetchCampaignData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      })

      const response = await fetch(`/api/analytics/donations/campaigns?${params}`)

      if (!response.ok) {
        throw new Error(`Error fetching campaign performance: ${response.statusText}`)
      }

      const data = await response.json()
      setCampaignData(data.campaigns || [])
    } catch (error) {
      console.error("Failed to fetch campaign performance:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch campaign performance")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaignData()
  }, [dateRange, fetchCampaignData])

  const handleDateRangeChange = (range: { from: Date; to: Date; preset?: string }) => {
    setDateRange({
      from: range.from,
      to: range.to,
      preset: range.preset || "last90",
    })
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Compare donation campaigns effectiveness</CardDescription>
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
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Compare donation campaigns effectiveness</CardDescription>
          </div>
          <DateRangeSelector onChange={handleDateRangeChange} defaultPreset="last90" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[350px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : campaignData.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No campaign data available for the selected period
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="text-right">Donations</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Avg Donation</TableHead>
                  <TableHead className="text-right">Total Points</TableHead>
                  <TableHead className="text-right">Points/Dollar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignData.map((campaign) => (
                  <TableRow key={campaign.campaignId}>
                    <TableCell className="font-medium">{campaign.campaignName}</TableCell>
                    <TableCell className="text-right">{campaign.totalDonations}</TableCell>
                    <TableCell className="text-right">${campaign.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${campaign.avgDonation.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{campaign.totalPoints.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{campaign.pointsPerDollar.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
