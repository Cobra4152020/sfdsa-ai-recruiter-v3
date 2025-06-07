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

    // Get user's total points
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('total_points')
      .eq('id', userId)
      .single();

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