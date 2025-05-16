"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface PerformanceData {
  month: string
  referrals: number
  hires: number
  clicks: number
}

interface RecruiterPerformanceChartProps {
  data: PerformanceData[]
  showDetailed?: boolean
}

export function RecruiterPerformanceChart({ data, showDetailed = false }: RecruiterPerformanceChartProps) {
  const [chartType, setChartType] = useState("line")
  const [metricType, setMetricType] = useState("referrals")

  // Calculate trend data
  const calculateTrend = () => {
    if (data.length < 2) return { trend: 0, description: "Not enough data" }

    const currentValue = data[data.length - 1][metricType as keyof PerformanceData] as number
    const previousValue = data[data.length - 2][metricType as keyof PerformanceData] as number

    const trend = previousValue === 0 ? 100 : ((currentValue - previousValue) / previousValue) * 100

    let description = ""
    if (trend > 15) {
      description = "Strong increase"
    } else if (trend > 5) {
      description = "Moderate increase"
    } else if (trend > -5) {
      description = "Stable"
    } else if (trend > -15) {
      description = "Moderate decrease"
    } else {
      description = "Strong decrease"
    }

    return { trend, description }
  }

  const trendInfo = calculateTrend()

  return (
    <Card className={showDetailed ? "col-span-full" : ""}>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle>Recruitment Performance</CardTitle>
            <CardDescription>Track your recruitment metrics over time</CardDescription>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Tabs value={chartType} onValueChange={setChartType} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs value={metricType} onValueChange={setMetricType} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="referrals">Referrals</TabsTrigger>
                <TabsTrigger value="hires">Hires</TabsTrigger>
                <TabsTrigger value="clicks">Clicks</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {metricType === "referrals" && (
                  <Line type="monotone" dataKey="referrals" stroke="#0A3C1F" activeDot={{ r: 8 }} name="Referrals" />
                )}
                {metricType === "hires" && (
                  <Line type="monotone" dataKey="hires" stroke="#FFD700" activeDot={{ r: 8 }} name="Hires" />
                )}
                {metricType === "clicks" && (
                  <Line type="monotone" dataKey="clicks" stroke="#3B82F6" activeDot={{ r: 8 }} name="Link Clicks" />
                )}
                {showDetailed && (
                  <>
                    {metricType !== "referrals" && (
                      <Line
                        type="monotone"
                        dataKey="referrals"
                        stroke="#0A3C1F"
                        strokeDasharray="5 5"
                        name="Referrals"
                      />
                    )}
                    {metricType !== "hires" && (
                      <Line type="monotone" dataKey="hires" stroke="#FFD700" strokeDasharray="5 5" name="Hires" />
                    )}
                    {metricType !== "clicks" && (
                      <Line
                        type="monotone"
                        dataKey="clicks"
                        stroke="#3B82F6"
                        strokeDasharray="5 5"
                        name="Link Clicks"
                      />
                    )}
                  </>
                )}
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {metricType === "referrals" && <Bar dataKey="referrals" fill="#0A3C1F" name="Referrals" />}
                {metricType === "hires" && <Bar dataKey="hires" fill="#FFD700" name="Hires" />}
                {metricType === "clicks" && <Bar dataKey="clicks" fill="#3B82F6" name="Link Clicks" />}
                {showDetailed && (
                  <>
                    {metricType !== "referrals" && <Bar dataKey="referrals" fill="#0A3C1F" name="Referrals" />}
                    {metricType !== "hires" && <Bar dataKey="hires" fill="#FFD700" name="Hires" />}
                    {metricType !== "clicks" && <Bar dataKey="clicks" fill="#3B82F6" name="Link Clicks" />}
                  </>
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {showDetailed && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 border rounded-lg">
              <h3 className="font-medium text-gray-800">Current Month</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Referrals</p>
                  <p className="text-lg font-medium">{data[data.length - 1].referrals}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hires</p>
                  <p className="text-lg font-medium">{data[data.length - 1].hires}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Clicks</p>
                  <p className="text-lg font-medium">{data[data.length - 1].clicks}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Conversion</p>
                  <p className="text-lg font-medium">
                    {((data[data.length - 1].hires / data[data.length - 1].referrals) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border rounded-lg">
              <h3 className="font-medium text-gray-800">Trend Analysis</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {metricType.charAt(0).toUpperCase() + metricType.slice(1)} Trend
                </p>
                <div className="flex items-center mt-1">
                  <div
                    className={`text-lg font-medium ${
                      trendInfo.trend > 0 ? "text-green-600" : trendInfo.trend < 0 ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {trendInfo.trend > 0 ? "+" : ""}
                    {trendInfo.trend.toFixed(1)}%
                  </div>
                  <div className="ml-2 text-sm text-gray-600">{trendInfo.description}</div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {trendInfo.trend > 0
                    ? `Your ${metricType} are increasing, which is a positive sign.`
                    : trendInfo.trend < 0
                      ? `Your ${metricType} are decreasing. Consider reviewing your strategy.`
                      : `Your ${metricType} are stable.`}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border rounded-lg">
              <h3 className="font-medium text-gray-800">Performance Summary</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Over the past {data.length} months, you've generated a total of{" "}
                  {data.reduce((sum, item) => sum + item.referrals, 0)} referrals and{" "}
                  {data.reduce((sum, item) => sum + item.hires, 0)} hires.
                </p>
                <p className="text-sm text-gray-600 mt-2">Your average monthly performance:</p>
                <ul className="mt-1 text-sm text-gray-600 space-y-1">
                  <li>• {(data.reduce((sum, item) => sum + item.referrals, 0) / data.length).toFixed(1)} referrals</li>
                  <li>• {(data.reduce((sum, item) => sum + item.hires, 0) / data.length).toFixed(1)} hires</li>
                  <li>• {(data.reduce((sum, item) => sum + item.clicks, 0) / data.length).toFixed(1)} link clicks</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
