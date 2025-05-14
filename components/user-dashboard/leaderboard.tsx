"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface LeaderboardUser {
  user_id: string
  full_name: string
  total_points: number
  rank: number
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const { data: session } = await supabase.auth.getSession()
        const currentUserId = session.session?.user.id

        // Fetch top 10 users by points
        const { data, error } = await supabase.rpc("get_leaderboard", { limit_count: 10 })

        if (error) {
          // If the RPC doesn't exist, fall back to a regular query
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("user_points_total_view")
            .select(`
              user_id,
              total_points,
              recruit_users!inner(full_name)
            `)
            .order("total_points", { ascending: false })
            .limit(10)

          if (fallbackError) throw fallbackError

          // Transform the data to match the expected format
          const transformedData = fallbackData.map((item, index) => ({
            user_id: item.user_id,
            full_name: item.recruit_users.full_name,
            total_points: item.total_points,
            rank: index + 1,
          }))

          setLeaderboardData(transformedData)

          // Find current user's rank
          if (currentUserId) {
            const currentUser = transformedData.find((user) => user.user_id === currentUserId)
            if (currentUser) {
              setCurrentUserRank(currentUser)
            } else {
              // Fetch current user's rank if not in top 10
              const { data: userData, error: userError } = await supabase
                .from("user_points_total_view")
                .select(`
                  user_id,
                  total_points,
                  recruit_users!inner(full_name)
                `)
                .eq("user_id", currentUserId)
                .single()

              if (!userError && userData) {
                // Calculate rank (this is approximate)
                const { count, error: countError } = await supabase
                  .from("user_points_total_view")
                  .select("user_id", { count: "exact", head: true })
                  .gt("total_points", userData.total_points)

                if (!countError) {
                  setCurrentUserRank({
                    user_id: userData.user_id,
                    full_name: userData.recruit_users.full_name,
                    total_points: userData.total_points,
                    rank: (count || 0) + 1,
                  })
                }
              }
            }
          }
        } else {
          setLeaderboardData(data || [])

          // Find current user in the leaderboard
          if (currentUserId) {
            const currentUser = data?.find((user: LeaderboardUser) => user.user_id === currentUserId)
            if (currentUser) {
              setCurrentUserRank(currentUser)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [supabase])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />
      default:
        return (
          <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-gray-700">{rank}</span>
        )
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.length > 0 ? (
            <div className="space-y-3">
              {leaderboardData.map((user) => (
                <div
                  key={user.user_id}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    user.user_id === currentUserRank?.user_id ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="w-8 h-8 border border-gray-200">
                      <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.full_name}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold">
                    {user.total_points}
                    <span className="text-xs text-gray-500">pts</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">No leaderboard data available</div>
          )}

          {currentUserRank && !leaderboardData.some((user) => user.user_id === currentUserRank.user_id) && (
            <div className="mt-4">
              <div className="py-2 text-sm text-center text-gray-500">Your Ranking</div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                    {getRankIcon(currentUserRank.rank)}
                  </div>
                  <Avatar className="w-8 h-8 border border-gray-200">
                    <AvatarFallback>{getInitials(currentUserRank.full_name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{currentUserRank.full_name}</span>
                </div>
                <div className="flex items-center gap-1 font-bold">
                  {currentUserRank.total_points}
                  <span className="text-xs text-gray-500">pts</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
