export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST() {
  try {
    const userId = "10278ec9-3a35-45bd-b051-eb6f805d0002";
    const supabase = getServiceSupabase();

    console.log('🏆 AWARDING CORRECT BADGES TO USER');
    console.log('User ID:', userId);

    // Check existing badges first
    const { data: existingBadges, error: checkError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    console.log('Existing badges:', existingBadges);
    console.log('Check error:', checkError);

    const results = [];

    // Badge 1: Complete Achiever (500 points - matches your achievement)
    const completeBadgeId = "full";
    const hasCompleteBadge = existingBadges?.some(badge => badge.badge_id === completeBadgeId);

    if (!hasCompleteBadge) {
      const { data: badge1, error: error1 } = await supabase
        .from('user_badges')
        .insert([
          {
            user_id: userId,
            badge_id: completeBadgeId,
            shared: false,
            share_count: 0
          }
        ])
        .select()
        .single();

      results.push({
        badge: "Complete Achiever",
        result: badge1,
        error: error1,
        status: error1 ? 'failed' : 'awarded'
      });
    } else {
      results.push({
        badge: "Complete Achiever",
        status: 'already_exists'
      });
    }

    // Badge 2: Application Hero (200 points)
    const appBadgeId = "application-completed";
    const hasAppBadge = existingBadges?.some(badge => badge.badge_id === appBadgeId);

    if (!hasAppBadge) {
      const { data: badge2, error: error2 } = await supabase
        .from('user_badges')
        .insert([
          {
            user_id: userId,
            badge_id: appBadgeId,
            shared: false,
            share_count: 0
          }
        ])
        .select()
        .single();

      results.push({
        badge: "Application Hero",
        result: badge2,
        error: error2,
        status: error2 ? 'failed' : 'awarded'
      });
    } else {
      results.push({
        badge: "Application Hero",
        status: 'already_exists'
      });
    }

    // Final check - get updated badges
    const { data: finalBadges, error: finalError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      message: "Badge awarding process completed!",
      results: results,
      final_badge_count: finalBadges?.length || 0,
      final_badges: finalBadges,
      final_error: finalError
    });

  } catch (error) {
    console.error('Error awarding badges:', error);
    return NextResponse.json({
      success: false,
      message: "Error awarding badges",
      error: error
    }, { status: 500 });
  }
} 