export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const userId = "10278ec9-3a35-45bd-b051-eb6f805d0002";
    const badgeName = "Application Completed";

    const supabase = getServiceSupabase();

    console.log('Attempting to award badge to user:', userId);

    // Check if user already has this badge
    const { data: existingBadge, error: checkError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_name', badgeName)
      .single();

    console.log('Existing badge check result:', { existingBadge, checkError });

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

    // Award the badge using only basic required columns
    const { data: newBadge, error: insertError } = await supabase
      .from('user_badges')
      .insert([
        {
          user_id: userId,
          badge_name: badgeName,
          metadata: {
            badge_type: 'application-completed',
            description: 'Completed the full deputy sheriff application process',
            points_earned: 500,
            awarded_for: 'Deputy Sheriff Application Completion'
          }
        }
      ])
      .select()
      .single();

    console.log('Badge insert result:', { newBadge, insertError });

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