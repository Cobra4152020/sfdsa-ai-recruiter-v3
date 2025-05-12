"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"
import { createClient } from "@/lib/supabase-clients"
import { useUser } from "@/context/user-context"

export function BriefingStreakBadge() {
  const [streak, setStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { currentUser } = useUser()

  useEffect(() => {
    const fetchStreak = async () => {
      if (!currentUser) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()

        // Get the user's attendance records, ordered by date
        const { data, error } = await supabase
          .from("briefing_attendance")
          .select("attended_at")
          .eq("user_id", currentUser.id)
          .order("attended_at", { ascending: false })

        if (error) {
          console.error("Error fetching attendance:", error)
          setIsLoading(false)
          return
        }

        if (!data || data.length === 0) {
          setStreak(0)
          setIsLoading(false)
          return
        }

        // Calculate streak
        let currentStreak = 1
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        // Check if the most recent attendance is from today or yesterday
        const mostRecent = new Date(data[0].attended_at)
        mostRecent.setHours(0, 0, 0, 0)

        const isToday = mostRecent.getTime() === today.getTime()
        const isYesterday = mostRecent.getTime() === yesterday.getTime()

        if (!isToday && !isYesterday) {
          // Streak broken
          setStreak(0)
          setIsLoading(false)
          return
        }

        // Calculate consecutive days
        for (let i = 1; i < data.length; i++) {
          const current = new Date(data[i - 1].attended_at)
          current.setHours(0, 0, 0, 0)

          const previous = new Date(data[i].attended_at)
          previous.setHours(0, 0, 0, 0)

          // Check if dates are consecutive
          const diffTime = Math.abs(current.getTime() - previous.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          if (diffDays === 1) {
            currentStreak++
          } else {
            break
          }
        }

        setStreak(currentStreak)
      } catch (error) {
        console.error("Error calculating streak:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStreak()
  }, [currentUser])

  if (isLoading || streak === 0) {
    return null
  }

  return (
    <Badge
      variant="outline"
      className="bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/50 flex items-center gap-1 px-2 py-1"
    >
      <Flame className="h-4 w-4 text-orange-500" />
      <span>{streak} day streak</span>
    </Badge>
  )
}
