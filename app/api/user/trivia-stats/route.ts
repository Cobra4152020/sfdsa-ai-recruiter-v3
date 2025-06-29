import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Get all trivia attempts for this user
    const { data: triviaAttempts, error: triviaError } = await supabase
      .from("trivia_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (triviaError) {
      console.error("Error fetching trivia attempts:", triviaError);
      return NextResponse.json(
        { error: "Failed to fetch trivia stats" },
        { status: 500 }
      );
    }

    // Get all point logs from trivia games
    const { data: triviaPoints, error: pointsError } = await supabase
      .from("user_point_logs")
      .select("points")
      .eq("user_id", userId)
      .like("action", "%trivia%");

    if (pointsError) {
      console.error("Error fetching trivia points:", pointsError);
    }

    // Calculate statistics
    const gamesPlayed = triviaAttempts?.length || 0;
    const totalPointsEarned = triviaPoints?.reduce((sum, log) => sum + log.points, 0) || 0;
    
    let bestScore = "0/0";
    let averageScore = 0;
    let badgesEarned: Array<{name: string; date: string; description: string}> = [];

    if (gamesPlayed > 0 && triviaAttempts) {
      // Find best score
      const bestAttempt = triviaAttempts.reduce((best, current) => {
        const bestPercent = (best.score / best.total_questions) * 100;
        const currentPercent = (current.score / current.total_questions) * 100;
        return currentPercent > bestPercent ? current : best;
      });
      
      bestScore = `${bestAttempt.score}/${bestAttempt.total_questions}`;
      
      // Calculate average score
      const totalCorrect = triviaAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
      const totalQuestions = triviaAttempts.reduce((sum, attempt) => sum + attempt.total_questions, 0);
      averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 50) / 10 : 0; // Round to 1 decimal, out of 5
    }

    // Get trivia-related badges
    const { data: userBadges, error: badgeError } = await supabase
      .from("user_badges")
      .select("badge_type, earned_at")
      .eq("user_id", userId)
      .like("badge_type", "%trivia%");

    if (userBadges && !badgeError) {
      badgesEarned = userBadges.map(badge => ({
        name: badge.badge_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        date: new Date(badge.earned_at).toLocaleDateString(),
        description: `Earned for trivia achievements`
      }));
    }

    return NextResponse.json({
      success: true,
      stats: {
        gamesPlayed,
        averageScore,
        bestScore,
        totalPointsEarned,
        badgesEarned
      }
    });

  } catch (error) {
    console.error("Trivia stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 