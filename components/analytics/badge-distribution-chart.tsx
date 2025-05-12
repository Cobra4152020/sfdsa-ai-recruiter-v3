"use client"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BadgeDistributionChartProps {
  data: any[]
  isLoading: boolean
}

export function BadgeDistributionChart({ data, isLoading }: BadgeDistributionChartProps) {
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
        <p className="text-lg font-medium text-gray-500">No badge data available</p>
      </div>
    )
  }

  // Only show top 10 badges in the chart
  const chartData = data.slice(0, 10).map((item) => ({
    name: item.badge_name,
    value: item.count,
  }))

  const COLORS = [
    "#3b82f6", // blue-500
    "#10b981", // green-500
    "#f59e0b", // amber-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#f43f5e", // rose-500
    "#84cc16", // lime-500
    "#14b8a6", // teal-500
    "#6366f1", // indigo-500
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} awards`, "Count"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-y-auto h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Badge</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((badge, index) => (
              <TableRow key={badge.badge_id}>
                <TableCell className="font-medium">{badge.badge_name}</TableCell>
                <TableCell className="text-right">{badge.count}</TableCell>
                <TableCell className="text-right">{badge.percentage.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
