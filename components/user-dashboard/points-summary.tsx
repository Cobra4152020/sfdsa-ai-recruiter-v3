"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export default function PointsSummary() {
  const [points, setPoints] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchPointsData() {
      try {
        const { data: session } = await supabase.auth.getSession()

        if (!session.session) {
          setIsLoading(false)
          return
        }

        const userId = session.session.user.id

        // Fetch total points
        const { data: pointsData, error: pointsError } = await supabase
          .from("user_points_total_view")
          .select("total_points")
          .eq("user_id", userId)
          .single()

        if (pointsError) throw pointsError

        // Fetch recent point activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from("user_points")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5)

        if (activitiesError) throw activitiesError

        setPoints(pointsData?.total_points || 0)
        setRecentActivities(activitiesData || [])
      } catch (error) {
        console.error("Error fetching points data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPointsData()
  }, [supabase])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Points Summary</CardTitle>
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
          <Star className="w-5 h-5 text-yellow-500" />
          Points Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total Points</div>
            <div className="text-2xl font-bold">{points || 0}</div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-500">Recent Activity</h4>
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
                        +{activity.points}
                      </Badge>
                      <span className="text-sm">{activity.reason}</span>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(activity.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">No recent activity</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
