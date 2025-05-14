"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart } from "@/components/ui/charts"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type JourneySummary = {
  journey_name: string
  total_journeys: number
  completed_journeys: number
  abandoned_journeys: number
  avg_duration: number
  median_duration: number
  p95_duration: number
  min_duration: number
  max_duration: number
  avg_steps: number
  unique_users: number
  unique_sessions: number
}

type JourneyStep = {
  journey_name: string
  step_name: string
  step_number: number
  avg_duration: number
  median_duration: number
  p95_duration: number
  occurrences: number
}

type JourneyFunnel = {
  journey_name: string
  step_number: number
  step_name: string
  step_count: number
  total_journeys: number
  completion_rate: number
  step_retention_rate: number
}

type JourneyPerformanceDashboardProps = {
  initialData?: {
    summaries?: JourneySummary[]
    steps?: JourneyStep[]
    funnels?: JourneyFunnel[]
  }
}

export function JourneyPerformanceDashboard({ initialData }: JourneyPerformanceDashboardProps) {
  const [loading, setLoading] = useState(!initialData)
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedJourney, setSelectedJourney] = useState<string>("all")
  const [journeySummaries, setJourneySummaries] = useState<JourneySummary[]>(initialData?.summaries || [])
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>(initialData?.steps || [])
  const [journeyFunnels, setJourneyFunnels] = useState<JourneyFunnel[]>(initialData?.funnels || [])

  useEffect(() => {
    if (initialData) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/performance/journeys?timeRange=${timeRange}&journey=${selectedJourney}`)

        if (!response.ok) {
          throw new Error("Failed to fetch journey performance data")
        }

        const data = await response.json()

        setJourneySummaries(data.summaries || [])
        setJourneySteps(data.steps || [])
        setJourneyFunnels(data.funnels || [])
      } catch (error) {
        console.error("Error fetching journey performance data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, selectedJourney, initialData])

  // Get unique journey names for the dropdown
  const journeyNames = Array.from(new Set(journeySummaries.map((summary) => summary.journey_name)))

  // Filter data based on selected journey
  const filteredSteps =
    selectedJourney === "all" ? journeySteps : journeySteps.filter((step) => step.journey_name === selectedJourney)

  const filteredFunnels =
    selectedJourney === "all"
      ? journeyFunnels
      : journeyFunnels.filter((funnel) => funnel.journey_name === selectedJourney)

  // Prepare data for charts
  const completionRateData = journeySummaries.map((summary) => ({
    name: formatJourneyName(summary.journey_name),
    completionRate: (summary.completed_journeys / summary.total_journeys) * 100,
    totalJourneys: summary.total_journeys,
  }))

  const durationData = journeySummaries.map((summary) => ({
    name: formatJourneyName(summary.journey_name),
    avgDuration: summary.avg_duration / 1000, // Convert to seconds
    p95Duration: summary.p95_duration / 1000,
  }))

  // Prepare funnel data for the selected journey
  const funnelData = filteredFunnels
    .sort((a, b) => a.step_number - b.step_number)
    .map((funnel) => ({
      step: funnel.step_name,
      users: funnel.step_count,
      completionRate: funnel.completion_rate,
    }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">User Journey Performance</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedJourney} onValueChange={setSelectedJourney}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select journey" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Journeys</SelectItem>
              {journeyNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {formatJourneyName(name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="steps">Step Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-3 w-1/2 mt-2" />
                    </CardContent>
                  </Card>
                ))
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Total Journeys</CardTitle>
                    <CardDescription>Across all journey types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {journeySummaries.reduce((sum, journey) => sum + journey.total_journeys, 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {journeySummaries.reduce((sum, journey) => sum + journey.unique_users, 0).toLocaleString()} unique
                      users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Completion Rate</CardTitle>
                    <CardDescription>Average across all journeys</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{calculateOverallCompletionRate(journeySummaries)}%</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {journeySummaries.reduce((sum, journey) => sum + journey.completed_journeys, 0).toLocaleString()}{" "}
                      completed journeys
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Avg. Duration</CardTitle>
                    <CardDescription>Time to complete journeys</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {formatDuration(calculateWeightedAverageDuration(journeySummaries))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      P95: {formatDuration(calculateWeightedP95Duration(journeySummaries))}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Avg. Steps</CardTitle>
                    <CardDescription>Steps per journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {calculateWeightedAverageSteps(journeySummaries).toFixed(1)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Across {journeySummaries.length} journey types</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Journey Completion Rates</CardTitle>
                <CardDescription>Percentage of users completing each journey</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : completionRateData.length > 0 ? (
                  <div className="h-[300px]">
                    <BarChart
                      data={completionRateData}
                      xField="name"
                      yField="completionRate"
                      height={300}
                      tooltipFormat={(value) => `${value.toFixed(1)}%`}
                      valueFormatter={(value) => `${value.toFixed(1)}%`}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No journey data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Journey Durations</CardTitle>
                <CardDescription>Average time to complete each journey</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : durationData.length > 0 ? (
                  <div className="h-[300px]">
                    <BarChart
                      data={durationData}
                      xField="name"
                      yField="avgDuration"
                      height={300}
                      tooltipFormat={(value) => formatDuration(value * 1000)}
                      valueFormatter={(value) => `${value.toFixed(1)}s`}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No journey data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Journey Performance Summary</CardTitle>
              <CardDescription>Detailed metrics for each journey type</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : journeySummaries.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Journey</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Completion</TableHead>
                        <TableHead className="text-right">Avg. Duration</TableHead>
                        <TableHead className="text-right">P95 Duration</TableHead>
                        <TableHead className="text-right">Avg. Steps</TableHead>
                        <TableHead className="text-right">Unique Users</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {journeySummaries.map((summary) => (
                        <TableRow key={summary.journey_name}>
                          <TableCell className="font-medium">{formatJourneyName(summary.journey_name)}</TableCell>
                          <TableCell className="text-right">{summary.total_journeys.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <JourneyCompletionBadge
                              rate={(summary.completed_journeys / summary.total_journeys) * 100}
                            />
                          </TableCell>
                          <TableCell className="text-right">{formatDuration(summary.avg_duration)}</TableCell>
                          <TableCell className="text-right">{formatDuration(summary.p95_duration)}</TableCell>
                          <TableCell className="text-right">{summary.avg_steps.toFixed(1)}</TableCell>
                          <TableCell className="text-right">{summary.unique_users.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[100px] text-muted-foreground">
                  No journey data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedJourney === "all"
                  ? "Select a Journey to View Funnel"
                  : `${formatJourneyName(selectedJourney)} Funnel`}
              </CardTitle>
              <CardDescription>
                {selectedJourney === "all"
                  ? "Choose a specific journey from the dropdown to see its conversion funnel"
                  : "Step-by-step conversion rates for this journey"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : selectedJourney !== "all" && funnelData.length > 0 ? (
                <div className="space-y-8">
                  <div className="h-[300px]">
                    <BarChart
                      data={funnelData}
                      xField="step"
                      yField="users"
                      height={300}
                      tooltipFormat={(value) => `${value.toLocaleString()} users`}
                      valueFormatter={(value) => `${value.toLocaleString()}`}
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Step</TableHead>
                          <TableHead className="text-right">Users</TableHead>
                          <TableHead className="text-right">Completion Rate</TableHead>
                          <TableHead className="text-right">Drop-off</TableHead>
                          <TableHead className="text-right">Step Retention</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFunnels
                          .sort((a, b) => a.step_number - b.step_number)
                          .map((funnel) => (
                            <TableRow key={`${funnel.journey_name}-${funnel.step_number}`}>
                              <TableCell className="font-medium">
                                {funnel.step_number}. {funnel.step_name}
                              </TableCell>
                              <TableCell className="text-right">{funnel.step_count.toLocaleString()}</TableCell>
                              <TableCell className="text-right">
                                <JourneyCompletionBadge rate={funnel.completion_rate} />
                              </TableCell>
                              <TableCell className="text-right">
                                {funnel.step_number === 1 ? "-" : `${(100 - funnel.step_retention_rate).toFixed(1)}%`}
                              </TableCell>
                              <TableCell className="text-right">
                                {funnel.step_number === 1 ? "100%" : `${funnel.step_retention_rate.toFixed(1)}%`}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : selectedJourney !== "all" ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No funnel data available for this journey
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  Select a journey from the dropdown to view its funnel
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Step Performance</CardTitle>
              <CardDescription>
                {selectedJourney === "all"
                  ? "Performance metrics for all journey steps"
                  : `Performance metrics for ${formatJourneyName(selectedJourney)} steps`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : filteredSteps.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Journey</TableHead>
                        <TableHead>Step</TableHead>
                        <TableHead className="text-right">Occurrences</TableHead>
                        <TableHead className="text-right">Avg. Duration</TableHead>
                        <TableHead className="text-right">Median</TableHead>
                        <TableHead className="text-right">P95</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSteps
                        .sort((a, b) => {
                          if (a.journey_name === b.journey_name) {
                            return a.step_number - b.step_number
                          }
                          return a.journey_name.localeCompare(b.journey_name)
                        })
                        .map((step) => (
                          <TableRow key={`${step.journey_name}-${step.step_name}-${step.step_number}`}>
                            <TableCell className="font-medium">
                              {selectedJourney === "all"
                                ? formatJourneyName(step.journey_name)
                                : `#${step.step_number}`}
                            </TableCell>
                            <TableCell>{step.step_name}</TableCell>
                            <TableCell className="text-right">{step.occurrences.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{formatDuration(step.avg_duration)}</TableCell>
                            <TableCell className="text-right">{formatDuration(step.median_duration)}</TableCell>
                            <TableCell className="text-right">{formatDuration(step.p95_duration)}</TableCell>
                            <TableCell>
                              <StepPerformanceBadge duration={step.avg_duration} journeyType={step.journey_name} />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No step data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function JourneyCompletionBadge({ rate }: { rate: number }) {
  let variant = "default"

  if (rate >= 80) variant = "success"
  else if (rate >= 50) variant = "warning"
  else variant = "destructive"

  return <Badge variant={variant as any}>{rate.toFixed(1)}%</Badge>
}

function StepPerformanceBadge({ duration, journeyType }: { duration: number; journeyType: string }) {
  // Define thresholds based on journey type (in milliseconds)
  const thresholds: Record<string, [number, number]> = {
    login: [2000, 5000],
    registration: [5000, 10000],
    application: [10000, 30000],
    "game-playing": [3000, 8000],
    "profile-view": [2000, 5000],
    "badge-earning": [3000, 8000],
    trivia: [4000, 10000],
    leaderboard: [2000, 5000],
    default: [3000, 8000],
  }

  const [goodThreshold, improvementThreshold] = thresholds[journeyType] || thresholds.default

  let variant = "default"
  let label = ""

  if (duration <= goodThreshold) {
    variant = "success"
    label = "Good"
  } else if (duration <= improvementThreshold) {
    variant = "warning"
    label = "Needs Improvement"
  } else {
    variant = "destructive"
    label = "Poor"
  }

  return <Badge variant={variant as any}>{label}</Badge>
}

// Helper functions
function formatJourneyName(name: string): string {
  return name
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

function calculateOverallCompletionRate(summaries: JourneySummary[]): string {
  const totalJourneys = summaries.reduce((sum, journey) => sum + journey.total_journeys, 0)
  const completedJourneys = summaries.reduce((sum, journey) => sum + journey.completed_journeys, 0)

  if (totalJourneys === 0) return "0.0"
  return ((completedJourneys / totalJourneys) * 100).toFixed(1)
}

function calculateWeightedAverageDuration(summaries: JourneySummary[]): number {
  const totalCompletedJourneys = summaries.reduce((sum, journey) => sum + journey.completed_journeys, 0)

  if (totalCompletedJourneys === 0) return 0

  const weightedSum = summaries.reduce((sum, journey) => sum + journey.avg_duration * journey.completed_journeys, 0)

  return weightedSum / totalCompletedJourneys
}

function calculateWeightedP95Duration(summaries: JourneySummary[]): number {
  const totalCompletedJourneys = summaries.reduce((sum, journey) => sum + journey.completed_journeys, 0)

  if (totalCompletedJourneys === 0) return 0

  const weightedSum = summaries.reduce((sum, journey) => sum + journey.p95_duration * journey.completed_journeys, 0)

  return weightedSum / totalCompletedJourneys
}

function calculateWeightedAverageSteps(summaries: JourneySummary[]): number {
  const totalJourneys = summaries.reduce((sum, journey) => sum + journey.total_journeys, 0)

  if (totalJourneys === 0) return 0

  const weightedSum = summaries.reduce((sum, journey) => sum + journey.avg_steps * journey.total_journeys, 0)

  return weightedSum / totalJourneys
}
