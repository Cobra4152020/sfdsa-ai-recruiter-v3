export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST() {
  try {
    const userId = "10278ec9-3a35-45bd-b051-eb6f805d0002";
    const supabase = getServiceSupabase();

    console.log('🎯 AWARDING APPLICATION COMPLETION BADGE');
    console.log('User ID:', userId);

    // First, check what badges already exist for this user
    const { data: existingBadges, error: checkError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    console.log('Current badges for user:', existingBadges);
    console.log('Check error:', checkError);

    // Check if Application Completed badge already exists
    const hasAppBadge = existingBadges?.some(badge => 
      badge.badge_name === 'Application Completed'
    );

    if (hasAppBadge) {
      return NextResponse.json({
        success: true,
        message: "Application Completed badge already exists",
        existing_badges: existingBadges
      });
    }

    // Insert the badge
    const badgeData = {
      user_id: userId,
      badge_name: 'Application Completed',
      badge_level: 'standard',
      metadata: {
        description: 'Successfully completed deputy sheriff application',
        points_earned: 500,
        achievement_type: 'application_completion',
        awarded_manually: true,
        awarded_at: new Date().toISOString()
      }
    };

    console.log('Inserting badge with data:', JSON.stringify(badgeData, null, 2));

    const { data: newBadge, error: insertError } = await supabase
      .from('user_badges')
      .insert([badgeData])
      .select()
      .single();

    console.log('Insert result - newBadge:', newBadge);
    console.log('Insert result - error:', insertError);

    if (insertError) {
      return NextResponse.json({
        success: false,
        message: "Failed to award badge",
        error: insertError,
        badge_data_attempted: badgeData
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "🏆 Application Completed badge awarded successfully!",
      badge: newBadge,
      next_step: "Check your dashboard to see your new badge"
    });

  } catch (error) {
    console.error('Error in badge awarding:', error);
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: error
    }, { status: 500 });
  }
} 