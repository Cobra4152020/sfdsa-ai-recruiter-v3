import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

interface UserBadge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string;
  points_awarded: number;
  source: string;
  created_at: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required",
      }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Fetch user's earned badges
    const { data: userBadges, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching user badges:', error);
      return NextResponse.json({
        success: false,
        message: "Error fetching user badges",
        badges: [],
      }, { status: 500 });
    }

    // Calculate user badge statistics
    const totalBadges = userBadges?.length || 0;
    const totalPoints = userBadges?.reduce((sum, badge) => sum + (badge.points_awarded || 0), 0) || 0;
    
    // Group badges by category/source
    const badgesBySource = userBadges?.reduce((acc, badge) => {
      const source = badge.source || 'manual';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Recent badges (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentBadges = userBadges?.filter(badge => 
      new Date(badge.created_at) > sevenDaysAgo
    ) || [];

    return NextResponse.json({
      success: true,
      badges: userBadges || [],
      statistics: {
        total_badges: totalBadges,
        total_points: totalPoints,
        recent_badges: recentBadges.length,
        badges_by_source: badgesBySource,
      },
      recent_activity: recentBadges.slice(0, 5), // Last 5 recent badges
    });

  } catch (error) {
    console.error('Error in user badges API:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      badges: [],
    }, { status: 500 });
  }
}

// POST endpoint to award a badge to this specific user
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { badgeType, source = 'manual' } = await request.json();

    if (!userId || !badgeType) {
      return NextResponse.json({
        success: false,
        message: "User ID and badge type are required",
      }, { status: 400 });
    }

    // Forward to the main badges endpoint
    const response = await fetch(new URL('/api/badges', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        badgeType,
        source,
      }),
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });

  } catch (error) {
    console.error('Error awarding badge to user:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}
