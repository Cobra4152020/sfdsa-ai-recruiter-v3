export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { userId, badgeName, badgeLevel = 'gold', metadata = {} } = await request.json();

    if (!userId || !badgeName) {
      return NextResponse.json({
        success: false,
        message: "User ID and badge name are required",
      }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Check if user already has this badge
    const { data: existingBadge, error: checkError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_name', badgeName)
      .single();

    if (existingBadge) {
      return NextResponse.json({
        success: true,
        message: "Badge already exists",
        badge: existingBadge,
        alreadyEarned: true
      });
    }

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing badge:', checkError);
      return NextResponse.json({
        success: false,
        message: "Error checking for existing badge",
        error: checkError
      }, { status: 500 });
    }

    // Award the badge using the correct schema
    const { data: newBadge, error: insertError } = await supabase
      .from('user_badges')
      .insert([
        {
          user_id: userId,
          badge_name: badgeName,
          badge_level: badgeLevel,
          metadata: metadata
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting badge:', insertError);
      return NextResponse.json({
        success: false,
        message: "Failed to award badge",
        error: insertError
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${badgeName} badge awarded successfully!`,
      badge: newBadge,
      alreadyEarned: false
    });

  } catch (error) {
    console.error('Error awarding badge:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error
    }, { status: 500 });
  }
} 