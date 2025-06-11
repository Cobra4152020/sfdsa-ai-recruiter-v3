import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // New permission-free method: Calculate total from activity logs
    // Base points for application completion is 500
    const BASE_POINTS = 500;

    const { data: activityData, error: activityError } = await supabase
      .from('user_points')
      .select('points')
      .eq('user_id', userId);

    if (activityError) {
      console.error('Error fetching user_points activity:', activityError);
      // Fallback to a default or error value if activity can't be fetched
      return NextResponse.json({
        success: true,
        totalPoints: BASE_POINTS,
        userId,
        source: 'fallback_base_points'
      });
    }

    const activityPoints = activityData.reduce((sum, entry) => sum + (entry.points || 0), 0);
    const totalPoints = BASE_POINTS + activityPoints;

    console.log(`[Points API] Calculated total for ${userId}: ${totalPoints} (Base: ${BASE_POINTS}, Activity: ${activityPoints})`);

    return NextResponse.json({
      success: true,
      totalPoints,
      userId,
      source: 'calculated_from_activity'
    });

  } catch (error) {
    console.error('User points fetch error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 