import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, gameId, platform, questionId } = body

    if (!userId || !gameId || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Supabase client
    const supabase = createClient()

    // Record the share
    const { data: shareData, error: shareError } = await supabase
      .from("trivia_shares")
      .insert({
        user_id: userId,
        game_id: gameId,
        platform,
        question_id: questionId,
        shared_at: new Date().toISOString(),
      })
      .select()

    if (shareError) {
      console.error("Error recording trivia share:", shareError)
      return NextResponse.json({ error: "Failed to record trivia share", details: shareError.message }, { status: 500 })
    }

    // Award points for sharing
    const pointsForSharing = 15
    const { error: pointsError } = await supabase.rpc("add_points", {
      p_user_id: userId,
      p_points: pointsForSharing,
      p_source: `${gameId}_share`,
      p_description: `Earned ${pointsForSharing} points for sharing ${gameId} trivia`,
    })

    if (pointsError) {
      console.error("Error awarding points for sharing:", pointsError)
      // Continue execution even if points award fails
    }

    return NextResponse.json({
      success: true,
      pointsAwarded: pointsForSharing,
      shareId: shareData?.[0]?.id,
    })
  } catch (error) {
    console.error("Unexpected error in trivia share API:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
