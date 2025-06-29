export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { userId, gameId, score, totalQuestions, correctAnswers, timeSpent } =
      await req.json();

    console.log('🎯 Trivia submission received:', {
      userId,
      gameId,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent
    });

    if (!userId) {
      console.error('❌ No userId provided');
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    if (!gameId) {
      console.error('❌ No gameId provided');
      return NextResponse.json(
        { success: false, message: "Game ID is required" },
        { status: 400 },
      );
    }

    const supabase = getServiceSupabase();

    // First, let's check if the trivia_attempts table exists
    console.log('🔍 Checking if trivia_attempts table exists...');
    const { data: tableExists, error: tableCheckError } = await supabase
      .from("trivia_attempts")
      .select("id")
      .limit(1);
    
    if (tableCheckError) {
      console.error('❌ Table check failed:', {
        error: tableCheckError,
        code: tableCheckError?.code,
        message: tableCheckError?.message
      });
      
      // If table doesn't exist, try to create it using a simple approach
      if (tableCheckError.code === '42P01') { // Table does not exist
        console.log('📝 Table does not exist, attempting to create it...');
        
        // For now, just fail gracefully and provide clear error
        return NextResponse.json(
          { 
            success: false, 
            message: "Trivia attempts table does not exist. Please run database migration first.",
            error: "TABLE_NOT_FOUND",
            hint: "Visit http://localhost:3000/admin/setup to initialize the database"
          },
          { status: 500 }
        );
      }
    } else {
      console.log('✅ Table exists, proceeding with insert...');
    }

    // Record the attempt in the trivia_attempts table with smart fallback
    console.log('📝 Recording trivia attempt...');
    
    // Try the full insert first (with all columns)
    let attemptError = null;
    const { error: fullInsertError } = await supabase
      .from("trivia_attempts")
      .insert({
        user_id: userId,
        game_id: gameId,
        score: score,
        total_questions: totalQuestions,
        correct_answers: correctAnswers || score,
        time_spent: timeSpent || 0,
      });

    if (fullInsertError) {
      console.warn('⚠️ Full insert failed, trying minimal insert:', {
        error: fullInsertError,
        code: fullInsertError?.code,
        message: fullInsertError?.message,
        details: fullInsertError?.details,
        hint: fullInsertError?.hint
      });
      
      // Fallback to minimal insert (only core columns that should always exist)
      const { error: minimalInsertError } = await supabase
        .from("trivia_attempts")
        .insert({
          user_id: userId,
          score: score,
          total_questions: totalQuestions,
        });
      attemptError = minimalInsertError;
      
      if (minimalInsertError) {
        console.error('❌ Minimal insert also failed:', {
          error: minimalInsertError,
          code: minimalInsertError?.code,
          message: minimalInsertError?.message,
          details: minimalInsertError?.details,
          hint: minimalInsertError?.hint
        });
      }
    }

    if (attemptError) {
      console.error("❌ Final error recording trivia attempt:", {
        error: attemptError,
        userId,
        gameId,
        score,
        totalQuestions
      });
      return NextResponse.json(
        { success: false, message: `Failed to record attempt: ${attemptError?.message || 'Unknown error'}` },
        { status: 500 },
      );
    }
    console.log('✅ Trivia attempt recorded successfully');

    // Calculate points to award based on performance
    const pointsPerQuestion = 10;
    const completionBonus = 30; // Reduced to match other games
    const perfectBonus = score === totalQuestions ? 20 : 0; // Extra bonus for perfect score
    const pointsToAward = (score * pointsPerQuestion) + completionBonus + perfectBonus;

    console.log('💰 Points calculation:', {
      score,
      totalQuestions,
      pointsPerQuestion,
      completionBonus,
      perfectBonus,
      pointsToAward
    });

    // Integrate with our live points system
    try {
      console.log('🔄 Calling demo-user-points API...');
      const pointsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/demo-user-points`, {
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

      console.log('📊 Points API response status:', pointsResponse.status);
      
      if (!pointsResponse.ok) {
        const errorText = await pointsResponse.text();
        console.error('❌ Failed to award live points for trivia:', errorText);
      } else {
        const pointsResult = await pointsResponse.json();
        console.log('✅ Points awarded successfully:', pointsResult);
      }
    } catch (pointsError) {
      console.error('❌ Error awarding live points:', pointsError);
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

    console.log('🏆 Badge check:', { percentage, badgeType });

    if (badgeType) {
      try {
        console.log('🔄 Calling badges API...');
        const badgeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/badges`, {
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

        console.log('🏆 Badge API response status:', badgeResponse.status);

        if (badgeResponse.ok) {
          const badgeResult = await badgeResponse.json();
          console.log('✅ Badge result:', badgeResult);
          if (badgeResult.badge) {
            badgeAwarded = {
              id: badgeResult.badge.id,
              badge_type: badgeType,
              earned_at: badgeResult.badge.earned_at,
            };
          }
        } else {
          const badgeErrorText = await badgeResponse.text();
          console.error('❌ Badge API error:', badgeErrorText);
        }
      } catch (badgeError) {
        console.error('❌ Error awarding badge:', badgeError);
      }
    }

    const responseData = {
      success: true,
      score,
      totalQuestions,
      pointsAwarded: pointsToAward,
      badgeAwarded,
      message: `Game completed! Earned ${pointsToAward} points${badgeAwarded ? ' and a badge' : ''}.`,
    };

    console.log('📤 Sending response:', responseData);

    // Return success response
    return NextResponse.json(responseData);

  } catch (error) {
    console.error("❌ Error submitting trivia game:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
