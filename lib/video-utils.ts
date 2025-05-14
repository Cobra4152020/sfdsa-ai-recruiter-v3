import { Canvas, loadImage } from "canvas"
import fs from "fs"
import path from "path"
import { spawn } from "child_process"
import { v4 as uuidv4 } from "uuid"
import os from "os"

export interface VideoFrame {
  background?: {
    color?: string
    gradient?: {
      stops: Array<{
        position: number
        color: string
      }>
    }
  }
  images?: Array<{
    path: string
    x?: number
    y?: number
    width?: number
    height?: number
    opacity?: number
    centered?: boolean
    scale?: number
    rotation?: number
  }>
  texts?: Array<{
    text: string
    x?: number
    y: number
    fontSize?: number
    fontFamily?: string
    fontWeight?: string
    color?: string
    align?: CanvasTextAlign
    opacity?: number
    maxWidth?: number
    lineHeight?: number
    shadow?: {
      color?: string
      blur?: number
      offsetX?: number
      offsetY?: number
    }
  }>
  effects?: {
    shine?: {
      x: number
      y: number
      width: number
      height: number
      opacity?: number
    }
    particles?: {
      color?: string
      items: Array<{
        x: number
        y: number
        size: number
      }>
    }
  }
}

export interface VideoConfig {
  width: number
  height: number
  fps: number
  duration: number
  outputPath: string
  tempDir?: string
  ffmpegPath?: string
  watermark?: {
    text: string
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
    fontSize?: number
    color?: string
    padding?: number
  }
  audio?: {
    path: string
    volume?: number
    fadeIn?: number
    fadeOut?: number
  }
}

/**
 * Generates a video from a sequence of frames
 */
export async function generateVideo(frames: VideoFrame[], config: VideoConfig): Promise<string> {
  const { width, height, fps, duration, outputPath } = config
  const tempDir = config.tempDir || path.join(os.tmpdir(), `tiktok-${uuidv4()}`)

  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  // Calculate total frames based on duration and fps
  const totalFrames = Math.ceil(duration * fps)

  // Create canvas
  const canvas = new Canvas(width, height)
  const ctx = canvas.getContext("2d")

  console.log(`Generating ${totalFrames} frames...`)

  // Generate frames
  for (let i = 0; i < totalFrames; i++) {
    // Calculate progress (0 to 1)
    const progress = i / totalFrames

    // Find the appropriate frame from our animation frames
    // This maps our animation frames to the video timeline
    const frameIndex = Math.min(Math.floor(progress * frames.length), frames.length - 1)

    // Draw the frame
    await drawVideoFrame(ctx, frames[frameIndex], width, height)

    // Add watermark if specified
    if (config.watermark) {
      addWatermark(ctx, width, height, config.watermark)
    }

    // Save frame as PNG
    const frameFilePath = path.join(tempDir, `frame-${i.toString().padStart(6, "0")}.png`)
    const buffer = canvas.toBuffer("image/png")
    fs.writeFileSync(frameFilePath, buffer)
  }

  console.log("Frames generated, creating video...")

  // Use FFmpeg to create video from frames
  await createVideoFromFrames(tempDir, outputPath, fps, config)

  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true })

  return outputPath
}

/**
 * Draws a single video frame
 */
async function drawVideoFrame(
  ctx: CanvasRenderingContext2D,
  frame: VideoFrame,
  width: number,
  height: number,
): Promise<void> {
  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Draw background
  if (frame.background) {
    if (typeof frame.background === "string") {
      // Solid color
      ctx.fillStyle = frame.background
      ctx.fillRect(0, 0, width, height)
    } else if (frame.background.gradient) {
      // Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      frame.background.gradient.stops.forEach((stop) => {
        gradient.addColorStop(stop.position, stop.color)
      })
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }
  }

  // Draw images
  if (frame.images) {
    for (const imageConfig of frame.images) {
      try {
        const image = await loadImage(imageConfig.path)

        // Calculate position
        let x = imageConfig.x || 0
        let y = imageConfig.y || 0

        // Handle center positioning
        if (imageConfig.centered) {
          x = width / 2 - (imageConfig.width || image.width) / 2
          y = imageConfig.y || 0
        }

        // Calculate scale if provided
        const scaledWidth = imageConfig.width || image.width
        const scaledHeight = imageConfig.height || image.height

        // Apply opacity
        if (imageConfig.opacity !== undefined) {
          ctx.globalAlpha = imageConfig.opacity
        }

        // Apply rotation if specified
        if (imageConfig.rotation) {
          ctx.save()
          // Rotate around the center of the image
          ctx.translate(x + scaledWidth / 2, y + scaledHeight / 2)
          ctx.rotate((imageConfig.rotation * Math.PI) / 180)
          ctx.drawImage(image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight)
          ctx.restore()
        } else {
          // Draw the image
          ctx.drawImage(image, x, y, scaledWidth, scaledHeight)
        }

        // Reset opacity
        ctx.globalAlpha = 1
      } catch (error) {
        console.error(`Error loading image ${imageConfig.path}:`, error)
      }
    }
  }

  // Draw texts
  if (frame.texts) {
    for (const textConfig of frame.texts) {
      drawText(ctx, textConfig, width)
    }
  }

  // Special effects
  if (frame.effects) {
    // Shine effect
    if (frame.effects.shine) {
      const shine = frame.effects.shine
      const gradient = ctx.createLinearGradient(shine.x, shine.y, shine.x + shine.width, shine.y + shine.height)

      gradient.addColorStop(0, "rgba(255, 255, 255, 0)")
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${shine.opacity || 0.7})`)
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.save()
      ctx.globalCompositeOperation = "lighter"
      ctx.fillStyle = gradient
      ctx.fillRect(shine.x, shine.y, shine.width, shine.height)
      ctx.restore()
    }

    // Particles
    if (frame.effects.particles) {
      const particles = frame.effects.particles
      ctx.fillStyle = particles.color || "#FFD700"

      for (const particle of particles.items) {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}

/**
 * Draws text with specified configuration
 */
function drawText(ctx: CanvasRenderingContext2D, textConfig: VideoFrame["texts"][0], canvasWidth: number): void {
  ctx.save()

  // Set text properties
  ctx.font = `${textConfig.fontWeight || "normal"} ${textConfig.fontSize || 30}px ${textConfig.fontFamily || "Arial"}`
  ctx.fillStyle = textConfig.color || "white"
  ctx.textAlign = textConfig.align || "center"

  // Apply opacity
  if (textConfig.opacity !== undefined) {
    ctx.globalAlpha = textConfig.opacity
  }

  // Apply shadow if specified
  if (textConfig.shadow) {
    ctx.shadowColor = textConfig.shadow.color || "rgba(0, 0, 0, 0.5)"
    ctx.shadowBlur = textConfig.shadow.blur || 5
    ctx.shadowOffsetX = textConfig.shadow.offsetX || 2
    ctx.shadowOffsetY = textConfig.shadow.offsetY || 2
  }

  // Position text
  const x = textConfig.x || canvasWidth / 2
  const y = textConfig.y || 0

  // Handle text wrapping
  if (textConfig.maxWidth && textConfig.text) {
    const words = textConfig.text.split(" ")
    let line = ""
    const lines = []

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " "
      const metrics = ctx.measureText(testLine)

      if (metrics.width > textConfig.maxWidth && i > 0) {
        lines.push(line)
        line = words[i] + " "
      } else {
        line = testLine
      }
    }

    lines.push(line)

    // Draw each line
    const lineHeight = textConfig.lineHeight || textConfig.fontSize * 1.2 || 36

    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), x, y + index * lineHeight)
    })
  } else if (textConfig.text) {
    // Draw single line text
    ctx.fillText(textConfig.text, x, y)
  }

  ctx.restore()
}

/**
 * Adds a watermark to the video frame
 */
function addWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  watermark: VideoConfig["watermark"],
): void {
  if (!watermark) return

  const fontSize = watermark.fontSize || 24
  const padding = watermark.padding || 20
  const color = watermark.color || "rgba(255, 255, 255, 0.7)"

  ctx.save()
  ctx.font = `${fontSize}px Arial`
  ctx.fillStyle = color

  const textWidth = ctx.measureText(watermark.text).width

  let x = padding
  let y = padding + fontSize

  switch (watermark.position) {
    case "top-right":
      x = width - textWidth - padding
      y = padding + fontSize
      break
    case "bottom-left":
      x = padding
      y = height - padding
      break
    case "bottom-right":
      x = width - textWidth - padding
      y = height - padding
      break
  }

  ctx.fillText(watermark.text, x, y)
  ctx.restore()
}

/**
 * Uses FFmpeg to create a video from frames
 */
async function createVideoFromFrames(
  framesDir: string,
  outputPath: string,
  fps: number,
  config: VideoConfig,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpegPath = config.ffmpegPath || "ffmpeg"
    const framePattern = path.join(framesDir, "frame-%06d.png")

    const args = [
      "-y", // Overwrite output file if it exists
      "-framerate",
      fps.toString(),
      "-i",
      framePattern,
    ]

    // Add audio if specified
    if (config.audio?.path) {
      args.push("-i", config.audio.path)

      // Set volume if specified
      if (config.audio.volume !== undefined) {
        args.push("-filter_complex", `[1:a]volume=${config.audio.volume}[a]`, "-map", "0:v", "-map", "[a]")
      }

      // Add fade in/out if specified
      if (config.audio.fadeIn || config.audio.fadeOut) {
        const fadeFilters = []
        if (config.audio.fadeIn) {
          fadeFilters.push(`afade=t=in:st=0:d=${config.audio.fadeIn}`)
        }
        if (config.audio.fadeOut) {
          const fadeOutStart = config.duration - (config.audio.fadeOut || 0)
          fadeFilters.push(`afade=t=out:st=${fadeOutStart}:d=${config.audio.fadeOut}`)
        }

        if (fadeFilters.length > 0) {
          args.push("-af", fadeFilters.join(","))
        }
      }
    }

    // Add output options
    args.push(
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-crf",
      "23", // Quality (lower is better)
      "-preset",
      "medium", // Encoding speed/quality tradeoff
      outputPath,
    )

    console.log(`Running FFmpeg command: ${ffmpegPath} ${args.join(" ")}`)

    const ffmpeg = spawn(ffmpegPath, args)

    ffmpeg.stdout.on("data", (data) => {
      console.log(`FFmpeg stdout: ${data}`)
    })

    ffmpeg.stderr.on("data", (data) => {
      console.log(`FFmpeg stderr: ${data}`)
    })

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log(`Video created successfully: ${outputPath}`)
        resolve()
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`))
      }
    })

    ffmpeg.on("error", (err) => {
      reject(err)
    })
  })
}

/**
 * Generates animation frames for a TikTok badge achievement video
 */
export function generateBadgeTikTokFrames(
  badgeName: string,
  badgeDescription: string,
  badgeImagePath: string,
  logoPath: string,
  totalFrames = 90, // 3 seconds at 30fps
): VideoFrame[] {
  const frames: VideoFrame[] = []

  // Create animation sequence
  for (let i = 0; i < totalFrames; i++) {
    const progress = i / (totalFrames - 1)

    // Background transitions
    const background = {
      gradient: {
        stops: [
          { position: 0, color: "#0A3C1F" },
          { position: 1, color: `rgba(10, 60, 31, ${0.5 + progress * 0.3})` },
        ],
      },
    }

    // Logo animation (first 1 second)
    const logoOpacity = i < 15 ? i / 15 : i > 75 ? 1 - (i - 75) / 15 : 1

    // Badge animation (appears after logo, with bounce effect)
    let badgeScale = 0
    let badgeRotation = 0

    if (i < 15) {
      // Not visible yet
      badgeScale = 0
    } else if (i < 30) {
      // Grow with bounce
      const bounceProgress = (i - 15) / 15
      badgeScale = Math.min(1.2 * Math.sin((bounceProgress * Math.PI) / 2), 1)
      badgeRotation = 15 * (1 - bounceProgress)
    } else if (i < 45) {
      // Settle with slight bounce
      const bounceProgress = (i - 30) / 15
      badgeScale = 1 + 0.1 * Math.sin(bounceProgress * Math.PI)
      badgeRotation = 0
    } else {
      // Stable
      badgeScale = 1
    }

    // Text animations
    const titleOpacity = i < 30 ? 0 : i < 45 ? (i - 30) / 15 : 1
    const badgeNameOpacity = i < 45 ? 0 : i < 60 ? (i - 45) / 15 : 1
    const descriptionOpacity = i < 60 ? 0 : (i - 60) / 15

    // Shine effect that moves across the badge
    const shinePosition = i < 45 ? -400 : ((i - 45) / 30) * 1200 - 400

    // Particles that appear gradually
    const particlesVisible = i > 60

    frames.push({
      background,
      images: [
        {
          path: logoPath,
          centered: true,
          y: 100,
          width: 150,
          height: 150,
          opacity: logoOpacity,
        },
        {
          path: badgeImagePath,
          centered: true,
          y: 500,
          width: 400 * badgeScale,
          height: 400 * badgeScale,
          opacity: i < 15 ? 0 : 1,
          rotation: badgeRotation,
        },
      ],
      texts: [
        {
          text: "Achievement Unlocked!",
          fontSize: 60,
          fontWeight: "bold",
          y: 800,
          color: "#FFFFFF",
          opacity: titleOpacity,
          shadow: {
            color: "rgba(0, 0, 0, 0.5)",
            blur: 5,
          },
        },
        {
          text: badgeName,
          fontSize: 70,
          fontWeight: "bold",
          y: 900,
          color: "#FFD700",
          opacity: badgeNameOpacity,
          maxWidth: 900,
          lineHeight: 80,
          shadow: {
            color: "rgba(0, 0, 0, 0.7)",
            blur: 6,
          },
        },
        {
          text: badgeDescription,
          fontSize: 40,
          y: 1050,
          color: "#FFFFFF",
          opacity: descriptionOpacity,
          maxWidth: 880,
          lineHeight: 50,
        },
        {
          text: "Join me at SF Sheriff's Department!",
          fontSize: 40,
          fontWeight: "bold",
          y: 1720,
          color: "#FFFFFF",
          opacity: i > 70 ? (i - 70) / 20 : 0,
        },
        {
          text: "sfdeputysheriff.com",
          fontSize: 50,
          fontWeight: "bold",
          y: 1800,
          color: "#FFD700",
          opacity: i > 75 ? (i - 75) / 15 : 0,
          shadow: {
            color: "rgba(0, 0, 0, 0.8)",
            blur: 4,
          },
        },
      ],
      effects: {
        shine:
          i >= 45 && i <= 75
            ? {
                x: shinePosition,
                y: 350,
                width: 200,
                height: 400,
                opacity: 0.7,
              }
            : undefined,
        particles: particlesVisible
          ? {
              color: "rgba(255, 215, 0, 0.7)",
              items: Array.from({ length: 20 }, (_, j) => ({
                x: Math.random() * 1080,
                y: 400 + Math.random() * 800,
                size: 2 + Math.random() * 4,
              })),
            }
          : undefined,
      },
    })
  }

  return frames
}

/**
 * Generates animation frames for a TikTok NFT award video
 */
export function generateNFTTikTokFrames(
  nftName: string,
  nftDescription: string,
  nftImagePath: string,
  logoPath: string,
  totalFrames = 90, // 3 seconds at 30fps
): VideoFrame[] {
  const frames: VideoFrame[] = []

  // Create animation sequence
  for (let i = 0; i < totalFrames; i++) {
    const progress = i / (totalFrames - 1)

    // Background transitions
    const background = {
      gradient: {
        stops: [
          { position: 0, color: "#0A3C1F" },
          { position: 1, color: `rgba(10, 60, 31, ${0.5 + progress * 0.3})` },
        ],
      },
    }

    // Logo animation
    const logoOpacity = i < 15 ? i / 15 : i > 75 ? 1 - (i - 75) / 15 : 1

    // NFT animation (zoom and pulse effect)
    let nftScale = 0
    let nftOpacity = 0

    if (i < 15) {
      // Not visible yet
      nftScale = 0
      nftOpacity = 0
    } else if (i < 30) {
      // Zoom in
      const zoomProgress = (i - 15) / 15
      nftScale = zoomProgress
      nftOpacity = zoomProgress
    } else {
      // Pulsing effect
      nftScale = 1 + 0.05 * Math.sin((i - 30) * 0.1)
      nftOpacity = 1
    }

    // Text animations
    const titleOpacity = i < 30 ? 0 : i < 45 ? (i - 30) / 15 : 1
    const nftNameOpacity = i < 45 ? 0 : i < 60 ? (i - 45) / 15 : 1
    const descriptionOpacity = i < 60 ? 0 : (i - 60) / 15

    // Glow effect that pulses
    const glowIntensity = i > 30 ? 0.5 + 0.3 * Math.sin((i - 30) * 0.1) : 0

    frames.push({
      background,
      images: [
        {
          path: logoPath,
          centered: true,
          y: 100,
          width: 150,
          height: 150,
          opacity: logoOpacity,
        },
        {
          path: nftImagePath,
          centered: true,
          y: 500,
          width: 450 * nftScale,
          height: 450 * nftScale,
          opacity: nftOpacity,
        },
      ],
      texts: [
        {
          text: "NFT Award Earned!",
          fontSize: 60,
          fontWeight: "bold",
          y: 800,
          color: "#FFFFFF",
          opacity: titleOpacity,
          shadow: {
            color: "rgba(0, 0, 0, 0.5)",
            blur: 5,
          },
        },
        {
          text: nftName,
          fontSize: 70,
          fontWeight: "bold",
          y: 900,
          color: "#FFD700",
          opacity: nftNameOpacity,
          maxWidth: 900,
          lineHeight: 80,
          shadow: {
            color: "rgba(0, 0, 0, 0.7)",
            blur: 6,
          },
        },
        {
          text: nftDescription,
          fontSize: 40,
          y: 1050,
          color: "#FFFFFF",
          opacity: descriptionOpacity,
          maxWidth: 880,
          lineHeight: 50,
        },
        {
          text: "Join me at SF Sheriff's Department!",
          fontSize: 40,
          fontWeight: "bold",
          y: 1720,
          color: "#FFFFFF",
          opacity: i > 70 ? (i - 70) / 20 : 0,
        },
        {
          text: "sfdeputysheriff.com",
          fontSize: 50,
          fontWeight: "bold",
          y: 1800,
          color: "#FFD700",
          opacity: i > 75 ? (i - 75) / 15 : 0,
          shadow: {
            color: "rgba(0, 0, 0, 0.8)",
            blur: 4,
          },
        },
      ],
      effects: {
        shine:
          i >= 45 && i <= 75
            ? {
                x: 340 + 200 * Math.sin((i - 45) * 0.1),
                y: 350,
                width: 400,
                height: 300,
                opacity: 0.4,
              }
            : undefined,
        particles:
          i > 50
            ? {
                color: "rgba(255, 215, 0, 0.7)",
                items: Array.from({ length: 30 }, (_, j) => ({
                  x: Math.random() * 1080,
                  y: 400 + Math.random() * 800,
                  size: 1 + Math.random() * 5,
                })),
              }
            : undefined,
      },
    })
  }

  return frames
}
