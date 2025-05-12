import { Suspense } from "react"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingLeaderboard } from "@/components/daily-briefing/briefing-leaderboard"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

async function getDailyBriefing() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "http://localhost:3000"}/api/daily-briefing/today`,
      {
        next: { revalidate: 3600 },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch daily briefing: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching daily briefing:", error)
    return { briefing: null, error: "Failed to load today's briefing" }
  }
}

export default async function DailyBriefingPage() {
  const { briefing, error } = await getDailyBriefing()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Briefing</h1>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p>{error}</p>
        </div>
      ) : (
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
      )}
    </div>
  )
}
