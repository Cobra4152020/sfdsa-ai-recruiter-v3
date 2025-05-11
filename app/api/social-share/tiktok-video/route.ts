import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import os from "os"
import { v4 as uuidv4 } from "uuid"
import { generateVideo, generateBadgeTikTokFrames, generateNFTTikTokFrames } from "@/lib/video-utils"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, achievementType, achievementId, achievementTitle, achievementDescription, imageUrl } = data

    if (!userId || !achievementType || !achievementId || !achievementTitle) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
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
