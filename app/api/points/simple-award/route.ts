import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, points, action, description } = await request.json();
    console.log('Simple points award request:', { userId, points, action, description });

    if (!userId || !points || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: userId, points, action" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Insert into user_point_logs table (this is what the dashboard reads from)
    const { error: logError } = await supabase
      .from('user_point_logs')
      .insert({
        user_id: userId,
        points: points,
        action: action,
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Points log insertion failed:', logError);
      return NextResponse.json(
        { success: false, message: "Failed to log points", error: logError },
        { status: 500 }
      );
    }

    console.log('Points logged successfully to user_point_logs!');
    return NextResponse.json({
      success: true,
      awarded: true,
      pointsAwarded: points,
      message: `Successfully logged ${points} points for ${action}`
    });

  } catch (error) {
    console.error('Simple points award error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 