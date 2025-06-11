export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const userId = "10278ec9-3a35-45bd-b051-eb6f805d0002";
    const supabase = getServiceSupabase();

    console.log('=== VERIFYING LIVE DATA FOR USER ===');
    console.log('User ID:', userId);

    // 1. Verify user exists and get real data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('User Data:', userData);
    console.log('User Error:', userError);

    // 2. Check user_profiles table  
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('Profile Data:', profileData);
    console.log('Profile Error:', profileError);

    // 3. Check points data (verify not demo)
    const { data: pointsData, error: pointsError } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('Points Data:', pointsData);
    console.log('Points Error:', pointsError);

    // 4. Check deputy applications (verify real application)
    const { data: applicationData, error: appError } = await supabase
      .from('deputy_applications')
      .select('*')
      .eq('first_name', 'cobra4152021@gmail.com')
      .or('email.eq.cobra4152021@gmail.com');

    console.log('Application Data:', applicationData);
    console.log('Application Error:', appError);

    // 5. Check current badges
    const { data: badgeData, error: badgeError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    console.log('Current Badges:', badgeData);
    console.log('Badge Error:', badgeError);

    // 6. Try to award the application completion badge
    if (!badgeError) {
      const existingBadge = badgeData?.find(b => b.badge_name === 'Application Completed');
      
      if (!existingBadge) {
        console.log('Attempting to award Application Completed badge...');
        
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
                points_earned: 500,
                awarded_for: 'Deputy Sheriff Application Completion',
                awarded_date: new Date().toISOString(),
                verification: 'manually_awarded_after_technical_issue'
              }
            }
          ])
          .select()
          .single();

        console.log('Badge Insert Result:', newBadge);
        console.log('Badge Insert Error:', insertError);

        return NextResponse.json({
          success: true,
          message: "Data verification complete and badge awarded",
          verification: {
            user_exists: !!userData,
            profile_exists: !!profileData,
            points_count: pointsData?.length || 0,
            applications_count: applicationData?.length || 0,
            existing_badges: badgeData?.length || 0,
            badge_awarded: !insertError,
            new_badge: newBadge
          }
        });
      } else {
        return NextResponse.json({
          success: true,
          message: "Badge already exists",
          verification: {
            user_exists: !!userData,
            profile_exists: !!profileData,
            points_count: pointsData?.length || 0,
            applications_count: applicationData?.length || 0,
            existing_badges: badgeData?.length || 0,
            badge_already_exists: true
          }
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: "Badge table access issue",
      verification: {
        user_exists: !!userData,
        profile_exists: !!profileData,
        points_count: pointsData?.length || 0,
        applications_count: applicationData?.length || 0,
        badge_table_error: badgeError
      }
    });

  } catch (error) {
    console.error('Error verifying data and awarding badge:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error
    }, { status: 500 });
  }
} 