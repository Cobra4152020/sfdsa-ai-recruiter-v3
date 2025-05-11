import { type NextRequest, NextResponse } from "next/server"
import { trackEngagement } from "@/lib/analytics"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { imageGenerationClient } from "@/lib/image-generation-client"

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

    // Check if the image generation service is available
    const serviceAvailable = await imageGenerationClient.isAvailable()

    if (!serviceAvailable) {
      // Fallback to a simple response if the service is not available
      return NextResponse.json({
        success: true,
        message: "Share recorded successfully",
        fallback: true,
        imageUrl: imageUrl || "/generic-badge.png",
      })
    }

    // Use the dedicated service to generate the video
    const response = await imageGenerationClient.generateTikTokVideo({
      achievementType,
      achievementId,
      achievementTitle,
      achievementDescription,
      imageUrl,
    })

    // Get the content type from the response
    const contentType = response.headers.get("Content-Type") || "video/mp4"
    const contentDisposition = response.headers.get("Content-Disposition") || ""

    // Stream the response directly to the client
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    })
  } catch (error) {
    console.error("Error generating TikTok video:", error)
    return NextResponse.json({ success: false, error: "Failed to generate TikTok video" }, { status: 500 })
  }
}
