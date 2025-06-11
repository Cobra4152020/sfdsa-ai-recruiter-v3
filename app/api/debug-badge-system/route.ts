export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET() {
  try {
    const userId = "10278ec9-3a35-45bd-b051-eb6f805d0002";
    const supabase = getServiceSupabase();

    console.log('🔍 DEBUGGING BADGE SYSTEM');
    console.log('User ID:', userId);

    // First, check the user_badges table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_badges')
      .select('*')
      .limit(1);

    console.log('Table structure check:', { tableInfo, tableError });

    // Check existing badges for this user
    const { data: existingBadges, error: badgesError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    console.log('Existing badges:', { existingBadges, badgesError });

    // Try inserting a simple badge
    const { data: insertResult, error: insertError } = await supabase
      .from('user_badges')
      .insert([
        {
          user_id: userId,
          badge_name: 'Application Completed',
          badge_level: 'gold',
          metadata: {
            points: 500,
            description: 'Deputy Sheriff Application Completed'
          }
        }
      ])
      .select();

    console.log('Insert attempt:', { insertResult, insertError });

    return NextResponse.json({
      debug_info: {
        user_id: userId,
        table_structure: tableInfo,
        table_error: tableError,
        existing_badges: existingBadges,
        badges_error: badgesError,
        insert_result: insertResult,
        insert_error: insertError
      }
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      details: error
    }, { status: 500 });
  }
} 