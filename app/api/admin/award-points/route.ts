export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, points, action, description } = await request.json();

    if (!email || !points || !action) {
      return NextResponse.json(
        { message: "Missing required fields: email, points, action" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Find user by email from public tables
    let userData = null;
    let userError = null;
    
    // Try user_profiles first
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, email")
      .eq("email", email)
      .single();

    if (profileData) {
      userData = profileData;
    } else {
      // Fallback to users table
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email")
        .eq("email", email)
        .single();
      
      userData = usersData;
      userError = usersError;
    }

    if (userError || !userData) {
      return NextResponse.json(
        { message: `User not found with email: ${email}` },
        { status: 404 }
      );
    }

    const userId = userData.id;

    // Log the points in user_point_logs
    const { error: logError } = await supabase
      .from("user_point_logs")
      .insert({
        user_id: userId,
        points: points,
        action: action,
        created_at: new Date().toISOString(),
      });

    if (logError) {
      console.error("Error logging points:", logError);
      return NextResponse.json(
        { message: "Failed to log points" },
        { status: 500 }
      );
    }

    // Also log in user_points table for redundancy
    try {
      await supabase
        .from("user_points")
        .insert({
          user_id: userId,
          points: points,
          reason: description || `Admin award: ${points} points for ${action}`,
          user_type: 'recruit',
          created_at: new Date().toISOString()
        });
    } catch (pointsError) {
      console.warn('Could not log to user_points table:', pointsError);
    }

    // Calculate new total from user_point_logs
    const { data: allLogs, error: totalError } = await supabase
      .from("user_point_logs")
      .select("points")
      .eq("user_id", userId);

    const newTotal = allLogs?.reduce((sum, log) => sum + log.points, 0) || points;

    return NextResponse.json({
      success: true,
      message: `Successfully awarded ${points} points to ${email}`,
      user: {
        id: userId,
        email: email,
        points_awarded: points,
        new_total: newTotal,
      },
      action: action,
    });
  } catch (error) {
    console.error("Error in admin award points:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 