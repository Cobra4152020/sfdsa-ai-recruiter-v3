
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { type NextRequest, NextResponse } from "next/server"
import { trackEngagement } from "@/lib/analytics"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Flag to track if video generation is available
let videoSupport = false

// Try to load video-related modules, but don't fail if they're not available
try {
  if (typeof window === "undefined") {
    // Just check if we can require the module, but don't actually use it yet
    require.resolve("canvas")

    // Check if ffmpeg is available - but we'll skip this for now
    // as it's likely not available in the serverless environment
    videoSupport = false // Set to false for now
  }
} catch (error) {
  console.warn("Video generation support not available:", error.message)
  videoSupport = false
}

export async function POST(request: NextRequest) {
  try {
    const { userId, achievementType, achievementId, achievementTitle, achievementDescription, imageUrl } =
      await request.json()

    if (!userId || !achievementType || !achievementTitle) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Track this sharing attempt
    trackEngagement("tiktok_video_share_attempt", {
      userId,
      achievementType,
      achievementId,
      achievementTitle,
    })

    // Record the share in the database
    await supabaseAdmin.from("social_shares").insert({
      user_id: userId,
      platform: "tiktok",
      content_type: achievementType,
      content_id: achievementId,
      content_title: achievementTitle,
      points_awarded: 50, // Award points for TikTok sharing (more than Instagram)
    })

    // Always return a fallback response - we'll implement a client-side solution instead
    return NextResponse.json({
      success: true,
      message: "Share recorded successfully",
      fallback: true,
      imageUrl: imageUrl || "/generic-badge.png", // Use provided image or fallback
      title: achievementTitle,
      description: achievementDescription || "",
      type: achievementType,
    })
  } catch (error) {
    console.error("Error processing TikTok video share:", error)
    return NextResponse.json({ success: false, error: "Failed to process share request" }, { status: 500 })
  }
}
