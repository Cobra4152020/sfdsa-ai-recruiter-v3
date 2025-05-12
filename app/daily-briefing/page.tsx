"use client"

import { useEffect, useState } from "react"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingLeaderboard } from "@/components/daily-briefing/briefing-leaderboard"
import type { DailyBriefing, BriefingStats as BriefingStatsType } from "@/lib/daily-briefing-service"
import { useUser } from "@/context/user-context"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DailyBriefingPage() {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null)
  const [stats, setStats] = useState<BriefingStatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userStreak, setUserStreak] = useState(0)
  const { currentUser, isLoading: isUserLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch today's briefing
        const response = await fetch("/api/daily-briefing/today")

        if (!response.ok) {
          throw new Error("Failed to fetch daily briefing")
        }

        const data = await response.json()
        setBriefing(data.briefing)

        // Fetch stats for the briefing
        if (data.briefing) {
          const statsResponse = await fetch(`/api/daily-briefing/stats?briefingId=${data.briefing.id}`)

          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            setStats(statsData.stats)
          }
        }
      } catch (error) {
        console.error("Error fetching briefing:", error)
        setError("Failed to load today's briefing. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBriefing()
  }, [])

  const handleShare = async (platform: string) => {
    if (!briefing || !currentUser) return false

    try {
      const response = await fetch("/api/daily-briefing/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          briefingId: briefing.id,
          platform,
        }),
      })

      if (!response.ok) {
        return false
      }

      // Refresh stats after sharing
      const statsResponse = await fetch(`/api/daily-briefing/stats?briefingId=${briefing.id}`)

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      return true
    } catch (error) {
      console.error("Error sharing:", error)
      return false
    }
  }

  if (isLoading || isUserLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 text-[#0A3C1F] dark:text-[#FFD700] animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading Sgt. Ken's Daily Briefing...
          </h2>
        </div>
      </div>
    )
  }

  if (error || !briefing) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {error || "No briefing available for today"}
          </h2>
          <Button
            onClick={() => router.refresh()}
            className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#FFD700] dark:text-[#121212] dark:hover:bg-[#FFD700]/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#0A3C1F] dark:text-[#FFD700]">
        Sgt. Ken's Daily Briefing
      </h1>

      {!currentUser && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-center">
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Sign in to earn points!</strong> Attend daily briefings and share them to climb the leaderboard.
          </p>
          <div className="mt-2">
            <Button
              onClick={() => router.push("/login")}
              className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#FFD700] dark:text-[#121212] dark:hover:bg-[#FFD700]/90"
            >
              Sign In
            </Button>
          </div>
        </div>
      )}

      <BriefingCard
        briefing={briefing}
        stats={
          stats || {
            total_attendees: 0,
            total_shares: 0,
            user_attended: false,
            user_shared: false,
            user_platforms_shared: [],
          }
        }
        onShare={handleShare}
      />

      {stats && <BriefingStats stats={stats} userStreak={userStreak} />}

      <BriefingLeaderboard />

      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">About Daily Briefings</h2>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            <strong>Sgt. Ken's Daily Briefing</strong> is your daily dose of motivation, information, and guidance on
            your journey to becoming a San Francisco Deputy Sheriff.
          </p>

          <h3>How It Works</h3>
          <ul>
            <li>
              <strong>Attend Daily:</strong> Visit this page each day to receive Sgt. Ken's latest briefing.
            </li>
            <li>
              <strong>Earn Points:</strong> Get 5 points just for attending the daily briefing.
            </li>
            <li>
              <strong>Share & Earn More:</strong> Share the briefing on social media to earn additional points:
              <ul>
                <li>Twitter/X: 10 points</li>
                <li>Facebook: 10 points</li>
                <li>LinkedIn: 15 points</li>
                <li>Instagram: 10 points</li>
                <li>Email: 5 points</li>
              </ul>
            </li>
            <li>
              <strong>Build Your Streak:</strong> Visit daily to build your attendance streak. Longer streaks may unlock
              special rewards!
            </li>
          </ul>

          <h3>Why Participate?</h3>
          <p>
            Daily briefings keep you informed, motivated, and connected to the San Francisco Deputy Sheriff recruitment
            community. The points you earn contribute to your overall recruitment profile and may help you stand out in
            the application process.
          </p>
        </div>
      </div>
    </div>
  )
}
