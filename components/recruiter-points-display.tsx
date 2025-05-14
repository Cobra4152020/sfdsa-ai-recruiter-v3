"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Award, Trophy, TrendingUp, Star } from "lucide-react"
import { useUser } from "@/context/user-context"

interface RecruiterPointsDisplayProps {
  recruiterId?: string
}

export function RecruiterPointsDisplay({ recruiterId }: RecruiterPointsDisplayProps) {
  const { currentUser } = useUser()
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = recruiterId || currentUser?.id

  useEffect(() => {
    if (!userId) return

    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/recruiter/stats?recruiterId=${userId}`)
        const data = await response.json()

        if (data.success && data.stats) {
          setStats(data.stats)
        } else {
          setError(data.message || "Failed to load recruiter stats")
        }
      } catch (err) {
        setError("An error occurred while fetching recruiter stats")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recruiter Stats</CardTitle>
          <CardDescription>Error loading recruiter stats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-4">{error || "Unable to load recruiter information"}</div>
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = stats.nextTier
    ? Math.min(
        100,
        ((stats.totalPoints - (stats.nextTier.pointsRequired - stats.pointsToNextTier)) / stats.pointsToNextTier) * 100,
      )
    : 100

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recruiter Dashboard</CardTitle>
            <CardDescription>Your recruitment progress and achievements</CardDescription>
          </div>
          <Badge
            variant="outline"
            className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300"
          >
            <Trophy className="h-4 w-4 mr-1 text-amber-500" />
            {stats.currentTier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Points and Next Tier */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-slate-500">Total Recruiter Points</div>
              <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>
            </div>

            {stats.nextTier ? (
              <>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-500">Current: {stats.currentTier}</span>
                  <span className="text-slate-500">Next: {stats.nextTier.name}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="mt-2 text-xs text-slate-500 text-center">
                  {stats.pointsToNextTier.toLocaleString()} points needed for next tier
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-green-600 mt-2">
                <Star className="inline h-4 w-4 mr-1" />
                You've reached the highest tier!
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Award className="h-5 w-5 mr-2 text-green-600" />
                <span className="text-sm font-medium text-green-800">Referral Success</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-600">Sign-ups</div>
                  <div className="font-semibold">{stats.referralSignups}</div>
                </div>
                <div>
                  <div className="text-gray-600">Applications</div>
                  <div className="font-semibold">{stats.referralApplications}</div>
                </div>
                <div>
                  <div className="text-gray-600">Interviews</div>
                  <div className="font-semibold">{stats.referralInterviews}</div>
                </div>
                <div>
                  <div className="text-gray-600">Hires</div>
                  <div className="font-semibold">{stats.referralHires}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Rewards</span>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Rewards Redeemed</div>
                <div className="font-semibold">{stats.rewardsRedeemed}</div>
                <div className="mt-2 text-xs text-blue-600">
                  {stats.rewardsRedeemed > 0 ? "View your redemption history" : "Redeem your points for rewards!"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
