"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ActivitySummaryChartProps {
  data: any[]
  isLoading: boolean
}

export function ActivitySummaryChart({ data, isLoading }: ActivitySummaryChartProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3C1F]"></div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center">
        <p className="text-lg font-medium text-gray-500">No activity data available</p>
        <p className="text-sm text-gray-400">Try selecting a different time period</p>
      </div>
    )
  }

  // Only show top 10 activities in the chart
  const chartData = data.slice(0, 10).map((item) => ({
    name: item.activity_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    count: item.count,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-[400px]">
        <ChartContainer
          config={{
            count: {
              label: "Count",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tickFormatter={(value) => {
                  return value.length > 15 ? `${value.substring(0, 15)}...` : value
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="count" fill="var(--color-count)" name="Count" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="overflow-y-auto h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity Type</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((activity, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {activity.activity_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </TableCell>
                <TableCell className="text-right">{activity.count}</TableCell>
                <TableCell className="text-right">{activity.percentage.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
