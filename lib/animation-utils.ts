import { Canvas, type CanvasRenderingContext2D, loadImage } from "canvas";
import GIFEncoder from "gif-encoder-2";
import type {
  AnimationFrame,
  AnimationConfig,
  TextAnimationConfig,
} from "@/types/animation";

/**
 * Creates a GIF animation with the specified frames and configuration
 */
export async function createAnimatedGif(
  width: number,
  height: number,
  frames: AnimationFrame[],
  config: AnimationConfig,
): Promise<Buffer> {
  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext("2d");

  // Create GIF encoder
  const encoder = new GIFEncoder(width, height, "neuquant", true);
  encoder.setDelay(config.frameDelay || 100); // Default 100ms between frames
  encoder.setRepeat(0); // 0 = loop forever
  encoder.setQuality(config.quality || 10); // Lower = better quality but larger file
  encoder.start();

  // Draw each frame
  for (const frame of frames) {
    // Clear canvas for this frame
    ctx.clearRect(0, 0, width, height);

    // Draw the frame
    await drawAnimationFrame(ctx, frame, width, height);

    // Add the frame to the GIF
    encoder.addFrame(ctx);
  }

  encoder.finish();
  return encoder.out.getData();
}

/**
 * Draws a single animation frame
 */
async function drawAnimationFrame(
  ctx: CanvasRenderingContext2D,
  frame: AnimationFrame,
  width: number,
  height: number,
): Promise<void> {
  // Draw background
  if (frame.background) {
    if (typeof frame.background === "string") {
      // Solid color
      ctx.fillStyle = frame.background;
      ctx.fillRect(0, 0, width, height);
    } else if (frame.background.gradient) {
      // Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      frame.background.gradient.stops.forEach((stop) => {
        gradient.addColorStop(stop.position, stop.color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  }

  // Draw pattern overlay
  if (frame.patternOverlay) {
    ctx.globalAlpha = frame.patternOverlay.opacity || 0.1;
    for (let i = 0; i < width; i += 40) {
      for (let j = 0; j < height; j += 40) {
        ctx.fillStyle = frame.patternOverlay.color || "white";
        ctx.fillRect(i, j, 20, 20);
      }
    }
    ctx.globalAlpha = 1;
  }

  // Draw images
  if (frame.images) {
    for (const imageConfig of frame.images) {
      try {
        const image = await loadImage(imageConfig.path);

        // Calculate position
        let x = imageConfig.x || 0;
        let y = imageConfig.y || 0;

        // Handle center positioning
        if (imageConfig.centered) {
          x = width / 2 - (imageConfig.width || image.width) / 2;
          y = imageConfig.y || 0;
        }

        // Calculate scale if provided
        const scaledWidth = imageConfig.width || image.width;
        const scaledHeight = imageConfig.height || image.height;

        // Apply opacity
        if (imageConfig.opacity !== undefined) {
          ctx.globalAlpha = imageConfig.opacity;
        }

        // Apply rotation if specified
        if (imageConfig.rotation) {
          ctx.save();
          // Rotate around the center of the image
          ctx.translate(x + scaledWidth / 2, y + scaledHeight / 2);
          ctx.rotate((imageConfig.rotation * Math.PI) / 180);
          ctx.drawImage(
            image,
            -scaledWidth / 2,
            -scaledHeight / 2,
            scaledWidth,
            scaledHeight,
          );
          ctx.restore();
        } else {
          // Draw the image
          ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
        }

        // Reset opacity
        ctx.globalAlpha = 1;
      } catch (error) {
        console.error(`Error loading image ${imageConfig.path}:`, error);
      }
    }
  }

  // Draw texts
  if (frame.texts) {
    for (const textConfig of frame.texts) {
      drawAnimatedText(ctx, textConfig, width);
    }
  }

  // Draw shapes
  if (frame.shapes) {
    for (const shape of frame.shapes) {
      if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);

        if (shape.fill) {
          ctx.fillStyle = shape.fill;
          ctx.fill();
        }

        if (shape.stroke) {
          ctx.strokeStyle = shape.stroke.color;
          ctx.lineWidth = shape.stroke.width || 1;
          ctx.stroke();
        }
      } else if (shape.type === "rect") {
        if (shape.fill) {
          ctx.fillStyle = shape.fill;
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        }

        if (shape.stroke) {
          ctx.strokeStyle = shape.stroke.color;
          ctx.lineWidth = shape.stroke.width || 1;
          ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
      }
    }
  }

  // Special effects
  if (frame.effects) {
    // Shine effect
    if (frame.effects.shine) {
      const shine = frame.effects.shine;
      const gradient = ctx.createLinearGradient(
        shine.x,
        shine.y,
        shine.x + shine.width,
        shine.y + shine.height,
      );

      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(
        0.5,
        `rgba(255, 255, 255, ${shine.opacity || 0.7})`,
      );
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = gradient;
      ctx.fillRect(shine.x, shine.y, shine.width, shine.height);
      ctx.restore();
    }

    // Particles
    if (frame.effects.particles) {
      const particles = frame.effects.particles;
      ctx.fillStyle = particles.color || "#FFD700";

      for (const particle of particles.items) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

/**
 * Draws text with animation effects
 */
function drawAnimatedText(
  ctx: CanvasRenderingContext2D,
  textConfig: TextAnimationConfig,
  canvasWidth: number,
): void {
  ctx.save();

  // Set text properties
  ctx.font = `${textConfig.fontWeight || "normal"} ${textConfig.fontSize || 30}px ${textConfig.fontFamily || "Inter"}`;
  ctx.fillStyle = textConfig.color || "white";
  ctx.textAlign = textConfig.align || "center";

  // Apply opacity
  if (textConfig.opacity !== undefined) {
    ctx.globalAlpha = textConfig.opacity;
  }

  // Apply shadow if specified
  if (textConfig.shadow) {
    ctx.shadowColor = textConfig.shadow.color || "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = textConfig.shadow.blur || 5;
    ctx.shadowOffsetX = textConfig.shadow.offsetX || 2;
    ctx.shadowOffsetY = textConfig.shadow.offsetY || 2;
  }

  // Position text
  const x = textConfig.x || canvasWidth / 2;
  const y = textConfig.y || 0;

  // Handle text wrapping
  if (textConfig.maxWidth && textConfig.text) {
    const words = textConfig.text.split(" ");
    let line = "";
    const lines = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > textConfig.maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }

    lines.push(line);

    // Draw each line
    const lineHeight = textConfig.lineHeight || textConfig.fontSize * 1.2 || 36;

    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), x, y + index * lineHeight);
    });
  } else if (textConfig.text) {
    // Draw single line text
    ctx.fillText(textConfig.text, x, y);
  }

  ctx.restore();
}

/**
 * Generates animation frames for a badge achievement story
 */
export async function generateBadgeAnimationFrames(
  badgeName: string,
  badgeDescription: string,
  badgeImagePath: string,
  logoPath: string,
): Promise<AnimationFrame[]> {
  const frames: AnimationFrame[] = [];
  const totalFrames = 30;

  // Create animation sequence
  for (let i = 0; i < totalFrames; i++) {
    const progress = i / (totalFrames - 1);

    // Background appears immediately
    const background = {
      gradient: {
        stops: [
          { position: 0, color: "#0A3C1F" },
          {
            position: 1,
            color:
              progress < 0.5
                ? "#0A3C1F80"
                : `rgba(10, 60, 31, ${0.5 + progress * 0.3})`,
          },
        ],
      },
    };

    // Logo fades in first
    const logoOpacity = i < 5 ? i / 5 : 1;

    // Badge appears and grows
    const badgeScale = i < 15 ? 0.7 + (i / 15) * 0.3 : 1;
    const badgeWidth = 400 * badgeScale;
    const badgeHeight = 400 * badgeScale;
    const badgeOpacity = i < 10 ? i / 10 : 1;

    // Text animations
    const titleOpacity = i < 15 ? 0 : (i - 15) / 8;
    const badgeNameOpacity = i < 20 ? 0 : (i - 20) / 6;
    const descriptionOpacity = i < 25 ? 0 : (i - 25) / 5;

    // Shine effect that moves across the badge
    const shinePosition = i < 15 ? -400 : ((i - 15) / 15) * 800;

    frames.push({
      background,
      patternOverlay: {
        opacity: 0.05 + progress * 0.05,
        color: "white",
      },
      images: [
        {
          path: logoPath,
          centered: true,
          y: 120,
          width: 200,
          height: 200,
          opacity: logoOpacity,
        },
        {
          path: badgeImagePath,
          centered: true,
          y: 560,
          width: badgeWidth,
          height: badgeHeight,
          opacity: badgeOpacity,
          rotation: i < 8 ? (8 - i) * 5 : 0, // Initial slight rotation that settles
        },
      ],
      texts: [
        {
          text: "Achievement Unlocked!",
          fontSize: 60,
          fontWeight: "bold",
          y: 850,
          color: "#FFFFFF",
          opacity: titleOpacity,
          shadow: {
            color: "rgba(0, 0, 0, 0.5)",
            blur: 5,
          },
        },
        {
          text: badgeName,
          fontSize: 80,
          fontWeight: "bold",
          y: 950,
          color: "#FFD700",
          opacity: badgeNameOpacity,
          maxWidth: 900,
          lineHeight: 90,
          shadow: {
            color: "rgba(0, 0, 0, 0.7)",
            blur: 6,
          },
        },
        {
          text: badgeDescription,
          fontSize: 40,
          y: 1100,
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
          opacity: i > 25 ? 1 : 0,
        },
        {
          text: "sfdeputysheriff.com",
          fontSize: 50,
          fontWeight: "bold",
          y: 1800,
          color: "#FFD700",
          opacity: i > 27 ? 1 : 0,
          shadow: {
            color: "rgba(0, 0, 0, 0.8)",
            blur: 4,
          },
        },
      ],
      effects: {
        shine:
          i >= 15 && i <= 25
            ? {
                x: shinePosition,
                y: 400,
                width: 200,
                height: 400,
                opacity: 0.7,
              }
            : undefined,
        particles:
          i > 20
            ? {
                color: "rgba(255, 215, 0, 0.7)",
                items: Array.from({ length: 10 }, () => ({
                  x: Math.random() * 1080,
                  y: 900 + Math.random() * 200,
                  size: 2 + Math.random() * 3,
                })),
              }
            : undefined,
      },
    });
  }

  return frames;
}

/**
 * Generates animation frames for an NFT award story
 */
export async function generateNFTAnimationFrames(
  nftName: string,
  nftDescription: string,
  nftImagePath: string,
  logoPath: string,
): Promise<AnimationFrame[]> {
  const frames: AnimationFrame[] = [];
  const totalFrames = 30;

  // Create animation sequence
  for (let i = 0; i < totalFrames; i++) {
    const progress = i / (totalFrames - 1);

    // Background transitions from dark to slightly lighter
    const background = {
      gradient: {
        stops: [
          { position: 0, color: "#0A3C1F" },
          { position: 1, color: `rgba(10, 60, 31, ${0.5 + progress * 0.3})` },
        ],
      },
    };

    // Logo fades in first
    const logoOpacity = i < 5 ? i / 5 : 1;

    // NFT image appears with a zoom-in effect
    const nftScale = i < 12 ? 0.6 + (i / 12) * 0.4 : 1;
    const nftWidth = 450 * nftScale;
    const nftHeight = 450 * nftScale;
    const nftOpacity = i < 10 ? i / 10 : 1;

    // Text animations
    const titleOpacity = i < 14 ? 0 : (i - 14) / 8;
    const nftNameOpacity = i < 18 ? 0 : (i - 18) / 6;
    const descriptionOpacity = i < 22 ? 0 : (i - 22) / 5;

    // Create a glowing border effect that pulses
    const glowIntensity = i > 15 ? 0.5 + Math.sin(i * 0.5) * 0.3 : 0;

    frames.push({
      background,
      patternOverlay: {
        opacity: 0.05 + progress * 0.05,
        color: "white",
      },
      images: [
        {
          path: logoPath,
          centered: true,
          y: 120,
          width: 200,
          height: 200,
          opacity: logoOpacity,
        },
        {
          path: nftImagePath,
          centered: true,
          y: 560,
          width: nftWidth,
          height: nftHeight,
          opacity: nftOpacity,
        },
      ],
      texts: [
        {
          text: "NFT Award Earned!",
          fontSize: 60,
          fontWeight: "bold",
          y: 850,
          color: "#FFFFFF",
          opacity: titleOpacity,
          shadow: {
            color: "rgba(0, 0, 0, 0.5)",
            blur: 5,
          },
        },
        {
          text: nftName,
          fontSize: 80,
          fontWeight: "bold",
          y: 950,
          color: "#FFD700",
          opacity: nftNameOpacity,
          maxWidth: 900,
          lineHeight: 90,
          shadow: {
            color: "rgba(0, 0, 0, 0.7)",
            blur: 6,
          },
        },
        {
          text: nftDescription,
          fontSize: 40,
          y: 1100,
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
          opacity: i > 25 ? 1 : 0,
        },
        {
          text: "sfdeputysheriff.com",
          fontSize: 50,
          fontWeight: "bold",
          y: 1800,
          color: "#FFD700",
          opacity: i > 27 ? 1 : 0,
          shadow: {
            color: "rgba(0, 0, 0, 0.8)",
            blur: 4,
          },
        },
      ],
      shapes:
        i > 15
          ? [
              {
                type: "circle",
                x: 540,
                y: 560,
                radius: 230,
                stroke: {
                  color: `rgba(255, 215, 0, ${glowIntensity})`,
                  width: 8,
                },
              },
            ]
          : [],
      effects: {
        particles:
          i > 20
            ? {
                color: "rgba(255, 215, 0, 0.7)",
                items: Array.from({ length: 20 }, () => ({
                  x: Math.random() * 1080,
                  y: 400 + Math.random() * 600,
                  size: 1 + Math.random() * 4,
                })),
              }
            : undefined,
      },
    });
  }

  return frames;
}
