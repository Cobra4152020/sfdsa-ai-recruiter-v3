"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Users, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalPoints: 0,
    rank: "Recruit",
    referrals: 0,
    completedChallenges: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createBrowserClient()

        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        // Fetch user stats - this is a placeholder, replace with your actual queries
        // For now, we'll just use some dummy data
        setStats({
          totalPoints: 250,
          rank: "Deputy",
          referrals: 3,
          completedChallenges: 5,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <>
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">Loading...</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Current Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">Loading...</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">Loading...</div>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <Card className="bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">Total Points</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-700">{stats.totalPoints}</div>
          <Star className="h-5 w-5 text-blue-600" />
        </CardContent>
      </Card>

      <Card className="bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600">Current Rank</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-700">{stats.rank}</div>
          <Award className="h-5 w-5 text-green-600" />
        </CardContent>
      </Card>

      <Card className="bg-purple-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-600">Referrals</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-2xl font-bold text-purple-700">{stats.referrals}</div>
          <Users className="h-5 w-5 text-purple-600" />
        </CardContent>
      </Card>
    </>
  )
}
