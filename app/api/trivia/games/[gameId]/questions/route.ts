import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request, { params }: { params: { gameId: string } }) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const gameId = params.gameId

  try {
    // Fetch questions from the database
    const { data, error } = await supabase
      .from("trivia_questions")
      .select("*")
      .eq("game_id", gameId)
      .limit(limit)
      .order("id")

    if (error) {
      throw error
    }

    // Parse options from JSON string if needed
    const questions = data.map((q) => ({
      ...q,
      options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
    }))

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}
