"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, Gift, Award, TrendingUp } from "lucide-react"

interface DonationPointsDisplayProps {
  userId: string
}

export function DonationPointsDisplay({ userId }: DonationPointsDisplayProps) {
  const [loading, setLoading] = useState(true)
  const [points, setPoints] = useState(0)
  const [donationCount, setDonationCount] = useState(0)
  const [nextAward, setNextAward] = useState<{
    name: string
    pointsNeeded: number
    totalRequired: number
  } | null>(null)

  useEffect(() => {
    const fetchDonationPoints = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${userId}/donation-points`)
        const data = await response.json()

        if (data.success) {
          setPoints(data.points || 0)
          setDonationCount(data.donationCount || 0)

          // Fetch next award info
          const profileResponse = await fetch(`/api/users/${userId}/profile`)
          const profileData = await profileResponse.json()

          if (profileData.success && profileData.profile.next_award) {
            setNextAward({
              name: profileData.profile.next_award.name,
              pointsNeeded: profileData.profile.next_award.pointsNeeded,
              totalRequired: profileData.profile.next_award.pointThreshold,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching donation points:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchDonationPoints()
    }
  }, [userId])

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-4 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = nextAward
    ? Math.min(100, Math.round(((nextAward.totalRequired - nextAward.pointsNeeded) / nextAward.totalRequired) * 100))
    : 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Donation Points</CardTitle>
          <DollarSign className="h-5 w-5 text-[#0A3C1F]" />
        </div>
        <CardDescription>Your contribution makes a difference</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Gift className="h-5 w-5 mr-2 text-[#0A3C1F]" />
              <span className="text-sm font-medium">Total Donations:</span>
            </div>
            <span className="font-bold">{donationCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-[#0A3C1F]" />
              <span className="text-sm font-medium">Donation Points:</span>
            </div>
            <span className="font-bold">{points.toLocaleString()}</span>
          </div>

          {nextAward && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-[#0A3C1F]" />
                  <span className="text-sm font-medium">Next Award:</span>
                </div>
                <span className="text-sm">{nextAward.name}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>
                    {nextAward.totalRequired - nextAward.pointsNeeded} / {nextAward.totalRequired} points
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {nextAward.pointsNeeded} more points needed for {nextAward.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
