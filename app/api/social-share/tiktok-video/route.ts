import { type NextRequest, NextResponse } from "next/server"
import { trackEngagement } from "@/lib/analytics"
import { supabaseAdmin } from "@/lib/supabase-admin"
import path from "path"
import { generateBadgeTikTokFrames, generateNFTTikTokFrames, generateVideo } from "@/lib/video-utils"
import os from "os"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"

// Dynamically import canvas only at runtime
const canvas: any = null
let registerFont: any = null
let loadImage: any = null
let createCanvas: any = null

// Only import canvas in a server context
if (typeof window === "undefined") {
  try {
    const canvasModule = require("canvas")
    createCanvas = canvasModule.createCanvas
    loadImage = canvasModule.loadImage
    registerFont = canvasModule.registerFont

    // Register fonts for canvas
    try {
      // Register fonts - adjust paths as needed for your project
      registerFont(path.join(process.cwd(), "public", "fonts", "Inter-Bold.ttf"), { family: "Inter", weight: "bold" })
      registerFont(path.join(process.cwd(), "public", "fonts", "Inter-Medium.ttf"), {
        family: "Inter",
        weight: "medium",
      })
      registerFont(path.join(process.cwd(), "public", "fonts", "Inter-Regular.ttf"), {
        family: "Inter",
        weight: "normal",
      })
    } catch (fontError) {
      console.error("Error registering fonts:", fontError)
    }
  } catch (error) {
    console.error("Canvas module not available:", error)
    // Provide fallback or mock implementations if needed
    createCanvas = () => ({
      getContext: () => ({
        createLinearGradient: () => ({ addColorStop: () => {} }),
        fillRect: () => {},
        drawImage: () => {},
        fillText: () => {},
        measureText: () => ({ width: 0 }),
        fillStyle: "",
        font: "",
        textAlign: "",
        globalAlpha: 1,
      }),
      toBuffer: () => Buffer.from([]),
    })
    loadImage = async () => ({})
    registerFont = () => {}
  }
}

export const dynamic = "force-dynamic"

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

    // Check if canvas is available
    if (!createCanvas || !loadImage) {
      return NextResponse.json(
        {
          success: false,
          error: "Video generation is not available in this environment",
          message: "Your share has been recorded, but video generation is not available.",
        },
        { status: 200 },
      )
    }

    // Create temp directory for processing
    const tempDir = path.join(os.tmpdir(), `tiktok-${uuidv4()}`)
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Output video path
    const outputFileName = `${achievementType}-${achievementId}-${uuidv4()}.mp4`
    const outputPath = path.join(tempDir, outputFileName)

    // Logo path (assuming we have a logo in public directory)
    const logoPath = path.join(process.cwd(), "public", "sfdsa-logo.png")

    // Image path (we need to download the image if it's a URL)
    let imagePath = imageUrl
    if (imageUrl.startsWith("http")) {
      const imageResponse = await fetch(imageUrl)
      const imageBuffer = await imageResponse.arrayBuffer()
      imagePath = path.join(tempDir, `image-${uuidv4()}.png`)
      fs.writeFileSync(imagePath, Buffer.from(imageBuffer))
    }

    // Generate frames based on achievement type
    const frames =
      achievementType === "badge"
        ? generateBadgeTikTokFrames(achievementTitle, achievementDescription || "", imagePath, logoPath)
        : generateNFTTikTokFrames(achievementTitle, achievementDescription || "", imagePath, logoPath)

    // Generate video
    await generateVideo(frames, {
      width: 1080,
      height: 1920, // TikTok vertical format (9:16)
      fps: 30,
      duration: 3, // 3 seconds video
      outputPath,
      tempDir,
      watermark: {
        text: "SF Sheriff's Department",
        position: "bottom-right",
        fontSize: 24,
        color: "rgba(255, 255, 255, 0.7)",
        padding: 20,
      },
    })

    // Read the generated video
    const videoBuffer = fs.readFileSync(outputPath)

    // Clean up temp files
    fs.rmSync(tempDir, { recursive: true, force: true })

    // Return the video as a response
    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${outputFileName}"`,
      },
    })
  } catch (error) {
    console.error("Error generating TikTok video:", error)
    return NextResponse.json({ error: "Failed to generate TikTok video" }, { status: 500 })
  }
}
