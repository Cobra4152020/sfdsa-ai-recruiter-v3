"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/ui/pagination"
import { getUserActivity } from "@/lib/user-management-service"
import { formatDistanceToNow } from "date-fns"
import { RefreshCw, Activity } from "lucide-react"

interface UserActivityProps {
  userId: string
}

export function UserActivity({ userId }: UserActivityProps) {
  const { toast } = useToast()
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalActivities, setTotalActivities] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const limit = 10

  useEffect(() => {
    loadActivities()
  }, [userId, page])

  const loadActivities = async () => {
    setLoading(true)
    try {
      const { activities, total } = await getUserActivity(userId, {
        page,
        limit,
      })
      setActivities(activities)
      setTotalActivities(total)
    } catch (error) {
      console.error("Error loading activities:", error)
      toast({
        title: "Error",
        description: "Failed to load user activities. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadActivities()
    setIsRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Activity data has been refreshed.",
    })
  }

  const totalPages = Math.ceil(totalActivities / limit)

  if (loading && activities.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3C1F]"></div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>Recent user actions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="bg-gray-100 rounded-full p-3 mb-4">
              <Activity className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No activity found</h3>
            <p className="mt-1 text-sm text-gray-500">This user has no recorded activity yet.</p>
            <Button variant="outline" className="mt-4" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>Recent user actions and events</CardDescription>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <h4 className="font-medium text-gray-900 capitalize">{activity.activity_type}</h4>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{activity.description}</p>
                {activity.points > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    +{activity.points} points
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
        )}
      </CardContent>
    </Card>
  )
}
