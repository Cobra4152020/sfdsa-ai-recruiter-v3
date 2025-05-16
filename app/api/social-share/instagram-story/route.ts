
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { type NextRequest, NextResponse } from "next/server"
import { trackEngagement } from "@/lib/analytics"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Flag to track if canvas is available
let canvasSupport = false

// Try to load canvas-related modules, but don't fail if they're not available
try {
  if (typeof window === "undefined") {
    // Just check if we can require the module, but don't actually use it yet
    require.resolve("canvas")
    canvasSupport = true
  }
} catch (error) {
  console.warn("Canvas support not available:", error.message)
  canvasSupport = false
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      achievementType,
      achievementId,
      achievementTitle,
      achievementDescription,
      imageUrl,
      animated = true,
    } = await request.json()

    if (!userId || !achievementType || !achievementTitle) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Track this sharing attempt
    trackEngagement("instagram_story_share_attempt", {
      userId,
      achievementType,
      achievementId,
      achievementTitle,
      animated,
    })

    // Record the share in the database
    await supabaseAdmin.from("social_shares").insert({
      user_id: userId,
      platform: "instagram",
      content_type: achievementType,
      content_id: achievementId,
      content_title: achievementTitle,
      points_awarded: 25, // Award points for Instagram sharing
      metadata: { animated },
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
    console.error("Error processing Instagram story share:", error)
    return NextResponse.json({ success: false, error: "Failed to process share request" }, { status: 500 })
  }
}
