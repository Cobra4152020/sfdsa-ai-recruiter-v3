import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-clients"

export async function POST(req: Request) {
  try {
    const { userId, score, totalQuestions } = await req.json()

    if (!userId || score === undefined || !totalQuestions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Try to record the attempt in the database
    try {
      const supabase = createClient()

      // Insert the attempt
      await supabase.from("trivia_attempts").insert({
        user_id: userId,
        score: score,
        total_questions: totalQuestions,
        created_at: new Date().toISOString(),
      })
    } catch (dbError) {
      console.error("Error recording trivia attempt:", dbError)
      // Continue even if database insert fails
    }

    // Calculate points to award
    const pointsAwarded = calculatePoints(score, totalQuestions)

    // Try to award points in the database
    let badgeAwarded = null
    try {
      const supabase = createClient()

      // Add points to user_point_logs
      await supabase.from("user_point_logs").insert({
        user_id: userId,
        points: pointsAwarded,
        source: "trivia",
        description: `Completed trivia round with score ${score}/${totalQuestions}`,
        created_at: new Date().toISOString(),
      })

      // Check if this is the user's first trivia attempt
      const { data: previousAttempts } = await supabase.from("trivia_attempts").select("id").eq("user_id", userId)

      if (!previousAttempts || previousAttempts.length <= 1) {
        // This is their first attempt, award the participant badge
        const { data: participantBadge } = await supabase
          .from("badges")
          .select("id")
          .eq("badge_type", "trivia_participant")
          .single()

        if (participantBadge) {
          // Check if they already have this badge
          const { data: existingBadge } = await supabase
            .from("user_badges")
            .select("id")
            .eq("user_id", userId)
            .eq("badge_id", participantBadge.id)
            .single()

          if (!existingBadge) {
            // Award the badge
            await supabase.from("user_badges").insert({
              user_id: userId,
              badge_id: participantBadge.id,
              awarded_at: new Date().toISOString(),
            })

            badgeAwarded = {
              id: participantBadge.id,
              badge_type: "trivia_participant",
              earned_at: new Date().toISOString(),
            }
          }
        }
      }
    } catch (pointsError) {
      console.error("Error awarding points:", pointsError)
      // Continue even if points award fails
    }

    return NextResponse.json({
      success: true,
      pointsAwarded,
      badgeAwarded,
    })
  } catch (error) {
    console.error("Error submitting trivia results:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to submit trivia results",
      pointsAwarded: 10, // Fallback points
    })
  }
}

// Calculate points based on performance
function calculatePoints(score: number, totalQuestions: number): number {
  const basePoints = 10 // Base points for participation
  const percentCorrect = score / totalQuestions

  let bonusPoints = 0

  // Add bonus points based on performance
  if (percentCorrect > 0.5) {
    bonusPoints += 5 // 50% correct bonus
  }

  if (percentCorrect > 0.8) {
    bonusPoints += 10 // 80% correct bonus
  }

  if (percentCorrect === 1) {
    bonusPoints += 15 // Perfect score bonus
  }

  return basePoints + bonusPoints
}
