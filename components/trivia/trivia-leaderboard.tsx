"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Medal, Award } from "lucide-react"

interface TriviaLeaderboardEntry {
  user_id: string
  name: string
  avatar_url?: string
  attempts_count: number
  total_correct_answers: number
  total_questions: number
  accuracy_percent: number
  last_attempt_at: string
}

interface TriviaLeaderboardProps {
  gameId: string
  gameName: string
}

export function TriviaLeaderboard({ gameId, gameName }: TriviaLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<TriviaLeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Try to fetch from API first
      const response = await fetch(`/api/trivia/leaderboard?gameId=${gameId}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setLeaderboard(data.leaderboard || [])
    } catch (err) {
      console.error(`Error fetching ${gameId} leaderboard:`, err)
      setError("Couldn't load leaderboard data")
      // Fall back to mock data
      setLeaderboard(getMockLeaderboard())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockLeaderboard = (): TriviaLeaderboardEntry[] => {
    const names = [
      "John Smith",
      "Maria Garcia",
      "James Johnson",
      "David Williams",
      "Sarah Brown",
      "Michael Jones",
      "Jessica Miller",
      "Robert Davis",
      "Jennifer Wilson",
      "Thomas Moore",
    ]

    return names
      .map((name, index) => {
        const totalQuestions = Math.floor(Math.random() * 50) + 10
        const correctAnswers = Math.floor(Math.random() * totalQuestions)

        return {
          user_id: `mock-${index}`,
          name,
          avatar_url: `/placeholder.svg?height=40&width=40&query=avatar ${index + 1}`,
          attempts_count: Math.floor(Math.random() * 20) + 1,
          total_correct_answers: correctAnswers,
          total_questions: totalQuestions,
          accuracy_percent: (correctAnswers / totalQuestions) * 100,
          last_attempt_at: new Date().toISOString(),
        }
      })
      .sort((a, b) => b.total_correct_answers - a.total_correct_answers)
  }

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 2) return <Award className="h-5 w-5 text-amber-700" />
    return <span className="text-gray-500 font-medium">{rank + 1}</span>
  }

  const handleRetry = () => {
    fetchLeaderboard()
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>Top {gameName} Players</span>
          {error && (
            <button onClick={handleRetry} className="text-xs text-blue-500 hover:text-blue-700">
              Retry
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No {gameName} players yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div key={entry.user_id} className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8">{getRankIcon(index)}</div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.avatar_url || "/placeholder.svg"} alt={entry.name} />
                  <AvatarFallback>{entry.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{entry.name}</div>
                  <div className="text-xs text-gray-500">
                    {entry.total_correct_answers} correct answers ({Math.round(entry.accuracy_percent)}% accuracy)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
