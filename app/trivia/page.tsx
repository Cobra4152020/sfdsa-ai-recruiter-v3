"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface TriviaGame {
  id: string
  name: string
  description: string
  image_url?: string
  question_count: number
}

export default function TriviaGamesPage() {
  const [games, setGames] = useState<TriviaGame[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // In a real app, this would be an API call to fetch games
        // For demo purposes, we'll use sample data
        const sampleGames: TriviaGame[] = [
          {
            id: "sf-baseball",
            name: "SF Baseball Trivia",
            description: "Test your knowledge of San Francisco baseball history and the Giants!",
            question_count: 100,
          },
          {
            id: "sf-basketball",
            name: "SF Basketball Trivia",
            description: "How much do you know about the Golden State Warriors?",
            question_count: 100,
          },
          {
            id: "sf-day-trips",
            name: "SF Day Trips",
            description: "Explore the best day trips from San Francisco!",
            question_count: 100,
          },
          {
            id: "sf-districts",
            name: "SF Districts",
            description: "Test your knowledge of San Francisco neighborhoods and districts!",
            question_count: 100,
          },
          {
            id: "sf-football",
            name: "SF Football Trivia",
            description: "How much do you know about the 49ers?",
            question_count: 120,
          },
          {
            id: "sf-tourist-spots",
            name: "SF Tourist Spots",
            description: "Test your knowledge of San Francisco's most famous attractions!",
            question_count: 100,
          },
        ]

        setGames(sampleGames)
      } catch (error) {
        console.error("Error fetching games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  const playGame = (gameId: string) => {
    router.push(`/trivia/${gameId}/kahoot`)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-purple-600" />
        <p className="text-xl">Loading trivia games...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">San Francisco Trivia Games</h1>
      <p className="text-center mb-8 text-gray-600">Choose a game category to play in Kahoot-style mode!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={
                  game.image_url ||
                  `/placeholder.svg?height=300&width=500&query=San Francisco ${game.id.replace("sf-", "")}`
                }
                alt={game.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{game.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{game.description}</p>
              <p className="mt-2 text-sm text-gray-500">{game.question_count} questions</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => playGame(game.id)} className="w-full bg-purple-600 hover:bg-purple-700">
                Play Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
