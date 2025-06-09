import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, points, action, description } = await request.json();
    console.log('Points award request:', { userId, points, action });

    if (!userId || !points || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: userId, points, action" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Simple approach - just check what user data exists first
    console.log('Checking user existence...');
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, participation_count')
      .eq('id', userId)
      .single();

    console.log('User fetch result:', { existingUser, fetchError });

    if (fetchError) {
      console.error('User fetch failed:', fetchError);
      return NextResponse.json(
        { success: false, message: "User not found", error: fetchError },
        { status: 404 }
      );
    }

    // Calculate new total
    const currentPoints = existingUser?.participation_count || 0;
    const newTotal = currentPoints + points;
    
    console.log('Points calculation:', { currentPoints, points, newTotal });

    // Update the user's points
    const { error: updateError } = await supabase
      .from('users')
      .update({
        participation_count: newTotal,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    console.log('Update result:', { updateError });

    if (updateError) {
      console.error('Points update failed:', updateError);
      return NextResponse.json(
        { success: false, message: "Failed to update points", error: updateError },
        { status: 500 }
      );
    }

    console.log('Points awarded successfully!');
    return NextResponse.json({
      success: true,
      awarded: true,
      pointsAwarded: points,
      newTotal: newTotal,
      message: `Successfully awarded ${points} points`
    });

  } catch (error) {
    console.error('Points award error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function checkBadgeAchievements(userId: string, totalPoints: number) {
  const supabase = getServiceSupabase();

  const badges = [
    { name: "Bronze Recruit", pointsRequired: 100, level: "bronze" },
    { name: "Silver Recruit", pointsRequired: 250, level: "silver" },
    { name: "Gold Recruit", pointsRequired: 500, level: "gold" },
    { name: "Platinum Recruit", pointsRequired: 1000, level: "platinum" }
  ];

  for (const badge of badges) {
    if (totalPoints >= badge.pointsRequired) {
      try {
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

          // Send notification (optional, only if table exists)
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
            console.log('Badge notification table not available');
          }
        }
      } catch (badgeError) {
        console.log('Badge system not available:', badgeError);
      }
    }
  }
} 