export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"

// Badge types for each game
const gameBadgeTypes = {
  "sf-football": {
    participant: "sf-football-participant",
    enthusiast: "sf-football-enthusiast",
    master: "sf-football-master",
  },
  "sf-baseball": {
    participant: "sf-baseball-participant",
    enthusiast: "sf-baseball-enthusiast",
    master: "sf-baseball-master",
  },
  "sf-basketball": {
    participant: "sf-basketball-participant",
    enthusiast: "sf-basketball-enthusiast",
    master: "sf-basketball-master",
  },
  "sf-districts": {
    participant: "sf-districts-participant",
    enthusiast: "sf-districts-enthusiast",
    master: "sf-districts-master",
  },
  "sf-tourist-spots": {
    participant: "sf-tourist-spots-participant",
    enthusiast: "sf-tourist-spots-enthusiast",
    master: "sf-tourist-spots-master",
  },
  "sf-day-trips": {
    participant: "sf-day-trips-participant",
    enthusiast: "sf-day-trips-enthusiast",
    master: "sf-day-trips-master",
  },
}

export async function POST(req: Request) {
  try {
    const { userId, gameId, score, totalQuestions, correctAnswers, timeSpent } = await req.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    if (!gameId) {
      return NextResponse.json({ success: false, message: "Game ID is required" }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // Record the attempt in the trivia_attempts table
    const { error: attemptError } = await supabase.from("trivia_attempts").insert({
      user_id: userId,
      game_id: gameId,
      score: score,
      total_questions: totalQuestions,
      correct_answers: correctAnswers || score,
      time_spent: timeSpent || 0,
    })

    if (attemptError) {
      console.error("Error recording trivia attempt:", attemptError)
      return NextResponse.json({ success: false, message: "Failed to record attempt" }, { status: 500 })
    }

    // Calculate points to award
    // Base points for each correct answer
    const pointsPerQuestion = 10
    // Bonus points for completing the game
    const completionBonus = 50
    // Total points
    const pointsToAward = score * pointsPerQuestion + completionBonus

    // Award points to the user
    const { error: pointsError } = await supabase.from("user_points").insert({
      user_id: userId,
      points: pointsToAward,
      activity: "trivia_game",
      description: `Completed ${gameId} trivia game with score ${score}/${totalQuestions}`,
    })

    if (pointsError) {
      console.error("Error awarding points:", pointsError)
      // Continue execution even if points award fails
    }

    // Check if user should earn any badges
    let badgeAwarded = null

    // Get user's previous attempts for this game
    const { data: attempts, error: attemptsError } = await supabase
      .from("trivia_attempts")
      .select("*")
      .eq("user_id", userId)
      .eq("game_id", gameId)

    if (attemptsError) {
      console.error("Error fetching user attempts:", attemptsError)
    } else {
      // Check for participant badge (first attempt)
      if (attempts.length === 1) {
        // This is their first attempt, award participant badge
        const badgeType = gameBadgeTypes[gameId]?.participant

        if (badgeType) {
          const { data: existingBadge, error: badgeCheckError } = await supabase
            .from("badges")
            .select("*")
            .eq("user_id", userId)
            .eq("badge_type", badgeType)
            .single()

          if (!badgeCheckError && !existingBadge) {
            // User doesn't have this badge yet, award it
            const { data: newBadge, error: badgeError } = await supabase
              .from("badges")
              .insert({
                user_id: userId,
                badge_type: badgeType,
                earned_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (!badgeError && newBadge) {
              badgeAwarded = {
                id: newBadge.id,
                badge_type: badgeType,
                earned_at: newBadge.earned_at,
              }
            }
          }
        }
      }

      // Check for enthusiast badge (5 attempts)
      else if (attempts.length === 5) {
        // This is their fifth attempt, award enthusiast badge
        const badgeType = gameBadgeTypes[gameId]?.enthusiast

        if (badgeType) {
          const { data: existingBadge, error: badgeCheckError } = await supabase
            .from("badges")
            .select("*")
            .eq("user_id", userId)
            .eq("badge_type", badgeType)
            .single()

          if (!badgeCheckError && !existingBadge) {
            // User doesn't have this badge yet, award it
            const { data: newBadge, error: badgeError } = await supabase
              .from("badges")
              .insert({
                user_id: userId,
                badge_type: badgeType,
                earned_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (!badgeError && newBadge) {
              badgeAwarded = {
                id: newBadge.id,
                badge_type: badgeType,
                earned_at: newBadge.earned_at,
              }
            }
          }
        }
      }

      // Check for master badge (3 perfect scores)
      const perfectScores = attempts.filter((a) => a.score === a.total_questions).length

      if (score === totalQuestions && perfectScores === 3) {
        // This is their third perfect score, award master badge
        const badgeType = gameBadgeTypes[gameId]?.master

        if (badgeType) {
          const { data: existingBadge, error: badgeCheckError } = await supabase
            .from("badges")
            .select("*")
            .eq("user_id", userId)
            .eq("badge_type", badgeType)
            .single()

          if (!badgeCheckError && !existingBadge) {
            // User doesn't have this badge yet, award it
            const { data: newBadge, error: badgeError } = await supabase
              .from("badges")
              .insert({
                user_id: userId,
                badge_type: badgeType,
                earned_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (!badgeError && newBadge) {
              badgeAwarded = {
                id: newBadge.id,
                badge_type: badgeType,
                earned_at: newBadge.earned_at,
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Trivia attempt recorded successfully",
      pointsAwarded: pointsToAward,
      badgeAwarded: badgeAwarded,
    })
  } catch (error) {
    console.error("Error in trivia submit API:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
