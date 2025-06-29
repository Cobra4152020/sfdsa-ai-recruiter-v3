export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Find user by email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { message: `User not found with email: ${email}` },
        { status: 404 }
      );
    }

    const userId = userData.id;

    // Award briefing points directly to user_point_logs
    const { error: logError } = await supabase
      .from("user_point_logs")
      .insert({
        user_id: userId,
        points: 5,
        action: "daily_briefing_attendance",
        created_at: new Date().toISOString(),
      });

    if (logError) {
      console.error("Error logging briefing points:", logError);
      return NextResponse.json(
        { message: "Failed to award briefing points" },
        { status: 500 }
      );
    }

    // Calculate new total from user_point_logs
    const { data: allLogs, error: totalError } = await supabase
      .from("user_point_logs")
      .select("points")
      .eq("user_id", userId);

    const newTotal = allLogs?.reduce((sum, log) => sum + log.points, 0) || 5;

    return NextResponse.json({
      success: true,
      message: `Successfully awarded 5 briefing points to ${email}`,
      user: {
        id: userId,
        email: email,
        name: userData.name,
        points_awarded: 5,
        new_total: newTotal,
      },
      action: "daily_briefing_attendance",
    });
  } catch (error) {
    console.error("Error in test briefing points:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 