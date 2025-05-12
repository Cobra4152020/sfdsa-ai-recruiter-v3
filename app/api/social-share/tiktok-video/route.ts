import { type NextRequest, NextResponse } from "next/server"
import { trackEngagement } from "@/lib/analytics"
import { supabaseAdmin } from "@/lib/supabase-admin"
import path from "path"
import fs from "fs"
import os from "os"
import { v4 as uuidv4 } from "uuid"

// Check if we're in a Node.js environment with canvas and video support
let videoSupport = false
let generateVideo, generateBadgeTikTokFrames, generateNFTTikTokFrames

try {
  // Dynamically import video-related modules
  if (typeof window === "undefined") {
    const videoUtils = require("@/lib/video-utils")
    generateVideo = videoUtils.generateVideo
    generateBadgeTikTokFrames = videoUtils.generateBadgeTikTokFrames
    generateNFTTikTokFrames = videoUtils.generateNFTTikTokFrames

    // Check if ffmpeg is available
    const { execSync } = require("child_process")
    try {
      execSync("ffmpeg -version", { stdio: "ignore" })
      videoSupport = true
    } catch (e) {
      console.warn("FFmpeg not available")
      videoSupport = false
    }
  }
} catch (error) {
  console.warn("Video generation support not available:", error)
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

    // If video generation is not supported in this environment, return a fallback response
    if (!videoSupport) {
      return NextResponse.json({
        success: true,
        message: "Share recorded successfully",
        fallback: true,
        imageUrl: imageUrl || "/generic-badge.png", // Use provided image or fallback
      })
    }

    // Determine image paths
    const logoPath = `${process.cwd()}/public/sfdsa-logo.png`

    let achievementImagePath = imageUrl
    // If no image URL provided, use a default based on achievement type
    if (!achievementImagePath) {
      if (achievementType === "badge") {
        achievementImagePath = `${process.cwd()}/public/generic-badge.png`
      } else if (achievementType === "nft") {
        achievementImagePath = `${process.cwd()}/public/achievement-icon.png`
      } else {
        achievementImagePath = `${process.cwd()}/public/sfdsa-logo.png`
      }
    } else if (achievementImagePath.startsWith("/")) {
      // Convert relative URL to absolute file path
      achievementImagePath = `${process.cwd()}/public${achievementImagePath}`
    }

    // Create temp directory for video generation
    const tempDir = path.join(os.tmpdir(), `tiktok-${uuidv4()}`)
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Output video path
    const outputPath = path.join(tempDir, `${achievementType}-${achievementId}.mp4`)

    // Generate frames based on achievement type
    let frames
    if (achievementType === "badge") {
      frames = generateBadgeTikTokFrames(achievementTitle, achievementDescription || "", achievementImagePath, logoPath)
    } else if (achievementType === "nft") {
      frames = generateNFTTikTokFrames(achievementTitle, achievementDescription || "", achievementImagePath, logoPath)
    } else {
      // Default frames for other achievement types
      frames = generateBadgeTikTokFrames(achievementTitle, achievementDescription || "", achievementImagePath, logoPath)
    }

    // Video configuration
    const videoConfig = {
      width: 1080,
      height: 1920,
      fps: 30,
      duration: 3, // 3 seconds
      outputPath,
      tempDir,
      watermark: {
        text: "sfdeputysheriff.com",
        position: "bottom-right" as const,
        fontSize: 40,
        color: "rgba(255, 215, 0, 0.8)",
        padding: 30,
      },
    }

    // Generate the video
    await generateVideo(frames, videoConfig)

    // Read the generated video
    const videoBuffer = fs.readFileSync(outputPath)

    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true })

    // Return the video as a response
    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${achievementType}-${achievementId}.mp4"`,
      },
    })
  } catch (error) {
    console.error("Error generating TikTok video:", error)
    return NextResponse.json({ success: false, error: "Failed to generate TikTok video" }, { status: 500 })
  }
}
