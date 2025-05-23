import { createClient } from '@/app/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JourneyPerformanceDashboard } from "@/components/journey-performance-dashboard"

export default async function JourneyPerformancePage() {
  const supabase = await createClient()

  const { data: performance } = await supabase
    .from('journey_performance')
    .select('*')
    .order('created_at', { ascending: false })

  // Transform the data to match the expected interface
  const initialData = {
    summaries: performance?.map(item => ({
      journey_name: item.journey_name || '',
      total_journeys: item.total_journeys || 0,
      completed_journeys: item.completed_journeys || 0,
      abandoned_journeys: item.abandoned_journeys || 0,
      avg_duration: item.avg_duration || 0,
      median_duration: item.median_duration || 0,
      p95_duration: item.p95_duration || 0,
      min_duration: item.min_duration || 0,
      max_duration: item.max_duration || 0,
      avg_steps: item.avg_steps || 0,
      unique_users: item.unique_users || 0,
      unique_sessions: item.unique_sessions || 0
    })) || [],
    steps: performance?.map(item => ({
      journey_name: item.journey_name || '',
      step_name: item.step_name || '',
      step_number: item.step_number || 0,
      avg_duration: item.avg_duration || 0,
      median_duration: item.median_duration || 0,
      p95_duration: item.p95_duration || 0,
      occurrences: item.occurrences || 0
    })) || [],
    funnels: performance?.map(item => ({
      journey_name: item.journey_name || '',
      step_number: item.step_number || 0,
      step_name: item.step_name || '',
      step_count: item.step_count || 0,
      total_journeys: item.total_journeys || 0,
      completion_rate: item.completion_rate || 0,
      step_retention_rate: item.step_retention_rate || 0
    })) || []
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Journey Performance</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>View and analyze journey performance metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <JourneyPerformanceDashboard initialData={initialData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Performance Data</CardTitle>
            <CardDescription>Detailed view of recent performance entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performance?.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {item.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Score: {item.score}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
