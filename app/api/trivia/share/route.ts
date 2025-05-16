
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"

export async function POST(req: Request) {
  try {
    const { userId, platform, questionId } = await req.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // Record the share in the social_shares table
    const { error: shareError } = await supabase.from("social_shares").insert({
      user_id: userId,
      platform: platform || "unknown",
      content_type: "trivia",
      content_id: questionId ? questionId.toString() : null,
    })

    if (shareError) {
      console.error("Error recording share:", shareError)
      return NextResponse.json({ success: false, message: "Failed to record share" }, { status: 500 })
    }

    // Award points to the user (15 points for sharing)
    const pointsToAward = 15

    const { error: pointsError } = await supabase.from("user_points").insert({
      user_id: userId,
      points: pointsToAward,
      activity: "social_share",
      description: `Shared trivia game on ${platform}`,
    })

    if (pointsError) {
      console.error("Error awarding points:", pointsError)
      return NextResponse.json({ success: false, message: "Failed to award points" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `You earned ${pointsToAward} points for sharing!`,
      pointsAwarded: pointsToAward,
    })
  } catch (error) {
    console.error("Error in share API:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
