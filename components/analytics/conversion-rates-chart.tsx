"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "@/components/ui/charts"
import type { ConversionRate } from "@/app/types/donation-analytics"

interface ConversionRatesChartProps {
  data: ConversionRate[]
}

export function ConversionRatesChart({ data }: ConversionRatesChartProps) {
  const formatValue = (value: number, name?: string) => {
    if (name === "rate") return `${value.toFixed(1)}%`
    if (name === "total") return value.toLocaleString()
    if (name === "change") return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
    return value.toString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Rates by Source</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <BarChart
            data={data}
            xField="source"
            series={["rate", "total", "change"]}
            height={300}
            tooltipFormat={formatValue}
          />
        </div>
      </CardContent>
    </Card>
  )
}
