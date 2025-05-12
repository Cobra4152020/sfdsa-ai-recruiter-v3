"use client"

import { useEffect, useState } from "react"
import {
  Line,
  Bar,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type ChartProps = {
  data: any[]
  xField: string
  yField?: string
  series?: string[]
  height?: number
  tooltipFormat?: (value: number, name?: string) => string
}

// Generate a color for each series
const getSeriesColor = (index: number): string => {
  const colors = [
    "#0A3C1F", // Primary green
    "#2563EB", // Blue
    "#D97706", // Amber
    "#DC2626", // Red
    "#7C3AED", // Purple
    "#059669", // Emerald
    "#DB2777", // Pink
    "#0369A1", // Sky
  ]
  return colors[index % colors.length]
}

export function LineChart({ data, xField, yField, series, height = 300, tooltipFormat }: ChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div style={{ height }}></div>

  // If no series provided but yField exists, create a single series
  const chartSeries = series || (yField ? [yField] : [])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xField}
          tickFormatter={(value) => {
            if (typeof value === "string" && value.includes("T")) {
              // Format ISO date string
              return value.split("T")[0]
            }
            return value
          }}
        />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [tooltipFormat ? tooltipFormat(Number(value), name as string) : value, name]}
        />
        <Legend />
        {chartSeries.map((field, index) => (
          <Line
            key={field}
            type="monotone"
            dataKey={field}
            name={formatSeriesName(field)}
            stroke={getSeriesColor(index)}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function BarChart({ data, xField, yField, series, height = 300, tooltipFormat }: ChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div style={{ height }}></div>

  // If no series provided but yField exists, create a single series
  const chartSeries = series || (yField ? [yField] : [])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip formatter={(value, name) => [tooltipFormat ? tooltipFormat(Number(value)) : value, name]} />
        <Legend />
        {chartSeries.map((field, index) => (
          <Bar key={field} dataKey={field} name={formatSeriesName(field)} fill={getSeriesColor(index)} />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function AreaChart({ data, xField, yField, series, height = 300, tooltipFormat }: ChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div style={{ height }}></div>

  // If no series provided but yField exists, create a single series
  const chartSeries = series || (yField ? [yField] : [])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xField}
          tickFormatter={(value) => {
            if (typeof value === "string" && value.includes("T")) {
              // Format ISO date string
              return value.split("T")[0]
            }
            return value
          }}
        />
        <YAxis />
        <Tooltip formatter={(value, name) => [tooltipFormat ? tooltipFormat(Number(value)) : value, name]} />
        <Legend />
        {chartSeries.map((field, index) => (
          <Area
            key={field}
            type="monotone"
            dataKey={field}
            name={formatSeriesName(field)}
            fill={getSeriesColor(index)}
            stroke={getSeriesColor(index)}
            fillOpacity={0.3}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

// Helper function to format series names for display
function formatSeriesName(name: string): string {
  const nameMap: Record<string, string> = {
    LCP: "Largest Contentful Paint",
    FID: "First Input Delay",
    CLS: "Cumulative Layout Shift",
    FCP: "First Contentful Paint",
    TTFB: "Time to First Byte",
    INP: "Interaction to Next Paint",
  }

  if (name.startsWith("resource-")) {
    return `${name.replace("resource-", "")} Resources`
  }

  return nameMap[name] || name
}
