import express from "express"
import cors from "cors"
import { registerFont } from "canvas"
import path from "path"
import fs from "fs"
import { generateBadgeImage, generateAnimatedGif } from "./image-generator"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Register fonts
try {
  registerFont(path.join(__dirname, "fonts", "Inter-Bold.ttf"), { family: "Inter", weight: "bold" })
  registerFont(path.join(__dirname, "fonts", "Inter-Medium.ttf"), { family: "Inter", weight: "medium" })
  registerFont(path.join(__dirname, "fonts", "Inter-Regular.ttf"), { family: "Inter", weight: "normal" })
} catch (error) {
  console.error("Error registering fonts:", error)
}

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*",
    methods: ["POST", "GET"],
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))

// Authentication middleware
const authenticateRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers["x-api-key"]

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  next()
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Instagram story image generation endpoint
app.post("/generate/instagram-story", authenticateRequest, async (req, res) => {
  try {
    const {
      achievementType,
      achievementId,
      achievementTitle,
      achievementDescription,
      imageUrl,
      animated = true,
    } = req.body

    if (!achievementType || !achievementTitle) {
      return res.status(400).json({ error: "Missing required parameters" })
    }

    // Determine image paths
    const logoPath = path.join(__dirname, "assets", "sfdsa-logo.png")

    // Handle image URL
    let achievementImagePath
    if (imageUrl) {
      if (imageUrl.startsWith("http")) {
        // Download the image
        const response = await fetch(imageUrl)
        const imageBuffer = await response.arrayBuffer()
        const tempPath = path.join(__dirname, "temp", `${achievementId || Date.now()}.png`)

        // Ensure temp directory exists
        if (!fs.existsSync(path.join(__dirname, "temp"))) {
          fs.mkdirSync(path.join(__dirname, "temp"), { recursive: true })
        }

        fs.writeFileSync(tempPath, Buffer.from(imageBuffer))
        achievementImagePath = tempPath
      } else {
        // Local path
        achievementImagePath = path.join(__dirname, "assets", imageUrl)
      }
    } else {
      // Default image based on achievement type
      if (achievementType === "badge") {
        achievementImagePath = path.join(__dirname, "assets", "generic-badge.png")
      } else if (achievementType === "nft") {
        achievementImagePath = path.join(__dirname, "assets", "achievement-icon.png")
      } else {
        achievementImagePath = path.join(__dirname, "assets", "sfdsa-logo.png")
      }
    }

    let buffer
    if (animated) {
      // Generate animated GIF
      buffer = await generateAnimatedGif(
        achievementTitle,
        achievementDescription || "",
        achievementImagePath,
        logoPath,
        achievementType,
      )

      res.setHeader("Content-Type", "image/gif")
      res.setHeader("Content-Disposition", `attachment; filename="${achievementType}-${achievementId}-animated.gif"`)
    } else {
      // Generate static image
      buffer = await generateBadgeImage(achievementTitle, achievementDescription || "", achievementImagePath, logoPath)

      res.setHeader("Content-Type", "image/png")
      res.setHeader("Content-Disposition", `attachment; filename="${achievementType}-${achievementId}.png"`)
    }

    // Clean up temp files
    if (imageUrl && imageUrl.startsWith("http") && achievementImagePath.includes("temp")) {
      try {
        fs.unlinkSync(achievementImagePath)
      } catch (e) {
        console.error("Error cleaning up temp file:", e)
      }
    }

    res.send(buffer)
  } catch (error) {
    console.error("Error generating Instagram story:", error)
    res.status(500).json({ error: "Failed to generate image" })
  }
})

// TikTok video generation endpoint
app.post("/generate/tiktok-video", authenticateRequest, async (req, res) => {
  // Similar implementation for TikTok videos
  // This would use FFmpeg to generate videos
  res.status(501).json({ error: "TikTok video generation not implemented yet" })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Image generation service running on port ${PORT}`)
})
