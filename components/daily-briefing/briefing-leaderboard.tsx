"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, User } from "lucide-react"
import { createClient } from "@/lib/supabase-clients"
import { useUser } from "@/context/user-context"

interface LeaderboardEntry {
  user_id: string
  username: string
  avatar_url: string | null
  attendance_count: number
  share_count: number
  total_points: number
}

export function BriefingLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { currentUser } = useUser()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const supabase = createClient()

        // Get leaderboard data
        const { data, error } = await supabase.rpc("get_briefing_leaderboard").limit(10)

        if (error) {
          console.error("Error fetching leaderboard:", error)
          return
        }

        setLeaderboard(data || [])
      } catch (error) {
        console.error("Exception in fetchLeaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (isLoading) {
    return (
      <Card className="mt-6 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-[#FFD700]" />
            Daily Briefing Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-[#FFD700]" />
          Daily Briefing Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No data available yet. Be the first to join the leaderboard!
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = currentUser && entry.user_id === currentUser.id

              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center p-3 rounded-lg ${
                    isCurrentUser
                      ? "bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 border border-[#0A3C1F]/20 dark:border-[#FFD700]/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex-shrink-0 w-8 text-center">
                    {index === 0 ? (
                      <Medal className="h-6 w-6 text-[#FFD700]" />
                    ) : index === 1 ? (
                      <Medal className="h-6 w-6 text-gray-400" />
                    ) : index === 2 ? (
                      <Medal className="h-6 w-6 text-amber-700" />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 font-medium">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ml-3">
                    {entry.avatar_url ? (
                      <img
                        src={entry.avatar_url || "/placeholder.svg"}
                        alt={entry.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {entry.username}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-[#0A3C1F] dark:bg-[#FFD700] text-white dark:text-[#0A3C1F] px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {entry.attendance_count} briefings • {entry.share_count} shares
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="font-bold text-[#0A3C1F] dark:text-[#FFD700]">{entry.total_points}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
