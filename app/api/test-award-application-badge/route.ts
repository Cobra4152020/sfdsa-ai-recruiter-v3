export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = getServiceSupabase();
    const userId = "10278ec9-3a35-45bd-b051-eb6f805d0002";

    // Check if user already has this badge
    const { data: existingBadge, error: checkError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_name', 'Application Completed')
      .single();

    if (existingBadge) {
      return NextResponse.json({
        success: true,
        message: "Badge already exists",
        badge: existingBadge
      });
    }

    // Award the application completion badge
    const { data: newBadge, error: insertError } = await supabase
      .from('user_badges')
      .insert([
        {
          user_id: userId,
          badge_name: 'Application Completed',
          badge_level: 'gold',
          metadata: {
            badge_type: 'application-completed',
            description: 'Completed the full deputy sheriff application process',
            points_earned: 0,
            awarded_for: 'Deputy Sheriff Application Completion'
          }
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
      message: "Application completion badge awarded successfully!",
      badge: newBadge
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