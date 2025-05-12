import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gameId = searchParams.get("gameId") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    if (!gameId) {
      return NextResponse.json({ error: "Missing gameId parameter" }, { status: 400 })
    }

    // Create Supabase client
    const supabase = createClient()

    // Get top scores for this game
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from("trivia_attempts")
      .select(`
        id,
        score,
        correct_answers,
        total_questions,
        created_at,
        users (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq("game_id", gameId)
      .order("score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (leaderboardError) {
      console.error("Error fetching trivia leaderboard:", leaderboardError)
      return NextResponse.json(
        { error: "Failed to fetch leaderboard", details: leaderboardError.message },
        { status: 500 },
      )
    }

    // Format the leaderboard data
    const formattedLeaderboard = leaderboardData.map((entry) => ({
      id: entry.id,
      userId: entry.users?.id,
      username: entry.users?.username || "Anonymous Player",
      displayName: entry.users?.display_name || entry.users?.username || "Anonymous Player",
      avatarUrl: entry.users?.avatar_url || null,
      score: entry.score,
      correctAnswers: entry.correct_answers,
      totalQuestions: entry.total_questions,
      accuracy: entry.total_questions > 0 ? (entry.correct_answers / entry.total_questions) * 100 : 0,
      date: entry.created_at,
    }))

    return NextResponse.json({ leaderboard: formattedLeaderboard })
  } catch (error) {
    console.error("Unexpected error in trivia leaderboard API:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
