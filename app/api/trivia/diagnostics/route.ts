import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const gameId = url.searchParams.get("gameId")

    const results = {
      status: "success",
      timestamp: new Date().toISOString(),
      gameId: gameId || "all",
      databaseConnection: false,
      questionsAvailable: {},
      fallbackQuestionsAvailable: {},
      error: null,
    }

    // Test database connection
    const supabase = getServiceSupabase()
    const { data: connectionTest, error: connectionError } = await supabase
      .from("trivia_questions")
      .select("count(*)", { count: "exact" })
      .limit(1)

    results.databaseConnection = !connectionError

    if (connectionError) {
      results.error = `Database connection error: ${connectionError.message}`
      return NextResponse.json(results)
    }

    // Check available questions for each game or specific game
    const gameIds = gameId
      ? [gameId]
      : ["sf-football", "sf-baseball", "sf-basketball", "sf-districts", "sf-tourist-spots", "sf-day-trips"]

    for (const id of gameIds) {
      // Check database questions
      const { data: questions, error: questionsError } = await supabase
        .from("trivia_questions")
        .select("count(*)", { count: "exact" })
        .eq("game_id", id)

      results.questionsAvailable[id] = {
        count: questions?.[0]?.count || 0,
        error: questionsError ? questionsError.message : null,
      }

      // Check if fallback questions exist
      try {
        const response = await fetch(`${url.origin}/api/trivia/games/questions?count=1&gameId=${id}`)
        const data = await response.json()

        results.fallbackQuestionsAvailable[id] = {
          available: data.questions && data.questions.length > 0,
          source: data.source,
          count: data.questions ? data.questions.length : 0,
        }
      } catch (error) {
        results.fallbackQuestionsAvailable[id] = {
          available: false,
          error: error.message,
        }
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
