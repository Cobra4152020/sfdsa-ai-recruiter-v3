export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const userId = "10278ec9-3a35-45bd-b051-eb6f805d0002";
    const supabase = getServiceSupabase();

    console.log('🎯 AWARDING APPLICATION COMPLETION BADGE');
    console.log('User ID:', userId);

    // Check if badge already exists
    const { data: existingBadges, error: checkError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    console.log('Existing badges check:', { existingBadges, checkError });

    if (checkError) {
      return NextResponse.json({
        success: false,
        message: "Error checking existing badges",
        error: checkError
      }, { status: 500 });
    }

    const hasApplicationBadge = existingBadges?.some(badge => 
      badge.badge_name === 'Application Completed' || 
      badge.badge_name?.includes('Application')
    );

    if (hasApplicationBadge) {
      return NextResponse.json({
        success: true,
        message: "Application Completed badge already exists",
        existing_badges: existingBadges
      });
    }

    // Award the badge using ONLY the columns that actually exist
    console.log('Inserting badge with minimal schema...');
    
    const { data: newBadge, error: insertError } = await supabase
      .from('user_badges')
      .insert([
        {
          user_id: userId,
          badge_name: 'Application Completed',
          // Removed badge_level since it doesn't exist in the actual schema
          metadata: {
            badge_type: 'application-completed',
            description: 'Completed the full deputy sheriff application process',
            points_earned: 500,
            awarded_for: 'Deputy Sheriff Application Completion',
            awarded_date: new Date().toISOString(),
            verification: 'manually_awarded_for_confirmed_application_completion'
          }
        }
      ])
      .select()
      .single();

    console.log('Badge insert result:', { newBadge, insertError });

    if (insertError) {
      return NextResponse.json({
        success: false,
        message: "Failed to insert badge",
        error: insertError,
        attempted_schema: "user_id, badge_name, metadata only"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "🏆 Application Completed badge awarded successfully!",
      badge: newBadge,
      next_step: "Check your dashboard at /dashboard to see your new badge"
    });

  } catch (error) {
    console.error('Error awarding application badge:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error
    }, { status: 500 });
  }
} 