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
    const activities: Array<{
      id: string;
      type: string;
      content: string;
      date: string;
      read: boolean;
      icon: string;
    }> = [];

    // Get recent point activities from user_point_logs
    const { data: pointLogs, error: pointLogsError } = await supabase
      .from("user_point_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (pointLogs && !pointLogsError) {
      pointLogs.forEach((log) => {
        activities.push({
          id: `points-${log.id}`,
          type: "points",
          content: `You earned ${log.points} points for ${log.action.replace(/_/g, ' ')}`,
          date: log.created_at,
          read: false,
          icon: "trophy"
        });
      });
    }

    // Get recent badge earnings
    const { data: badges, error: badgeError } = await supabase
      .from("user_badges")
      .select("id, badge_type, earned_at")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })
      .limit(5);

    if (badges && !badgeError) {
      badges.forEach((badge) => {
        activities.push({
          id: `badge-${badge.id}`,
          type: "badge",
          content: `Congratulations! You earned the '${badge.badge_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}' badge`,
          date: badge.earned_at,
          read: false,
          icon: "award"
        });
      });
    }

    // Get trivia attempts
    const { data: triviaAttempts, error: triviaError } = await supabase
      .from("trivia_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (triviaAttempts && !triviaError) {
      triviaAttempts.forEach((attempt) => {
        const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
        activities.push({
          id: `trivia-${attempt.id}`,
          type: "trivia",
          content: `You completed a trivia game with ${attempt.score}/${attempt.total_questions} correct answers (${percentage}%)`,
          date: attempt.created_at,
          read: false,
          icon: "gamepad"
        });
      });
    }

    // Sort all activities by date (most recent first)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // If no real activities, add a welcome message
    if (activities.length === 0) {
      activities.push({
        id: "welcome",
        type: "welcome",
        content: "Welcome to the SF Deputy Sheriff recruitment platform! Start earning points by playing trivia games.",
        date: new Date().toISOString(),
        read: false,
        icon: "star"
      });
    }

    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 8), // Limit to 8 most recent
      total: activities.length
    });

  } catch (error) {
    console.error("User activity API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 