import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, points, action, description, metadata } = await request.json();

    if (!userId || !points || !action) {
      return NextResponse.json(
        { message: "Missing required fields: userId, points, action" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Insert points transaction
    const { data: pointsData, error: pointsError } = await supabase
      .from('user_points')
      .insert({
        user_id: userId,
        points: points,
        action: action,
        description: description || `Earned ${points} points for ${action}`,
        metadata: metadata || {},
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (pointsError) {
      console.error('Points insert error:', pointsError);
      return NextResponse.json(
        { message: "Failed to award points" },
        { status: 500 }
      );
    }

    // Update user's total points
    const { data: currentUser, error: userError } = await supabase
      .from('user_profiles')
      .select('total_points')
      .eq('id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('User fetch error:', userError);
      return NextResponse.json(
        { message: "Failed to update user points" },
        { status: 500 }
      );
    }

    const currentPoints = currentUser?.total_points || 0;
    const newTotal = currentPoints + points;

    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        total_points: newTotal,
        updated_at: new Date().toISOString()
      });

    if (updateError) {
      console.error('User points update error:', updateError);
      return NextResponse.json(
        { message: "Failed to update user total points" },
        { status: 500 }
      );
    }

    // Check for new badge achievements
    await checkBadgeAchievements(userId, newTotal);

    return NextResponse.json({
      success: true,
      pointsAwarded: points,
      newTotal: newTotal,
      transaction: pointsData
    });

  } catch (error) {
    console.error('Points award error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function checkBadgeAchievements(userId: string, totalPoints: number) {
  const supabase = getServiceSupabase();

  const badges = [
    { name: "Bronze Recruit", pointsRequired: 1000, level: "bronze" },
    { name: "Silver Recruit", pointsRequired: 2500, level: "silver" },
    { name: "Gold Recruit", pointsRequired: 5000, level: "gold" },
    { name: "Platinum Recruit", pointsRequired: 10000, level: "platinum" }
  ];

  for (const badge of badges) {
    if (totalPoints >= badge.pointsRequired) {
      // Check if user already has this badge
      const { data: existingBadge } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId)
        .eq('badge_name', badge.name)
        .single();

      if (!existingBadge) {
        // Award the badge
        await supabase
          .from('user_badges')
          .insert({
            user_id: userId,
            badge_name: badge.name,
            badge_level: badge.level,
            earned_at: new Date().toISOString(),
            metadata: {
              pointsAtEarning: totalPoints,
              pointsRequired: badge.pointsRequired
            }
          });

        // Send notification (optional)
        try {
          await supabase
            .from('user_notifications')
            .insert({
              user_id: userId,
              type: 'badge_earned',
              title: `New Badge Earned: ${badge.name}!`,
              message: `Congratulations! You've earned the ${badge.name} badge with ${totalPoints} points.`,
              metadata: { badgeName: badge.name, badgeLevel: badge.level }
            });
        } catch (notificationError) {
          console.error('Badge notification error:', notificationError);
        }
      }
    }
  }
} 