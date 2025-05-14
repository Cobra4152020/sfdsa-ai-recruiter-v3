"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Calendar, Award } from "lucide-react"
import Link from "next/link"

interface Challenge {
  id: number
  title: string
  description: string
  points_reward: number
  badge_reward: string | null
  thumbnail_url: string
  start_date: string
  end_date: string
  status: string
}

export default function ActiveChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const { data, error } = await supabase
          .from("active_tiktok_challenges")
          .select("*")
          .eq("status", "active")
          .order("end_date", { ascending: true })
          .limit(3)

        if (error) throw error

        setChallenges(data || [])
      } catch (error) {
        console.error("Error fetching challenges:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChallenges()
  }, [supabase])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getDaysRemaining = (endDateString: string) => {
    const endDate = new Date(endDateString)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Challenges</CardTitle>
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
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Active Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {challenges.length > 0 ? (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="overflow-hidden border rounded-lg">
                <div className="relative h-32">
                  <img
                    src={challenge.thumbnail_url || "/placeholder.svg?height=128&width=384&query=tiktok challenge"}
                    alt={challenge.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-500">{getDaysRemaining(challenge.end_date)} days left</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-lg font-semibold">{challenge.title}</h3>
                  <p className="mb-3 text-sm text-gray-500 line-clamp-2">{challenge.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                      <Award className="w-3 h-3" />
                      {challenge.points_reward} points
                    </Badge>
                    {challenge.badge_reward && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 border-purple-200"
                      >
                        <Award className="w-3 h-3" />
                        {challenge.badge_reward} badge
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-700 border-gray-200"
                    >
                      <Calendar className="w-3 h-3" />
                      {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
                    </Badge>
                  </div>
                  <Link href={`/challenges/${challenge.id}`} passHref>
                    <Button className="w-full">View Challenge</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-md">
            <TrendingUp className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <h3 className="mb-1 text-lg font-medium">No Active Challenges</h3>
            <p className="mb-4 text-sm">Check back soon for new challenges!</p>
            <Link href="/challenges" passHref>
              <Button variant="outline">View All Challenges</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
