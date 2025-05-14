"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

interface UserGrowthChartProps {
  data: any[]
  isLoading: boolean
}

export function UserGrowthChart({ data, isLoading }: UserGrowthChartProps) {
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
        <p className="text-lg font-medium text-gray-500">No data available</p>
        <p className="text-sm text-gray-400">Try selecting a different time period</p>
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        total: {
          label: "Total Users",
          color: "hsl(var(--chart-1))",
        },
        recruits: {
          label: "Recruits",
          color: "hsl(var(--chart-2))",
        },
        volunteers: {
          label: "Volunteers",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="var(--color-total)" name="Total Users" strokeWidth={2} />
          <Line type="monotone" dataKey="recruits" stroke="var(--color-recruits)" name="Recruits" strokeWidth={2} />
          <Line
            type="monotone"
            dataKey="volunteers"
            stroke="var(--color-volunteers)"
            name="Volunteers"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
