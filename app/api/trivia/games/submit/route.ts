import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, gameId, score, totalQuestions, correctAnswers, timeSpent } = body

    if (!userId || !gameId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Supabase client
    const supabase = createClient()

    // Record the trivia attempt
    const { data: attemptData, error: attemptError } = await supabase
      .from("trivia_attempts")
      .insert({
        user_id: userId,
        game_id: gameId,
        score,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        time_spent: timeSpent,
      })
      .select()

    if (attemptError) {
      console.error("Error recording trivia attempt:", attemptError)
      return NextResponse.json(
        { error: "Failed to record trivia attempt", details: attemptError.message },
        { status: 500 },
      )
    }

    // Calculate points to award
    const pointsPerQuestion = 10
    const completionBonus = 50
    const pointsAwarded = correctAnswers * pointsPerQuestion + completionBonus

    // Award points to the user
    const { error: pointsError } = await supabase.rpc("add_points", {
      p_user_id: userId,
      p_points: pointsAwarded,
      p_source: `${gameId}_trivia`,
      p_description: `Earned ${pointsAwarded} points playing ${gameId} trivia`,
    })

    if (pointsError) {
      console.error("Error awarding points:", pointsError)
      // Continue execution even if points award fails
    }

    // Check if user should earn a badge
    let badgeAwarded = null

    // Get user's previous attempts for this game
    const { data: previousAttempts, error: attemptsError } = await supabase
      .from("trivia_attempts")
      .select("*")
      .eq("user_id", userId)
      .eq("game_id", gameId)

    if (attemptsError) {
      console.error("Error fetching previous attempts:", attemptsError)
    } else {
      // Determine which badge to award
      const totalAttempts = previousAttempts?.length || 0
      const perfectScores = previousAttempts?.filter((a) => a.correct_answers === a.total_questions)?.length || 0

      let badgeType = null

      // First time playing - Participant badge
      if (totalAttempts <= 1) {
        badgeType = `${gameId}-participant`
      }
      // 5+ attempts - Enthusiast badge
      else if (totalAttempts >= 5) {
        badgeType = `${gameId}-enthusiast`
      }
      // 3+ perfect scores - Master badge
      else if (perfectScores >= 3 || (correctAnswers === totalQuestions && perfectScores >= 2)) {
        badgeType = `${gameId}-master`
      }

      if (badgeType) {
        // Check if user already has this badge
        const { data: existingBadge, error: badgeCheckError } = await supabase
          .from("user_badges")
          .select("*")
          .eq("user_id", userId)
          .eq("badge_type", badgeType)
          .single()

        if (badgeCheckError && badgeCheckError.code !== "PGRST116") {
          // PGRST116 is "no rows returned" which is expected if user doesn't have the badge
          console.error("Error checking existing badge:", badgeCheckError)
        }

        // Award badge if user doesn't have it yet
        if (!existingBadge) {
          const { data: newBadge, error: badgeError } = await supabase
            .from("user_badges")
            .insert({
              user_id: userId,
              badge_type: badgeType,
              earned_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (badgeError) {
            console.error("Error awarding badge:", badgeError)
          } else if (newBadge) {
            badgeAwarded = newBadge
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      pointsAwarded,
      badgeAwarded,
      attemptId: attemptData?.[0]?.id,
    })
  } catch (error) {
    console.error("Unexpected error in trivia submit API:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
