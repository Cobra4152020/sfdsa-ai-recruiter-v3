"use client"

import { useState, useEffect } from "react"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingHistory } from "@/components/daily-briefing/briefing-history"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, RefreshCw, Calendar } from "lucide-react"
import type { DailyBriefing } from "@/lib/daily-briefing-service"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

export function DailyBriefingContent() {
  const searchParams = useSearchParams()
  const dateParam = searchParams?.get("date")

  const [briefing, setBriefing] = useState<DailyBriefing | null>(null)
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalAttended: 0,
    totalPoints: 0,
    lastAttendance: null as string | null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchBriefing = async () => {
    setLoading(true)
    setError(null)
    setErrorMessage(null)

    try {
      console.log("Fetching briefing from API, attempt:", retryCount + 1)

      // Add date parameter if provided
      const url = dateParam
        ? `/api/daily-briefing?date=${dateParam}&t=${Date.now()}`
        : `/api/daily-briefing?t=${Date.now()}`

      const response = await fetch(url)

      if (!response.ok) {
        const data = await response.json()
        console.error("Error response from API:", data)
        setError(data.error || "Failed to fetch briefing")
        setErrorMessage(data.message || "Please try again later")
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log("Briefing data received:", data)

      if (!data.briefing) {
        console.error("No briefing data in response")
        setError("No briefing available")
        setErrorMessage("There is no briefing available at this time. Please check back later.")
        setLoading(false)
        return
      }

      setBriefing(data.briefing)
    } catch (err) {
      console.error("Exception in fetchBriefing:", err)
      setError("Failed to load briefing")
      setErrorMessage("An unexpected error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    // Only fetch stats if we're not viewing a historical briefing
    if (dateParam) return

    try {
      const response = await fetch("/api/daily-briefing/stats")

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (err) {
      console.error("Error fetching stats:", err)
    }
  }

  useEffect(() => {
    fetchBriefing()
    fetchStats()
  }, [retryCount, dateParam]) // Re-fetch when retryCount or dateParam changes

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  const handleAttend = async (briefingId: string) => {
    // Don't allow attending historical briefings
    if (dateParam) {
      return { success: false, points: 0 }
    }

    try {
      const response = await fetch("/api/daily-briefing/attend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ briefingId }),
      })

      if (!response.ok) {
        throw new Error("Failed to record attendance")
      }

      const result = await response.json()

      // Update stats after successful attendance
      fetchStats()

      return result
    } catch (err) {
      console.error("Error attending briefing:", err)
      return { success: false, points: 0 }
    }
  }

  const handleShare = async (briefingId: string, platform: string) => {
    try {
      const response = await fetch("/api/daily-briefing/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ briefingId, platform }),
      })

      if (!response.ok) {
        throw new Error("Failed to record share")
      }

      const result = await response.json()

      // Update stats after successful share
      fetchStats()

      return result
    } catch (err) {
      console.error("Error sharing briefing:", err)
      return { success: false, points: 0 }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Loading Briefing
          </Button>
        </div>

        {!dateParam && <BriefingHistory />}
      </div>
    )
  }

  if (!briefing) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Briefing Available</AlertTitle>
          <AlertDescription>There is no briefing available for today. Please check back later.</AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Loading Briefing
          </Button>
        </div>

        {!dateParam && <BriefingHistory />}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {dateParam && (
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <div className="text-sm text-gray-500">Viewing historical briefing</div>
          <Button variant="outline" size="sm" asChild>
            <a href="/daily-briefing">
              <Calendar className="h-4 w-4 mr-2" />
              View Today's Briefing
            </a>
          </Button>
        </div>
      )}

      <BriefingCard briefing={briefing} onAttend={handleAttend} onShare={handleShare} isHistorical={!!dateParam} />

      {!dateParam && (
        <BriefingStats
          currentStreak={stats.currentStreak}
          longestStreak={stats.longestStreak}
          totalAttended={stats.totalAttended}
          totalPoints={stats.totalPoints}
          lastAttendance={stats.lastAttendance}
        />
      )}

      {!dateParam && <BriefingHistory />}
    </div>
  )
}
