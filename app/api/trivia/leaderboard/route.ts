export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // Instead of querying the view directly, use the equivalent SQL query
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        name,
        user_profiles (
          avatar_url
        ),
        trivia_attempts:trivia_attempts(
          id,
          score,
          total_questions,
          created_at
        )
      `,
      )
      .limit(10);

    if (error) {
      throw error;
    }

    // Process the data to match the expected format
    const leaderboard = data.map((user) => {
      const attempts = user.trivia_attempts || [];
      const attemptsCount = attempts.length;
      const totalCorrectAnswers = attempts.reduce(
        (sum, attempt) => sum + attempt.score,
        0,
      );
      const totalQuestions = attempts.reduce(
        (sum, attempt) => sum + attempt.total_questions,
        0,
      );
      const accuracyPercent =
        totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0;
      const perfectGames = attempts.filter(
        (attempt) => attempt.score === attempt.total_questions,
      ).length;
      const lastAttemptAt =
        attempts.length > 0
          ? attempts.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )[0].created_at
          : null;

      return {
        user_id: user.id,
        name: user.name,
        avatar_url: user.user_profiles?.[0]?.avatar_url || null,
        attempts_count: attemptsCount,
        total_correct_answers: totalCorrectAnswers,
        total_questions: totalQuestions,
        accuracy_percent: Number.parseFloat(accuracyPercent.toFixed(1)),
        perfect_games: perfectGames,
        last_attempt_at: lastAttemptAt,
      };
    });

    // Sort by total correct answers descending
    leaderboard.sort(
      (a, b) => b.total_correct_answers - a.total_correct_answers,
    );

    return NextResponse.json({ leaderboard: leaderboard || [] });
  } catch (error) {
    console.error("Error fetching trivia leaderboard:", error);

    // Generate mock data as fallback
    const mockLeaderboard = getMockLeaderboard();

    return NextResponse.json({
      leaderboard: mockLeaderboard,
      isMock: true,
    });
  }
}

function getMockLeaderboard() {
  const names = [
    "John Smith",
    "Maria Garcia",
    "James Johnson",
    "David Williams",
    "Sarah Brown",
    "Michael Jones",
    "Jessica Miller",
    "Robert Davis",
    "Jennifer Wilson",
    "Thomas Moore",
  ];

  return names
    .map((name, index) => {
      const totalQuestions = Math.floor(Math.random() * 50) + 10;
      const correctAnswers = Math.floor(Math.random() * totalQuestions);

      return {
        user_id: `mock-${index}`,
        name,
        avatar_url: `/placeholder.svg?height=40&width=40&query=avatar ${index + 1}`,
        attempts_count: Math.floor(Math.random() * 20) + 1,
        total_correct_answers: correctAnswers,
        total_questions: totalQuestions,
        accuracy_percent: Number.parseFloat(
          ((correctAnswers / totalQuestions) * 100).toFixed(1),
        ),
        perfect_games: Math.floor(Math.random() * 3),
        last_attempt_at: new Date().toISOString(),
      };
    })
    .sort((a, b) => b.total_correct_answers - a.total_correct_answers);
}
