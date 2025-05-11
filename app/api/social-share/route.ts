import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"

export async function POST(req: Request) {
  try {
    const { userId, platform, contentType, contentTitle, url } = await req.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // Record the share in the social_shares table
    const { error: shareError } = await supabase.from("social_shares").insert({
      user_id: userId,
      platform: platform || "unknown",
      content_type: contentType || "achievement",
      content_title: contentTitle,
      shared_url: url,
    })

    if (shareError) {
      console.error("Error recording share:", shareError)
      return NextResponse.json({ success: false, message: "Failed to record share" }, { status: 500 })
    }

    // Award points to the user (25 points for sharing achievements)
    const pointsToAward = 25

    const { error: pointsError } = await supabase.from("user_points").insert({
      user_id: userId,
      points: pointsToAward,
      activity: "social_share",
      description: `Shared ${contentType || "achievement"} on ${platform}`,
    })

    if (pointsError) {
      console.error("Error awarding points:", pointsError)
      return NextResponse.json({ success: false, message: "Failed to award points" }, { status: 500 })
    }

    // Check if user qualifies for the "connector" badge
    const { count } = await supabase
      .from("social_shares")
      .select("*", { count: "exact", head: false })
      .eq("user_id", userId)

    // If user has shared 5 or more times, award the connector badge
    if (count && count >= 5) {
      const { data: existingBadge } = await supabase
        .from("badges")
        .select("id")
        .eq("user_id", userId)
        .eq("badge_type", "connector")
        .single()

      if (!existingBadge) {
        await supabase.from("badges").insert({
          user_id: userId,
          badge_type: "connector",
          earned_at: new Date().toISOString(),
        })

        // Award additional points for earning the badge
        await supabase.from("user_points").insert({
          user_id: userId,
          points: 100,
          activity: "badge_earned",
          description: "Earned Connector badge by sharing content",
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `You earned ${pointsToAward} points for sharing!`,
      pointsAwarded: pointsToAward,
    })
  } catch (error) {
    console.error("Error in social share API:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
