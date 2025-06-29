import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

// Endpoint to demonstrate how easy it is for real users to surpass mock data
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

    // Use the new direct points API instead of the complex addParticipationPoints function
    try {
      const pointsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user/award-points-direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          points: pointsToAward,
          action: action,
          description: `Awarded ${pointsToAward} points for ${action}`
        }),
      });

      const pointsResult = await pointsResponse.json();
      
      if (!pointsResult.success) {
        console.error('Error awarding points via direct API:', pointsResult);
        return NextResponse.json({
          success: false,
          message: "Could not award points: " + pointsResult.message,
        }, { status: 500 });
      }

      console.log('✅ Points awarded successfully via direct API:', pointsResult);
    } catch (pointsError) {
      console.error('Error calling direct points API:', pointsError);
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
      demonstration: {
        message: "With just a few activities, real users will surpass the mock data!",
        mock_top_score: 85,
        user_new_score: updatedUser?.participation_count || 0,
        can_surpass_mock: (updatedUser?.participation_count || 0) > 85
      }
    });

  } catch (error) {
    console.error('Error in demo points API:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Demo user points endpoint ready",
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
    mock_data_info: {
      top_mock_score: 85,
      message: "Mock users have very low scores (25-85 points) so real users can easily climb the leaderboard!"
    }
  });
} 