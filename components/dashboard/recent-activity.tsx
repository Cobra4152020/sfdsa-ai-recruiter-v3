"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Award, Calendar, Share2, Users, Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type Activity = {
  id: string
  type: "briefing" | "challenge" | "referral" | "share" | "points"
  description: string
  points: number
  timestamp: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
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

        // For now, we'll use dummy data
        // In a real implementation, you would fetch this from your database
        setActivities([
          {
            id: "1",
            type: "briefing",
            description: "Attended Sgt. Ken's Daily Briefing",
            points: 25,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          },
          {
            id: "2",
            type: "challenge",
            description: "Completed the 'Know Your Department' challenge",
            points: 50,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          },
          {
            id: "3",
            type: "share",
            description: "Shared a briefing on Twitter",
            points: 15,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          },
          {
            id: "4",
            type: "referral",
            description: "Referred John Doe to the SFDSA",
            points: 100,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
          },
          {
            id: "5",
            type: "points",
            description: "Earned a streak bonus",
            points: 30,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
          },
        ])
      } catch (error) {
        console.error("Error fetching recent activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "briefing":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "challenge":
        return <Award className="h-4 w-4 text-green-600" />
      case "referral":
        return <Users className="h-4 w-4 text-purple-600" />
      case "share":
        return <Share2 className="h-4 w-4 text-amber-600" />
      case "points":
        return <Star className="h-4 w-4 text-indigo-600" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent actions and points earned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-3 bg-gray-100 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent actions and points earned</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent activity. Start completing actions to see your activity here!
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <div className="font-medium">{activity.description}</div>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-green-600">+{activity.points} pts</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
