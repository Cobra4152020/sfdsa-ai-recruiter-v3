"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/charts"
import type { DonationTrend } from "@/app/types/donation-analytics"

interface DonationTrendsChartProps {
  data: DonationTrend[]
}

export function DonationTrendsChart({ data }: DonationTrendsChartProps) {
  const formatValue = (value: number, name?: string) => {
    if (name === "amount") return `$${value.toLocaleString()}`
    return value.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <LineChart
            data={data}
            xField="month"
            series={["amount", "donors", "recurring"]}
            height={300}
            tooltipFormat={formatValue}
          />
        </div>
      </CardContent>
    </Card>
  )
}
