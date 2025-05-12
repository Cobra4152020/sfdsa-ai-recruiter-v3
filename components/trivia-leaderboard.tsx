"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Star } from "lucide-react"
import { cn } from "@/lib/utils"

type TriviaLeaderboardEntry = {
  id: string
  name: string
  score: number
  rank: number
  correctAnswers: number
  totalQuestions: number
  avatarUrl: string
  isCurrentUser?: boolean
}

// Sample data with avatar URLs
const sampleTriviaLeaderboardData: TriviaLeaderboardEntry[] = [
  {
    id: "1",
    name: "Michael Chen",
    score: 950,
    rank: 1,
    correctAnswers: 19,
    totalQuestions: 20,
    avatarUrl: "/asian-male-officer-headshot.png",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    score: 900,
    rank: 2,
    correctAnswers: 18,
    totalQuestions: 20,
    avatarUrl: "/female-law-enforcement-headshot.png",
  },
  {
    id: "3",
    name: "David Rodriguez",
    score: 850,
    rank: 3,
    correctAnswers: 17,
    totalQuestions: 20,
    avatarUrl: "/male-law-enforcement-headshot.png",
  },
  {
    id: "4",
    name: "Jessica Williams",
    score: 800,
    rank: 4,
    correctAnswers: 16,
    totalQuestions: 20,
    avatarUrl: "/female-law-enforcement-headshot.png",
  },
  {
    id: "5",
    name: "Robert Kim",
    score: 750,
    rank: 5,
    correctAnswers: 15,
    totalQuestions: 20,
    avatarUrl: "/asian-male-officer-headshot.png",
  },
]

interface TriviaLeaderboardProps {
  currentUserId?: string
  useMockData?: boolean
  className?: string
  limit?: number
}

export function TriviaLeaderboard({
  currentUserId,
  useMockData = false,
  className,
  limit = 5,
}: TriviaLeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<TriviaLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        if (useMockData) {
          // Mark current user in mock data if ID is provided
          const mockData = sampleTriviaLeaderboardData
            .map((entry) => ({
              ...entry,
              isCurrentUser: entry.id === currentUserId,
            }))
            .slice(0, limit)
          setLeaderboardData(mockData)
        } else {
          // In a real app, you would fetch from your API
          const response = await fetch("/api/trivia/leaderboard")
          const data = await response.json()

          // Process the data to mark current user
          const processedData = data
            .map((entry: TriviaLeaderboardEntry) => ({
              ...entry,
              isCurrentUser: entry.id === currentUserId,
            }))
            .slice(0, limit)

          setLeaderboardData(processedData)
        }
      } catch (error) {
        console.error("Error fetching trivia leaderboard data:", error)
        // Fallback to sample data on error
        setLeaderboardData(sampleTriviaLeaderboardData.slice(0, limit))
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [currentUserId, useMockData, limit])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return <Star className="h-5 w-5 text-gray-300" />
    }
  }

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>SF Trivia Champions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p>Loading leaderboard data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>SF Trivia Champions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((entry) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                entry.isCurrentUser ? "bg-[#F0F7F2] border border-[#0A3C1F]" : "bg-white border border-gray-100",
                "hover:shadow-sm transition-shadow",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8">{getRankIcon(entry.rank)}</div>
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src={entry.avatarUrl || "/placeholder.svg"} alt={entry.name} />
                  <AvatarFallback>{entry.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className={cn("font-medium", entry.isCurrentUser && "text-[#0A3C1F]")}>
                    {entry.name} {entry.isCurrentUser && "(You)"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {entry.correctAnswers}/{entry.totalQuestions} correct
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-[#F0F7F2] text-[#0A3C1F] border-[#0A3C1F]">
                  {entry.score} pts
                </Badge>
                <span className="text-sm font-medium text-gray-500">#{entry.rank}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
