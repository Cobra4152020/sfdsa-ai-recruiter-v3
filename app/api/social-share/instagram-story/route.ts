import { type NextRequest, NextResponse } from "next/server"
import { createCanvas, loadImage, registerFont } from "canvas"
import { trackEngagement } from "@/lib/analytics"
import { supabaseAdmin } from "@/lib/supabase-admin"
import path from "path"

// Register fonts for canvas
try {
  // Check if we're in a Node.js environment (not client-side)
  if (typeof window === "undefined") {
    // Register fonts - adjust paths as needed for your project
    registerFont(path.join(process.cwd(), "public", "fonts", "Inter-Bold.ttf"), { family: "Inter", weight: "bold" })
    registerFont(path.join(process.cwd(), "public", "fonts", "Inter-Medium.ttf"), { family: "Inter", weight: "medium" })
    registerFont(path.join(process.cwd(), "public", "fonts", "Inter-Regular.ttf"), {
      family: "Inter",
      weight: "normal",
    })
  }
} catch (error) {
  console.error("Error registering fonts:", error)
}

// Instagram story dimensions
const STORY_WIDTH = 1080
const STORY_HEIGHT = 1920

export async function POST(request: NextRequest) {
  try {
    const { userId, achievementType, achievementId, achievementTitle, achievementDescription, imageUrl } =
      await request.json()

    if (!userId || !achievementType || !achievementTitle) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Track this sharing attempt
    trackEngagement("instagram_story_share_attempt", {
      userId,
      achievementType,
      achievementId,
      achievementTitle,
    })

    // Record the share in the database
    await supabaseAdmin.from("social_shares").insert({
      user_id: userId,
      platform: "instagram",
      content_type: achievementType,
      content_id: achievementId,
      content_title: achievementTitle,
      points_awarded: 25, // Award points for Instagram sharing
    })

    // Create canvas for Instagram story
    const canvas = createCanvas(STORY_WIDTH, STORY_HEIGHT)
    const ctx = canvas.getContext("2d")

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, STORY_HEIGHT)
    gradient.addColorStop(0, "#0A3C1F") // Dark green at top
    gradient.addColorStop(1, "#0A3C1F80") // Transparent green at bottom
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT)

    // Add overlay pattern for visual interest
    ctx.globalAlpha = 0.1
    for (let i = 0; i < STORY_WIDTH; i += 40) {
      for (let j = 0; j < STORY_HEIGHT; j += 40) {
        ctx.fillStyle = "white"
        ctx.fillRect(i, j, 20, 20)
      }
    }
    ctx.globalAlpha = 1

    // Load and draw the SF Sheriff logo
    try {
      const logoImage = await loadImage(`${process.cwd()}/public/sfdsa-logo.png`)
      const logoSize = 200
      ctx.drawImage(logoImage, STORY_WIDTH / 2 - logoSize / 2, 120, logoSize, logoSize)
    } catch (error) {
      console.error("Error loading logo:", error)
      // Continue without the logo if there's an error
    }

    // Achievement image
    try {
      let achievementImageUrl = imageUrl

      // If no image URL provided, use a default based on achievement type
      if (!achievementImageUrl) {
        if (achievementType === "badge") {
          achievementImageUrl = `${process.cwd()}/public/generic-badge.png`
        } else if (achievementType === "nft") {
          achievementImageUrl = `${process.cwd()}/public/achievement-icon.png`
        } else {
          achievementImageUrl = `${process.cwd()}/public/sfdsa-logo.png`
        }
      } else if (achievementImageUrl.startsWith("/")) {
        // Convert relative URL to absolute file path
        achievementImageUrl = `${process.cwd()}/public${achievementImageUrl}`
      }

      const achievementImage = await loadImage(achievementImageUrl)
      const imageSize = 400
      ctx.drawImage(
        achievementImage,
        STORY_WIDTH / 2 - imageSize / 2,
        STORY_HEIGHT / 2 - imageSize / 2 - 100,
        imageSize,
        imageSize,
      )
    } catch (error) {
      console.error("Error loading achievement image:", error)
      // Continue without the achievement image if there's an error
    }

    // Add achievement title
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 60px Inter"
    ctx.textAlign = "center"
    ctx.fillText("Achievement Unlocked!", STORY_WIDTH / 2, STORY_HEIGHT / 2 + 200)

    // Add achievement name
    ctx.fillStyle = "#FFD700" // Gold color
    ctx.font = "bold 80px Inter"
    ctx.textAlign = "center"

    // Handle long titles by splitting into multiple lines if needed
    const words = achievementTitle.split(" ")
    let line = ""
    const lines = []
    const y = STORY_HEIGHT / 2 + 300

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " "
      const metrics = ctx.measureText(testLine)
      if (metrics.width > STORY_WIDTH - 200 && i > 0) {
        lines.push(line)
        line = words[i] + " "
      } else {
        line = testLine
      }
    }
    lines.push(line)

    // Draw each line
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), STORY_WIDTH / 2, y + index * 90)
    })

    // Add description if provided
    if (achievementDescription) {
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "40px Inter"
      ctx.textAlign = "center"

      // Handle long descriptions by splitting into multiple lines
      const descWords = achievementDescription.split(" ")
      let descLine = ""
      const descLines = []
      const descY = y + lines.length * 90 + 80

      for (let i = 0; i < descWords.length; i++) {
        const testLine = descLine + descWords[i] + " "
        const metrics = ctx.measureText(testLine)
        if (metrics.width > STORY_WIDTH - 200 && i > 0) {
          descLines.push(descLine)
          descLine = descWords[i] + " "
        } else {
          descLine = testLine
        }
      }
      descLines.push(descLine)

      // Draw each line (limit to 3 lines to avoid overcrowding)
      descLines.slice(0, 3).forEach((line, index) => {
        ctx.fillText(line.trim(), STORY_WIDTH / 2, descY + index * 50)
      })

      // Add ellipsis if description was truncated
      if (descLines.length > 3) {
        ctx.fillText("...", STORY_WIDTH / 2, descY + 3 * 50)
      }
    }

    // Add call to action
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 40px Inter"
    ctx.textAlign = "center"
    ctx.fillText("Join me at SF Sheriff's Department!", STORY_WIDTH / 2, STORY_HEIGHT - 200)

    // Add website URL
    ctx.fillStyle = "#FFD700" // Gold color
    ctx.font = "bold 50px Inter"
    ctx.textAlign = "center"
    ctx.fillText("sfdeputysheriff.com", STORY_WIDTH / 2, STORY_HEIGHT - 120)

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/png")

    // Return the image as a response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${achievementType}-${achievementId}.png"`,
      },
    })
  } catch (error) {
    console.error("Error generating Instagram story:", error)
    return NextResponse.json({ success: false, error: "Failed to generate Instagram story image" }, { status: 500 })
  }
}
