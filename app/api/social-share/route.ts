import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, platform, contentType, contentId, contentTitle, url, animated, videoUrl, videoDuration } = data

    if (!userId || !platform || !contentType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Record the share in the database
    const { data: shareData, error } = await supabase
      .from("social_shares")
      .insert({
        user_id: userId,
        platform,
        content_type: contentType,
        content_id: contentId || null,
        content_title: contentTitle || null,
        url: url || null,
        metadata: {
          animated,
          videoUrl,
          videoDuration,
          timestamp: new Date().toISOString(),
        },
        video_url: videoUrl || null,
        video_duration: videoDuration || null,
      })
      .select()

    if (error) {
      console.error("Error recording social share:", error)
      return NextResponse.json({ error: "Failed to record share" }, { status: 500 })
    }

    // Award points (this is handled by database triggers)

    return NextResponse.json({
      success: true,
      message: "Share recorded successfully",
      data: shareData,
    })
  } catch (error) {
    console.error("Error processing social share:", error)
    return NextResponse.json({ error: "Failed to process share" }, { status: 500 })
  }
}
