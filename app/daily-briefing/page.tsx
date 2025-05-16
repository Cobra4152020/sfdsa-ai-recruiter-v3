"use client"

import { Suspense, useEffect, useState } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingLeaderboard } from "@/components/daily-briefing/briefing-leaderboard"
import { useToast } from "@/components/ui/use-toast"
import type { DailyBriefing, BriefingStats as BriefingStatsType } from "@/lib/daily-briefing-service"

// Main page component
export default function DailyBriefingPage() {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null)
  const [stats, setStats] = useState<BriefingStatsType>({
    total_attendees: 0,
    total_shares: 0,
    user_attended: false,
    user_shared: false,
    user_platforms_shared: [],
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBriefingData = async () => {
      try {
        setLoading(true)
        // Fetch today's briefing
        const response = await fetch('/api/daily-briefing/today')
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setBriefing(data.briefing)
        setStats(data.stats)
      } catch (error) {
        console.error('Error fetching briefing:', error)
        toast({
          title: "Error",
          description: "Failed to load today's briefing. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBriefingData()
  }, [toast])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Briefing</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ErrorBoundary
            fallback={
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Today's Briefing</h2>
                <p className="text-gray-500">The briefing content is temporarily unavailable.</p>
              </div>
            }
          >
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              {loading ? (
                <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
              ) : (
                <BriefingCard briefing={briefing} />
              )}
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="space-y-8">
          <ErrorBoundary
            fallback={
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Briefing Statistics</h3>
                <p className="text-gray-500">Statistics temporarily unavailable</p>
              </div>
            }
          >
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              {loading ? (
                <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
              ) : (
                <BriefingStats stats={stats} userStreak={briefing?.userStreak || 0} />
              )}
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Attendance Leaders</h3>
                <p className="text-gray-500">Leaderboard temporarily unavailable</p>
              </div>
            }
          >
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              <BriefingLeaderboard />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
