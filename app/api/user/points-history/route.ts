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

    // Get the last 30 days of points history from user_point_logs
    const { data: pointLogs, error: pointLogsError } = await supabase
      .from('user_point_logs')
      .select('points, action, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (pointLogsError) {
      console.error('Error fetching points history:', pointLogsError);
      return NextResponse.json({ error: 'Failed to fetch points history' }, { status: 500 });
    }

    // Generate daily points history for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    
    const pointsHistory = [];
    let runningTotal = 0;

    // Create 30 days of history
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find points earned on this specific date
      const dailyPoints = pointLogs
        ?.filter(log => {
          const logDate = new Date(log.created_at).toISOString().split('T')[0];
          return logDate === dateStr;
        })
        .reduce((sum, log) => sum + log.points, 0) || 0;
      
      runningTotal += dailyPoints;
      
      pointsHistory.push({
        date: dateStr,
        points: dailyPoints,
        total: runningTotal
      });
    }

    return NextResponse.json({
      success: true,
      userId: userId,
      pointsHistory: pointsHistory,
      totalPoints: runningTotal,
      totalLogs: pointLogs?.length || 0
    });

  } catch (error) {
    console.error('Points history API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 