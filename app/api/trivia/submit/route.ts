
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-clients"

interface TriviaAnswer {
  questionNumber: number
  answerTime: number
  isCorrect: boolean
}

interface TriviaSubmission {
  userId: string
  score: number
  totalQuestions: number
  gameMode: "normal" | "challenge" | "study"
  answers: TriviaAnswer[]
}

export async function POST(req: Request) {
  try {
    const { userId, score, totalQuestions, gameMode = "normal", answers = [] } = (await req.json()) as TriviaSubmission

    if (!userId || score === undefined || !totalQuestions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Insert the attempt and get its ID
    const { data: attemptData, error: attemptError } = await supabase
      .from("trivia_attempts")
      .insert({
        user_id: userId,
        score: score,
        total_questions: totalQuestions,
        game_mode: gameMode,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (attemptError) {
      console.error("Error recording trivia attempt:", attemptError)
      return NextResponse.json({ error: "Failed to record attempt" }, { status: 500 })
    }

    // Record individual answers
    if (answers.length > 0) {
      const { error: answersError } = await supabase.from("trivia_answers").insert(
        answers.map((answer) => ({
          attempt_id: attemptData.id,
          question_number: answer.questionNumber,
          answer_time: answer.answerTime,
          is_correct: answer.isCorrect,
          created_at: new Date().toISOString(),
        }))
      )

      if (answersError) {
        console.error("Error recording answer details:", answersError)
      }
    }

    // Calculate points to award
    const pointsAwarded = calculatePoints(score, totalQuestions, gameMode, answers)

    // Add points to user_point_logs
    await supabase.from("user_point_logs").insert({
      user_id: userId,
      points: pointsAwarded,
      source: "trivia",
      description: `Completed ${gameMode} trivia round with score ${score}/${totalQuestions}`,
      created_at: new Date().toISOString(),
    })

    // Check for badges
    const badgesAwarded = await checkAndAwardBadges(supabase, userId, score, totalQuestions, gameMode, answers)

    return NextResponse.json({
      success: true,
      pointsAwarded,
      badgesAwarded,
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

// Calculate points based on performance and game mode
function calculatePoints(
  score: number,
  totalQuestions: number,
  gameMode: string,
  answers: TriviaAnswer[]
): number {
  const basePoints = 10 // Base points for participation
  const percentCorrect = score / totalQuestions

  let multiplier = 1

  // Game mode multiplier
  if (gameMode === "challenge") {
    multiplier *= 2 // Challenge mode doubles points
  }

  // Streak multiplier
  let currentStreak = 0
  let maxStreak = 0
  for (const answer of answers) {
    if (answer.isCorrect) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  if (maxStreak >= 5) {
    multiplier *= 2 // 5+ streak doubles points
  } else if (maxStreak >= 3) {
    multiplier *= 1.5 // 3+ streak gives 50% bonus
  }

  // Speed bonus
  const fastAnswers = answers.filter((a) => a.isCorrect && a.answerTime < 5).length
  if (fastAnswers >= 3) {
    multiplier *= 1.2 // 20% bonus for 3+ fast correct answers
  }

  // Performance bonuses
  let bonusPoints = 0
  if (percentCorrect > 0.5) {
    bonusPoints += 5 // 50% correct bonus
  }
  if (percentCorrect > 0.8) {
    bonusPoints += 10 // 80% correct bonus
  }
  if (percentCorrect === 1) {
    bonusPoints += 15 // Perfect score bonus
    if (gameMode === "challenge") {
      bonusPoints += 25 // Extra bonus for perfect challenge mode
    }
  }

  return Math.round((basePoints + bonusPoints) * multiplier)
}

// Check and award badges
async function checkAndAwardBadges(
  supabase: any,
  userId: string,
  score: number,
  totalQuestions: number,
  gameMode: string,
  answers: TriviaAnswer[]
) {
  const badgesAwarded = []

  // Get user's current badges
  const { data: existingBadges } = await supabase
    .from("badges")
    .select("badge_type")
    .eq("user_id", userId)

  const hasBadge = (type: string) => existingBadges?.some((b: any) => b.badge_type === type)

  // Check for first attempt (Participant badge)
  if (!hasBadge("trivia-participant")) {
    await supabase
      .from("badges")
      .insert({ user_id: userId, badge_type: "trivia-participant" })
      .single()
    badgesAwarded.push({
      badge_type: "trivia-participant",
      earned_at: new Date().toISOString(),
    })
  }

  // Check for perfect challenge mode (Challenge Champion badge)
  if (gameMode === "challenge" && score === totalQuestions && !hasBadge("challenge-champion")) {
    await supabase
      .from("badges")
      .insert({ user_id: userId, badge_type: "challenge-champion" })
      .single()
    badgesAwarded.push({
      badge_type: "challenge-champion",
      earned_at: new Date().toISOString(),
    })
  }

  // Check for speed demon badge (10 fast correct answers)
  const fastCorrectAnswers = answers.filter((a) => a.isCorrect && a.answerTime < 5).length
  if (fastCorrectAnswers >= 10 && !hasBadge("speed-demon")) {
    await supabase.from("badges").insert({ user_id: userId, badge_type: "speed-demon" }).single()
    badgesAwarded.push({
      badge_type: "speed-demon",
      earned_at: new Date().toISOString(),
    })
  }

  // Check for Enthusiast badge (5 attempts)
  const { count } = await supabase
    .from("trivia_attempts")
    .select("id", { count: "exact" })
    .eq("user_id", userId)

  if (count >= 5 && !hasBadge("trivia-enthusiast")) {
    await supabase.from("badges").insert({ user_id: userId, badge_type: "trivia-enthusiast" }).single()
    badgesAwarded.push({
      badge_type: "trivia-enthusiast",
      earned_at: new Date().toISOString(),
    })
  }

  // Check for Master badge (3 perfect scores)
  const { count: perfectScores } = await supabase
    .from("trivia_attempts")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("score", totalQuestions)

  if (perfectScores >= 3 && !hasBadge("trivia-master")) {
    await supabase.from("badges").insert({ user_id: userId, badge_type: "trivia-master" }).single()
    badgesAwarded.push({
      badge_type: "trivia-master",
      earned_at: new Date().toISOString(),
    })
  }

  return badgesAwarded
}
