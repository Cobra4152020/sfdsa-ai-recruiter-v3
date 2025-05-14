"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getUserStats } from "@/lib/user-management-service"
import { Users, UserCheck, Award, ArrowUpRight, TrendingUp, Clock } from "lucide-react"

export function AnalyticsSummary() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getUserStats()
        setStats(data)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 animate-pulse rounded-md"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <div className="flex items-end gap-1">
                <h3 className="text-3xl font-bold">{stats.total_users}</h3>
                <span className="text-sm text-green-500 flex items-center mb-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {Math.round((stats.recent_signups / stats.total_users) * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{stats.recent_signups} new in last 7 days</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <div className="flex items-end gap-1">
                <h3 className="text-3xl font-bold">{stats.active_users}</h3>
                <span className="text-sm text-green-500 flex items-center mb-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {Math.round((stats.active_users / stats.total_users) * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">of total user base</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Volunteers</p>
              <div className="flex items-end gap-1">
                <h3 className="text-3xl font-bold">{stats.pending_volunteers}</h3>
                {stats.pending_volunteers > 0 && (
                  <span className="text-sm text-yellow-500 flex items-center mb-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Awaiting
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">volunteer recruiters need approval</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
