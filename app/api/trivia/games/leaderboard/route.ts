import { NextResponse } from "next/server"

export const dynamic = 'force-static'

type GameId = 'sf-football' | 'sf-baseball' | 'sf-basketball' | 'sf-districts' | 'sf-tourist-spots' | 'sf-day-trips'

interface LeaderboardEntry {
  id: string
  userId: string
  name: string
  score: number
  totalQuestions: number
  gameMode: string
  completedAt: string
}

// Mock leaderboard data
const STATIC_LEADERBOARDS: Record<GameId, LeaderboardEntry[]> = {
  'sf-football': [
    {
      id: "1",
      userId: "user1",
      name: "John Smith",
      score: 95,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      userId: "user2",
      name: "Jane Doe",
      score: 90,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-02T00:00:00Z"
    }
  ],
  'sf-baseball': [
    {
      id: "1",
      userId: "user1",
      name: "John Smith",
      score: 85,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      userId: "user2",
      name: "Jane Doe",
      score: 80,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-02T00:00:00Z"
    }
  ],
  'sf-basketball': [
    {
      id: "1",
      userId: "user1",
      name: "John Smith",
      score: 75,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      userId: "user2",
      name: "Jane Doe",
      score: 70,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-02T00:00:00Z"
    }
  ],
  'sf-districts': [
    {
      id: "1",
      userId: "user1",
      name: "John Smith",
      score: 65,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      userId: "user2",
      name: "Jane Doe",
      score: 60,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-02T00:00:00Z"
    }
  ],
  'sf-tourist-spots': [
    {
      id: "1",
      userId: "user1",
      name: "John Smith",
      score: 55,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      userId: "user2",
      name: "Jane Doe",
      score: 50,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-02T00:00:00Z"
    }
  ],
  'sf-day-trips': [
    {
      id: "1",
      userId: "user1",
      name: "John Smith",
      score: 45,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      userId: "user2",
      name: "Jane Doe",
      score: 40,
      totalQuestions: 100,
      gameMode: "normal",
      completedAt: "2024-01-02T00:00:00Z"
    }
  ]
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const gameId = url.searchParams.get("gameId") as GameId | null
    const limit = Number(url.searchParams.get("limit") || "10")
    const offset = Number(url.searchParams.get("offset") || "0")

    if (!gameId || !STATIC_LEADERBOARDS[gameId]) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 })
    }

    // Get leaderboard for the specified game
    let entries = [...STATIC_LEADERBOARDS[gameId]]

    // Sort by score descending
    entries.sort((a, b) => b.score - a.score)

    // Get total count before pagination
    const total = entries.length

    // Apply pagination
    entries = entries.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      entries,
      total,
      source: 'static'
    })
  } catch (error) {
    console.error("Error fetching trivia game leaderboard:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
