"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ComparisonData {
  you: {
    referrals: number
    hires: number
    conversionRate: number
    avgTimeToHire: number
  }
  topPerformer: {
    referrals: number
    hires: number
    conversionRate: number
    avgTimeToHire: number
  }
  average: {
    referrals: number
    hires: number
    conversionRate: number
    avgTimeToHire: number
  }
}

interface RecruiterComparisonChartProps {
  data: ComparisonData
}

export function RecruiterComparisonChart({ data }: RecruiterComparisonChartProps) {
  // Transform data for bar chart
  const barChartData = [
    {
      name: "Referrals",
      You: data.you.referrals,
      "Top Performer": data.topPerformer.referrals,
      Average: data.average.referrals,
    },
    {
      name: "Hires",
      You: data.you.hires,
      "Top Performer": data.topPerformer.hires,
      Average: data.average.hires,
    },
    {
      name: "Conversion Rate (%)",
      You: data.you.conversionRate,
      "Top Performer": data.topPerformer.conversionRate,
      Average: data.average.conversionRate,
    },
    {
      name: "Avg Time to Hire (days)",
      You: data.you.avgTimeToHire,
      "Top Performer": data.topPerformer.avgTimeToHire,
      Average: data.average.avgTimeToHire,
    },
  ]

  // Transform data for radar chart
  // Normalize values for radar chart (0-100 scale)
  const normalizeValue = (value: number, metric: string) => {
    if (metric === "Avg Time to Hire (days)") {
      // For time to hire, lower is better, so invert the scale
      const max = Math.max(data.you.avgTimeToHire, data.topPerformer.avgTimeToHire, data.average.avgTimeToHire)
      return 100 - (value / max) * 100
    } else {
      const max =
        metric === "Referrals"
          ? Math.max(data.you.referrals, data.topPerformer.referrals, data.average.referrals)
          : metric === "Hires"
            ? Math.max(data.you.hires, data.topPerformer.hires, data.average.hires)
            : Math.max(data.you.conversionRate, data.topPerformer.conversionRate, data.average.conversionRate)

      return (value / max) * 100
    }
  }

  const radarChartData = [
    {
      metric: "Referrals",
      You: normalizeValue(data.you.referrals, "Referrals"),
      "Top Performer": normalizeValue(data.topPerformer.referrals, "Referrals"),
      Average: normalizeValue(data.average.referrals, "Referrals"),
      fullMark: 100,
    },
    {
      metric: "Hires",
      You: normalizeValue(data.you.hires, "Hires"),
      "Top Performer": normalizeValue(data.topPerformer.hires, "Hires"),
      Average: normalizeValue(data.average.hires, "Hires"),
      fullMark: 100,
    },
    {
      metric: "Conversion Rate",
      You: normalizeValue(data.you.conversionRate, "Conversion Rate (%)"),
      "Top Performer": normalizeValue(data.topPerformer.conversionRate, "Conversion Rate (%)"),
      Average: normalizeValue(data.average.conversionRate, "Conversion Rate (%)"),
      fullMark: 100,
    },
    {
      metric: "Time Efficiency",
      You: normalizeValue(data.you.avgTimeToHire, "Avg Time to Hire (days)"),
      "Top Performer": normalizeValue(data.topPerformer.avgTimeToHire, "Avg Time to Hire (days)"),
      Average: normalizeValue(data.average.avgTimeToHire, "Avg Time to Hire (days)"),
      fullMark: 100,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
        <CardDescription>Compare your performance with other recruiters</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="radar">Radar Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="You" fill="#0A3C1F" />
                <Bar dataKey="Top Performer" fill="#FFD700" />
                <Bar dataKey="Average" fill="#9CA3AF" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="radar" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="You" dataKey="You" stroke="#0A3C1F" fill="#0A3C1F" fillOpacity={0.6} />
                <Radar name="Top Performer" dataKey="Top Performer" stroke="#FFD700" fill="#FFD700" fillOpacity={0.6} />
                <Radar name="Average" dataKey="Average" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
