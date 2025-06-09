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

    // Get user's total points from the appropriate table
    // First check user type
    const { data: userTypeData } = await supabase
      .from('user_types')
      .select('user_type')
      .eq('user_id', userId)
      .single();

    let userProfile = null;
    let error = null;

    if (userTypeData?.user_type === 'recruit') {
      const { data, error: recruitError } = await supabase
        .from('recruits')
        .select('points')
        .eq('user_id', userId)
        .single();
      userProfile = data ? { total_points: data.points } : null;
      error = recruitError;
    } else if (userTypeData?.user_type === 'volunteer') {
      const { data, error: volunteerError } = await supabase
        .from('volunteer_recruiters')
        .select('points')
        .eq('user_id', userId)
        .single();
      userProfile = data ? { total_points: data.points } : null;
      error = volunteerError;
    } else {
      // Default to users table
      const { data, error: userError } = await supabase
        .from('users')
        .select('participation_count')
        .eq('id', userId)
        .single();
      userProfile = data ? { total_points: data.participation_count || 0 } : null;
      error = userError;
    }

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user points:', error);
      return NextResponse.json(
        { message: "Failed to fetch user points" },
        { status: 500 }
      );
    }

    const totalPoints = userProfile?.total_points || 0;

    return NextResponse.json({
      success: true,
      totalPoints,
      userId
    });

  } catch (error) {
    console.error('User points fetch error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 