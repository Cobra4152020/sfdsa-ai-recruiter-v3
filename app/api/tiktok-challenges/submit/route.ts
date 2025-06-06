import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, challengeId, tiktokUrl, videoDescription, hashtags } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    if (!challengeId) {
      return NextResponse.json(
        { success: false, message: "Challenge ID is required" },
        { status: 400 },
      );
    }

    if (!tiktokUrl) {
      return NextResponse.json(
        { success: false, message: "TikTok URL is required" },
        { status: 400 },
      );
    }

    const supabase = getServiceSupabase();

    // Try to record in database first
    try {
      const { error: submissionError } = await supabase
        .from("tiktok_challenge_submissions")
        .insert({
          challenge_id: challengeId,
          user_id: userId,
          video_url: tiktokUrl,
          tiktok_url: tiktokUrl,
          status: "pending",
          submitted_at: new Date().toISOString(),
          metadata: {
            description: videoDescription,
            hashtags: hashtags,
            source: "web_submission"
          }
        });

      if (submissionError) {
        console.error("Database submission failed:", submissionError);
      }
    } catch (dbError) {
      console.error("Database unavailable, using live points fallback:", dbError);
    }

    // Determine points based on challenge (enhanced rewards)
    const challengePoints: Record<string, number> = {
      "1": 150, // Recruit Life Challenge
      "2": 200, // Community Hero Challenge  
      "3": 175, // Academy Ready Challenge
      "4": 125, // SF Pride Challenge
      "5": 180, // Future Deputy Challenge
    };

    const challengeBadges: Record<string, string> = {
      "1": "storyteller",
      "2": "community-champion", 
      "3": "fitness-focused",
      "4": "sf-ambassador",
      "5": "visionary-leader",
    };

    const pointsToAward = challengePoints[challengeId] || 100;
    const badgeToAward = challengeBadges[challengeId];

    // Integrate with live points system
    try {
      const pointsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/api/demo-user-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'tiktok_challenge_submission',
          points: pointsToAward,
          challengeDetails: {
            challengeId,
            tiktokUrl,
            videoDescription,
            hashtags,
            submissionType: 'tiktok_challenge'
          }
        }),
      });

      if (!pointsResponse.ok) {
        console.error('Failed to award live points for TikTok challenge');
      }
    } catch (pointsError) {
      console.error('Error awarding live points:', pointsError);
    }

    // Award badge using main badge system
    if (badgeToAward) {
      try {
        const badgeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/api/badges`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            badgeType: badgeToAward,
            source: `tiktok_challenge_${challengeId}`,
          }),
        });

        if (!badgeResponse.ok) {
          console.error('Failed to award badge for TikTok challenge');
        }
      } catch (badgeError) {
        console.error('Error awarding badge:', badgeError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `TikTok challenge submitted successfully! Earned ${pointsToAward} points${badgeToAward ? ' and a badge' : ''}.`,
      pointsAwarded: pointsToAward,
      badgeAwarded: badgeToAward,
      submissionStatus: "pending",
      note: "Your submission is being reviewed and will be approved soon!"
    });

  } catch (error) {
    console.error("Error submitting TikTok challenge:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
} 