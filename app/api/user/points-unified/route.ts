export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Get current total from user_profiles (main source of truth)
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('total_points, participation_count')
      .eq('id', userId)
      .single();

    const totalPoints = profileData?.total_points || profileData?.participation_count || 0;

    // Get recent activity from user_point_logs
    const { data: recentActivity, error: activityError } = await supabase
      .from('user_point_logs')
      .select('points, action, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      userId: userId,
      totalPoints: totalPoints,
      recentActivity: recentActivity || []
    });

  } catch (error) {
    console.error('Get unified points error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, pointsToAdd, action, description } = await request.json();
    console.log('🔧 Unified API called with:', { userId, pointsToAdd, action, description });

    if (!userId || !pointsToAdd || !action) {
      console.error('❌ Missing required fields:', { userId, pointsToAdd, action });
      return NextResponse.json(
        { error: 'Missing required fields: userId, pointsToAdd, action' },
        { status: 400 }
      );
    }

    console.log('🔧 Getting service supabase client...');
    const supabase = getServiceSupabase();
    console.log('✅ Service supabase client obtained');

    // Step 1: Log the activity in user_points (this works)
    console.log('🔧 Inserting into user_points table...');
    const { error: userPointsError } = await supabase
      .from('user_points')
      .insert({
        user_id: userId,
        points: pointsToAdd,
        reason: description || `Earned ${pointsToAdd} points for ${action}`,
        user_type: 'recruit',
        created_at: new Date().toISOString()
      });

    console.log('🔧 User_points insert result:', { userPointsError });

    if (userPointsError) {
      console.error('❌ Error inserting into user_points:', userPointsError);
      return NextResponse.json({ error: 'Failed to log points' }, { status: 500 });
    }

    console.log('✅ Successfully inserted into user_points');

    // Step 2: Also log in user_point_logs for backup tracking (dashboard reads from this table)
    console.log('🔧 Inserting into user_point_logs table...');
    const { error: logError } = await supabase
      .from('user_point_logs')
      .insert({
        user_id: userId,
        points: pointsToAdd,
        action: action,
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.log('⚠️ Warning: Could not log to user_point_logs:', logError);
    } else {
      console.log('✅ Successfully logged activity');
    }

    // Step 3: Calculate new total from actual point logs (no artificial base points)
    console.log('🔧 Calculating total from user_point_logs...');
    const { data: pointLogs, error: pointLogsError } = await supabase
      .from('user_point_logs')
      .select('points')
      .eq('user_id', userId);

    let calculatedTotal = 0; // Users start with 0 and earn points through actual activities
    if (!pointLogsError && pointLogs) {
      calculatedTotal = pointLogs.reduce((sum, entry) => sum + entry.points, 0);
      console.log('🔧 Points calculation from logs:', { 
        totalEntries: pointLogs.length, 
        calculatedTotal 
      });
    } else {
      // Fallback to user_points table if user_point_logs is empty
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', userId);
        
      if (!pointsError && pointsData) {
        calculatedTotal = pointsData.reduce((sum, entry) => sum + entry.points, 0);
        console.log('🔧 Points calculation from user_points fallback:', { 
          totalEntries: pointsData.length, 
          calculatedTotal 
        });
      }
    }

    // Success response with calculated total
    console.log('✅ Points awarded successfully via permission-free method');
    return NextResponse.json({
      success: true,
      message: `Successfully awarded ${pointsToAdd} points`,
      userId,
      pointsAdded: pointsToAdd,
      newTotal: calculatedTotal,
      action
    });

  } catch (error) {
    console.error('❌ Unified API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 