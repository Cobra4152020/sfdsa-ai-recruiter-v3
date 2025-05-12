import { Suspense } from "react"
import { JourneyPerformanceDashboard } from "@/components/journey-performance-dashboard"
import { supabase } from "@/lib/supabase-client"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "User Journey Performance | Admin Dashboard",
  description: "Monitor and analyze user journey performance across your application",
}

async function getJourneyData() {
  // Fetch journey summaries
  const { data: summaries, error: summariesError } = await supabase.from("journey_performance_summary").select("*")

  if (summariesError) {
    console.error("Error fetching journey summaries:", summariesError)
    return { summaries: [], steps: [], funnels: [] }
  }

  // Fetch journey steps
  const { data: steps, error: stepsError } = await supabase.from("journey_step_performance").select("*")

  if (stepsError) {
    console.error("Error fetching journey steps:", stepsError)
    return { summaries: summaries || [], steps: [], funnels: [] }
  }

  // Fetch journey funnels
  const { data: funnels, error: funnelsError } = await supabase.from("journey_funnel_analysis").select("*")

  if (funnelsError) {
    console.error("Error fetching journey funnels:", funnelsError)
    return { summaries: summaries || [], steps: steps || [], funnels: [] }
  }

  return {
    summaries: summaries || [],
    steps: steps || [],
    funnels: funnels || [],
  }
}

export default async function JourneyPerformancePage() {
  const initialData = await getJourneyData()

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">User Journey Performance</h1>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <JourneyPerformanceDashboard initialData={initialData} />
      </Suspense>
    </div>
  )
}
