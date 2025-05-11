import { createCanvas, loadImage } from "canvas"
import GIFEncoder from "gif-encoder-2"

// Instagram story dimensions
const STORY_WIDTH = 1080
const STORY_HEIGHT = 1920

/**
 * Generates a static badge image
 */
export async function generateBadgeImage(
  title: string,
  description: string,
  imagePath: string,
  logoPath: string,
): Promise<Buffer> {
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

  // Load and draw the logo
  try {
    const logoImage = await loadImage(logoPath)
    const logoSize = 200
    ctx.drawImage(logoImage, STORY_WIDTH / 2 - logoSize / 2, 120, logoSize, logoSize)
  } catch (error) {
    console.error("Error loading logo:", error)
  }

  // Achievement image
  try {
    const achievementImage = await loadImage(imagePath)
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
  const words = title.split(" ")
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
  if (description) {
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "40px Inter"
    ctx.textAlign = "center"

    // Handle long descriptions by splitting into multiple lines
    const descWords = description.split(" ")
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
  return canvas.toBuffer("image/png")
}

/**
 * Generates an NFT image
 */
export async function generateNFTImage(
  title: string,
  description: string,
  imagePath: string,
  logoPath: string,
): Promise<Buffer> {
  // Similar to badge image but with different styling
  // Implementation would be similar to generateBadgeImage
  return generateBadgeImage(title, description, imagePath, logoPath) // Placeholder
}

/**
 * Generates an animated GIF
 */
export async function generateAnimatedGif(
  title: string,
  description: string,
  imagePath: string,
  logoPath: string,
  type = "badge",
): Promise<Buffer> {
  const canvas = createCanvas(STORY_WIDTH, STORY_HEIGHT)
  const ctx = canvas.getContext("2d")

  // Create GIF encoder
  const encoder = new GIFEncoder(STORY_WIDTH, STORY_HEIGHT, "neuquant", true)
  encoder.setDelay(100) // 100ms between frames
  encoder.setRepeat(0) // 0 = loop forever
  encoder.setQuality(10) // Lower = better quality but larger file
  encoder.start()

  // Generate frames
  const totalFrames = 30

  for (let i = 0; i < totalFrames; i++) {
    const progress = i / (totalFrames - 1)

    // Clear canvas
    ctx.clearRect(0, 0, STORY_WIDTH, STORY_HEIGHT)

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, STORY_HEIGHT)
    gradient.addColorStop(0, "#0A3C1F")
    gradient.addColorStop(1, `rgba(10, 60, 31, ${0.5 + progress * 0.3})`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT)

    // Add overlay pattern
    ctx.globalAlpha = 0.05 + progress * 0.05
    for (let x = 0; x < STORY_WIDTH; x += 40) {
      for (let y = 0; y < STORY_HEIGHT; y += 40) {
        ctx.fillStyle = "white"
        ctx.fillRect(x, y, 20, 20)
      }
    }
    ctx.globalAlpha = 1

    // Logo animation
    const logoOpacity = i < 5 ? i / 5 : 1
    try {
      const logoImage = await loadImage(logoPath)
      ctx.globalAlpha = logoOpacity
      ctx.drawImage(logoImage, STORY_WIDTH / 2 - 100, 120, 200, 200)
      ctx.globalAlpha = 1
    } catch (error) {
      console.error("Error loading logo:", error)
    }

    // Badge/NFT animation
    const imageScale = i < 15 ? 0.7 + (i / 15) * 0.3 : 1
    const imageWidth = 400 * imageScale
    const imageHeight = 400 * imageScale
    const imageOpacity = i < 10 ? i / 10 : 1

    try {
      const achievementImage = await loadImage(imagePath)
      ctx.globalAlpha = imageOpacity
      ctx.save()

      // Add rotation for badge
      if (type === "badge" && i < 8) {
        ctx.translate(STORY_WIDTH / 2, 560)
        ctx.rotate(((8 - i) * 5 * Math.PI) / 180)
        ctx.drawImage(achievementImage, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight)
      } else {
        ctx.drawImage(
          achievementImage,
          STORY_WIDTH / 2 - imageWidth / 2,
          560 - imageHeight / 2,
          imageWidth,
          imageHeight,
        )
      }

      ctx.restore()
      ctx.globalAlpha = 1
    } catch (error) {
      console.error("Error loading achievement image:", error)
    }

    // Text animations
    const titleOpacity = i < 15 ? 0 : (i - 15) / 8
    const nameOpacity = i < 20 ? 0 : (i - 20) / 6
    const descriptionOpacity = i < 25 ? 0 : (i - 25) / 5

    // Title
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 60px Inter"
    ctx.textAlign = "center"
    ctx.globalAlpha = titleOpacity
    ctx.fillText("Achievement Unlocked!", STORY_WIDTH / 2, 850)
    ctx.globalAlpha = 1

    // Achievement name
    ctx.fillStyle = "#FFD700"
    ctx.font = "bold 80px Inter"
    ctx.textAlign = "center"
    ctx.globalAlpha = nameOpacity

    // Handle long titles
    const words = title.split(" ")
    let line = ""
    const lines = []

    for (let j = 0; j < words.length; j++) {
      const testLine = line + words[j] + " "
      const metrics = ctx.measureText(testLine)
      if (metrics.width > 900 && j > 0) {
        lines.push(line)
        line = words[j] + " "
      } else {
        line = testLine
      }
    }
    lines.push(line)

    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), STORY_WIDTH / 2, 950 + index * 90)
    })
    ctx.globalAlpha = 1

    // Description
    if (description) {
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "40px Inter"
      ctx.textAlign = "center"
      ctx.globalAlpha = descriptionOpacity

      const descWords = description.split(" ")
      let descLine = ""
      const descLines = []

      for (let j = 0; j < descWords.length; j++) {
        const testLine = descLine + descWords[j] + " "
        const metrics = ctx.measureText(testLine)
        if (metrics.width > 880 && j > 0) {
          descLines.push(descLine)
          descLine = descWords[j] + " "
        } else {
          descLine = testLine
        }
      }
      descLines.push(descLine)

      descLines.slice(0, 3).forEach((line, index) => {
        ctx.fillText(line.trim(), STORY_WIDTH / 2, 1100 + index * 50)
      })
      ctx.globalAlpha = 1
    }

    // Call to action
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 40px Inter"
    ctx.textAlign = "center"
    ctx.globalAlpha = i > 25 ? 1 : 0
    ctx.fillText("Join me at SF Sheriff's Department!", STORY_WIDTH / 2, 1720)
    ctx.globalAlpha = 1

    // Website URL
    ctx.fillStyle = "#FFD700"
    ctx.font = "bold 50px Inter"
    ctx.textAlign = "center"
    ctx.globalAlpha = i > 27 ? 1 : 0
    ctx.fillText("sfdeputysheriff.com", STORY_WIDTH / 2, 1800)
    ctx.globalAlpha = 1

    // Shine effect
    if (i >= 15 && i <= 25) {
      const shinePosition = ((i - 15) / 15) * 800
      const gradient = ctx.createLinearGradient(shinePosition, 400, shinePosition + 200, 800)
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)")
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.7)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.save()
      ctx.globalCompositeOperation = "lighter"
      ctx.fillStyle = gradient
      ctx.fillRect(shinePosition, 400, 200, 400)
      ctx.restore()
    }

    // Add the frame to the GIF
    encoder.addFrame(ctx)
  }

  encoder.finish()
  return encoder.out.getData()
}
