export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { recordAttendance } from "@/lib/daily-briefing-service";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { addParticipationPoints } from "@/lib/points-service";

export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get the user from the access token
    const supabase = getServiceSupabase();
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.error("User authentication error:", userError);
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 },
      );
    }

    console.log("User authenticated for attendance:", user.id);

    // Get briefing ID from request body
    const { briefingId } = await request.json();

    if (!briefingId) {
      return NextResponse.json(
        { error: "Briefing ID is required" },
        { status: 400 },
      );
    }

    console.log("Recording attendance for briefing:", briefingId);

    // Record attendance
    const success = await recordAttendance(user.id, briefingId);

    console.log("Attendance recording result:", success);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to record attendance" },
        { status: 500 },
      );
    }

    // Award 5 points for attendance - the recordAttendance function should handle this via addParticipationPoints
    // But let's add a backup to ensure points are awarded to user_point_logs directly
    try {
      const { error: pointsLogError } = await supabase
        .from('user_point_logs')
        .insert({
          user_id: user.id,
          points: 5,
          action: 'daily_briefing_attendance',
          created_at: new Date().toISOString()
        });

      if (pointsLogError) {
        console.error('Direct points logging failed:', pointsLogError);
      } else {
        console.log('✅ Successfully logged 5 points directly to user_point_logs for briefing attendance');
      }
    } catch (pointsError) {
      console.error('Error with direct points logging:', pointsError);
      // Don't fail the request just because points logging failed
      // The recordAttendance function should have already logged points via addParticipationPoints
    }

    return NextResponse.json({ 
      success: true,
      message: "Attendance recorded and points awarded"
    });
  } catch (error) {
    console.error("Error in attendance API:", error);
    return NextResponse.json(
      { error: "Failed to record attendance" },
      { status: 500 },
    );
  }
}
