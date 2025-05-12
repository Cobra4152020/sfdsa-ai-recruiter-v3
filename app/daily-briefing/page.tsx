import { Suspense } from "react"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingLeaderboard } from "@/components/daily-briefing/briefing-leaderboard"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

// Fallback briefing data
const fallbackBriefing = {
  id: "fallback-briefing",
  title: "San Francisco Deputy Sheriff's Daily Briefing",
  content: `
  # Today's Briefing
  
  ## Safety Reminders
  - Always be aware of your surroundings
  - Check your equipment before starting your shift
  - Report any safety concerns immediately
  
  ## Community Engagement
  - Remember to engage positively with community members
  - Be a visible presence in your assigned areas
  - Listen to community concerns and relay them appropriately
  
  ## Department Updates
  - Regular training sessions continue next week
  - New communication protocols are being implemented
  - Remember to complete all required documentation promptly
  
  Stay safe and thank you for your service!
  `,
  date: new Date().toISOString(),
  theme: "Safety",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

async function getDailyBriefing() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/daily-briefing/today`, {
      next: { revalidate: 3600 },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch daily briefing: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching daily briefing:", error)
    return {
      briefing: fallbackBriefing,
      error: "Failed to load today's briefing. Using fallback content.",
    }
  }
}

export default async function DailyBriefingPage() {
  const { briefing, error } = await getDailyBriefing()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Briefing</h1>

      {error && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <BriefingCard briefing={briefing} />
          </Suspense>
        </div>

        <div className="space-y-8">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <BriefingStats />
          </Suspense>

          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <BriefingLeaderboard />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
