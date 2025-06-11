export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST() {
  try {
    const userId = "10278ec9-3a35-45bd-b051-eb6f805d0002";
    const badgeId = "6b970792-d15e-45b2-9ee3-fd988bff8e39"; // Application Completer - 100 points
    const supabase = getServiceSupabase();

    console.log('🏆 FINAL BADGE AWARDING ATTEMPT');
    console.log('User ID:', userId);
    console.log('Badge ID:', badgeId, '(Application Completer)');

    // Check if badge already exists
    const { data: existingBadges, error: checkError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_id', badgeId);

    console.log('Existing badge check:', { existingBadges, checkError });

    if (existingBadges && existingBadges.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Application Completer badge already exists!",
        existing_badge: existingBadges[0]
      });
    }

    // Award the badge
    const { data: newBadge, error: insertError } = await supabase
      .from('user_badges')
      .insert([
        {
          user_id: userId,
          badge_id: badgeId
          // earned_at will be set automatically by the database
          // shared and share_count have defaults
        }
      ])
      .select()
      .single();

    console.log('Badge insert result:', { newBadge, insertError });

    if (insertError) {
      return NextResponse.json({
        success: false,
        message: "Failed to award Application Completer badge",
        error: insertError
      }, { status: 500 });
    }

    // Get all user badges after successful insert
    const { data: allBadges, error: allBadgesError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      message: "🎉 Application Completer badge awarded successfully!",
      new_badge: newBadge,
      total_badges: allBadges?.length || 0,
      all_badges: allBadges,
      instructions: "🎯 Refresh your dashboard to see your new badge!"
    });

  } catch (error) {
    console.error('Final badge error:', error);
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: error
    }, { status: 500 });
  }
} 