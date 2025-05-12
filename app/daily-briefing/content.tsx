"use client"

import { useState, useEffect } from "react"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingHistory } from "@/components/daily-briefing/briefing-history"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Calendar } from "lucide-react"
import type { DailyBriefing } from "@/lib/daily-briefing-service"
import { Button } from "@/components/ui/button"

export function DailyBriefingContent() {
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

  const fetchBriefing = async () => {
    setLoading(true)
    setError(null)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/daily-briefing")
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to fetch briefing")
        setErrorMessage(data.message || "Please try again later")
        return
      }

      setBriefing(data.briefing)
    } catch (err) {
      console.error("Error fetching briefing:", err)
      setError("Failed to load briefing")
      setErrorMessage("An unexpected error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
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
  }, [])

  const handleAttend = async (briefingId: string) => {
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
          <Button onClick={fetchBriefing} className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Retry Loading Briefing
          </Button>
        </div>

        <BriefingHistory />
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

        <BriefingHistory />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BriefingCard briefing={briefing} onAttend={handleAttend} onShare={handleShare} />

      <BriefingStats
        currentStreak={stats.currentStreak}
        longestStreak={stats.longestStreak}
        totalAttended={stats.totalAttended}
        totalPoints={stats.totalPoints}
        lastAttendance={stats.lastAttendance}
      />

      <BriefingHistory />
    </div>
  )
}
