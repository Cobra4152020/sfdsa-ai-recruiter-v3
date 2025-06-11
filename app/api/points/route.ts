import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { addParticipationPoints } from "@/lib/points-service";

export const dynamic = "force-dynamic";

// Production points system for awarding points to users
export async function POST(request: Request) {
  try {
    const { userId, action = 'chat_participation', points } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "userId is required",
      }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Award points based on action
    const pointsMap: Record<string, number> = {
      'chat_participation': 5,
      'contact_form_submission': 10,
      'resource_download': 10, 
      'practice_test': 20,
      'referral': 50,
      'application_submission': 500,
      'badge_earned': 100, // Variable, passed in body
      'sgt_ken_game_win': 0, // Variable based on attempts, passed in body
      'deputy_skills_test': 0, // Variable based on performance, passed in body
      'trivia_game_completion': 0, // Variable based on score and performance, passed in body
      'tiktok_challenge_submission': 0, // Variable based on challenge type, passed in body
    };

    // Calculate points to award
    let pointsToAward = pointsMap[action] || 0;
    
    // Handle variable point actions
    if (action === 'badge_earned' && points) {
      pointsToAward = points;
    } else if (action === 'sgt_ken_game_win' && points) {
      pointsToAward = points; // Points calculated by game based on attempts
    } else if (action === 'deputy_skills_test' && points) {
      pointsToAward = points; // Points calculated based on performance
    } else if (action === 'trivia_game_completion' && points) {
      pointsToAward = points; // Points calculated based on score
    } else if (action === 'tiktok_challenge_submission' && points) {
      pointsToAward = points; // Points calculated based on challenge type
    }

    // Use the production points service
    const success = await addParticipationPoints(
      userId,
      pointsToAward,
      action,
      `Awarded ${pointsToAward} points for ${action}`
    );

    if (!success) {
      console.error('Error awarding points via participation service');
      return NextResponse.json({
        success: false,
        message: "Could not award points",
      }, { status: 500 });
    }

    // Get the updated user data for response
    const { data: updatedUser } = await supabase
      .from('users')
      .select('id, name, participation_count')
      .eq('id', userId)
      .single();

    return NextResponse.json({
      success: true,
      message: `Awarded ${pointsToAward} points for ${action}`,
      user: updatedUser,
      points_awarded: pointsToAward,
      action: action,
      new_total: updatedUser?.participation_count || 0
    });

  } catch (error) {
    console.error('Error in points API:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Production points system ready",
    available_actions: [
      { action: 'chat_participation', points: 5 },
      { action: 'contact_form_submission', points: 10 },
      { action: 'resource_download', points: 10 },
      { action: 'practice_test', points: 20 },
      { action: 'referral', points: 50 },
      { action: 'application_submission', points: 500 },
      { action: 'badge_earned', points: 'variable' },
      { action: 'sgt_ken_game_win', points: 'variable (100-220)' },
      { action: 'deputy_skills_test', points: 'variable (100-220)' },
      { action: 'trivia_game_completion', points: 'variable (60-120)' },
      { action: 'tiktok_challenge_submission', points: 'variable (125-200)' }
    ],
    system_info: {
      type: "production",
      description: "Live points system for SFDSA recruitment platform"
    }
  });
} 