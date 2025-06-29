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

    // Calculate total points from actual point logs (no artificial base points)
    // Users start with 0 and earn points through activities
    
    // First try to get points from user_point_logs (the correct table for point tracking)
    const { data: pointLogs, error: logError } = await supabase
      .from('user_point_logs')
      .select('points')
      .eq('user_id', userId);

    if (!logError && pointLogs && pointLogs.length > 0) {
      const totalPoints = pointLogs.reduce((sum, entry) => sum + (entry.points || 0), 0);
      
      console.log(`[Points API] Calculated from point logs for ${userId}: ${totalPoints} points from ${pointLogs.length} entries`);
      
      return NextResponse.json({
        success: true,
        totalPoints,
        userId,
        source: 'user_point_logs'
      });
    }

    // Fallback to user_points table if user_point_logs is empty
    const { data: activityData, error: activityError } = await supabase
      .from('user_points')
      .select('points')
      .eq('user_id', userId);

    if (activityError) {
      console.error('Error fetching user_points activity:', activityError);
      // Return 0 points for new users instead of giving them free 500 points
      return NextResponse.json({
        success: true,
        totalPoints: 0,
        userId,
        source: 'fallback_zero_points'
      });
    }

    const activityPoints = activityData.reduce((sum, entry) => sum + (entry.points || 0), 0);
    const totalPoints = activityPoints; // No artificial base points

    console.log(`[Points API] Calculated total for ${userId}: ${totalPoints} (Activity: ${activityPoints})`);

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