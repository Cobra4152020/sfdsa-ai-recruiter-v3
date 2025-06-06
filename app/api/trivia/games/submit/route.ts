export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { userId, gameId, score, totalQuestions, correctAnswers, timeSpent } =
      await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    if (!gameId) {
      return NextResponse.json(
        { success: false, message: "Game ID is required" },
        { status: 400 },
      );
    }

    const supabase = getServiceSupabase();

    // Record the attempt in the trivia_attempts table
    const { error: attemptError } = await supabase
      .from("trivia_attempts")
      .insert({
        user_id: userId,
        game_id: gameId,
        score: score,
        total_questions: totalQuestions,
        correct_answers: correctAnswers || score,
        time_spent: timeSpent || 0,
      });

    if (attemptError) {
      console.error("Error recording trivia attempt:", attemptError);
      return NextResponse.json(
        { success: false, message: "Failed to record attempt" },
        { status: 500 },
      );
    }

    // Calculate points to award based on performance
    const pointsPerQuestion = 10;
    const completionBonus = 30; // Reduced to match other games
    const perfectBonus = score === totalQuestions ? 20 : 0; // Extra bonus for perfect score
    const pointsToAward = (score * pointsPerQuestion) + completionBonus + perfectBonus;

    // Integrate with our live points system
    try {
      const pointsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/api/demo-user-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'trivia_game_completion',
          points: pointsToAward,
          gameDetails: {
            gameId,
            score,
            totalQuestions,
            correctAnswers,
            timeSpent,
            percentage: Math.round((score / totalQuestions) * 100),
          }
        }),
      });

      if (!pointsResponse.ok) {
        console.error('Failed to award live points for trivia');
      }
    } catch (pointsError) {
      console.error('Error awarding live points:', pointsError);
    }

    // Check for badge eligibility using our main badge system
    let badgeAwarded = null;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Award badges based on performance (using our main badge types)
    let badgeType = null;
    if (percentage === 100) {
      badgeType = 'expert-level'; // Perfect score gets expert badge
    } else if (percentage >= 80) {
      badgeType = 'hard-charger'; // High score gets hard charger badge
    } else if (percentage >= 60) {
      badgeType = 'frequent-user'; // Decent score gets frequent user badge
    }

    if (badgeType) {
      try {
        const badgeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/api/badges`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            badgeType,
            source: `trivia_${gameId}`,
          }),
        });

        if (badgeResponse.ok) {
          const badgeResult = await badgeResponse.json();
          if (badgeResult.badge) {
            badgeAwarded = {
              id: badgeResult.badge.id,
              badge_type: badgeType,
              earned_at: badgeResult.badge.earned_at,
            };
          }
        }
      } catch (badgeError) {
        console.error('Error awarding badge:', badgeError);
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      score,
      totalQuestions,
      pointsAwarded: pointsToAward,
      badgeAwarded,
      message: `Game completed! Earned ${pointsToAward} points${badgeAwarded ? ' and a badge' : ''}.`,
    });

  } catch (error) {
    console.error("Error submitting trivia game:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
