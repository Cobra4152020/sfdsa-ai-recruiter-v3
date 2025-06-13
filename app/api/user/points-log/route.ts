import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET(request: NextRequest) {
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

    // Fetch the complete points history from the user_point_logs table
    const { data: pointsLog, error } = await supabase
      .from("user_point_logs")
      .select("id, action, points, description, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching points log from user_point_logs:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch points log",
          details: error.message,
          log: []
        },
        { status: 500 }
      );
    }

    // Calculate the total points from the log
    const totalPoints = pointsLog.reduce((sum, entry) => sum + entry.points, 0);

    return NextResponse.json({
      success: true,
      log: pointsLog,
      totalEntries: pointsLog.length,
      totalPointsFromLog: totalPoints,
    });

  } catch (error) {
    console.error("Points log fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while fetching the points log",
        log: []
      },
      { status: 500 }
    );
  }
} 