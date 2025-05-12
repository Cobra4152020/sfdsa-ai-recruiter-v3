"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/user-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserBriefingStats } from "@/lib/daily-briefing-service"
import { Calendar, Medal, Share2, Flame, Trophy, BarChart } from "lucide-react"

export function BriefingStats() {
  const [stats, setStats] = useState<{
    totalAttendance: number
    totalShares: number
    currentStreak: number
    longestStreak: number
    pointsEarned: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const { currentUser, isLoggedIn } = useUser()

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn, currentUser])

  const fetchStats = async () => {
    try {
      setLoading(true)

      const stats = await getUserBriefingStats(currentUser!.id)
      setStats(stats)
    } catch (error) {
      console.error("Error fetching briefing stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn || !currentUser) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Sign in to view your briefing statistics</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Failed to load statistics</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="h-5 w-5 text-[#0A3C1F]" />
          Your Briefing Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Attendance stat */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300">Briefings Attended</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">{stats.totalAttendance}</p>
            </div>
          </div>

          {/* Shares stat */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-3">
              <Share2 className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-300">Shares</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-200">{stats.totalShares}</p>
            </div>
          </div>

          {/* Current streak stat */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center mr-3">
              <Flame className="h-5 w-5 text-amber-600 dark:text-amber-300" />
            </div>
            <div>
              <p className="text-sm text-amber-600 dark:text-amber-300">Current Streak</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-200">{stats.currentStreak} days</p>
            </div>
          </div>

          {/* Points earned stat */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mr-3">
              <Medal className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300">Points Earned</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">{stats.pointsEarned}</p>
            </div>
          </div>
        </div>

        {/* Longest streak badge */}
        {stats.longestStreak > 0 && (
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-[#0A3C1F] mr-2" />
              <span className="text-sm font-medium">
                Longest Streak: <span className="font-bold">{stats.longestStreak}</span> days
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
