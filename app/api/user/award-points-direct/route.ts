import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { userId, points, action, description } = await request.json();

    if (!userId || !points || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: userId, points, action" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Simple direct insert to user_point_logs (what dashboard reads from)
    const { error: logError } = await supabase
      .from("user_point_logs")
      .insert({
        user_id: userId,
        points: points,
        action: action,
        description: description || `Earned ${points} points for ${action}`,
        created_at: new Date().toISOString(),
      });

    if (logError) {
      console.error("Error logging to user_point_logs:", logError);
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to log points", 
          error: logError.message,
          code: logError.code 
        },
        { status: 500 }
      );
    }

    // Calculate new total from user_point_logs
    const { data: allLogs, error: totalError } = await supabase
      .from("user_point_logs")
      .select("points")
      .eq("user_id", userId);

    const newTotal = allLogs?.reduce((sum, log) => sum + log.points, 0) || points;

    console.log(`✅ Successfully logged ${points} points directly to user_point_logs for ${action}`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully awarded ${points} points for ${action}`,
      pointsAwarded: points,
      newTotal: newTotal,
      userId: userId,
      action: action
    });

  } catch (error) {
    console.error("Direct points award error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 