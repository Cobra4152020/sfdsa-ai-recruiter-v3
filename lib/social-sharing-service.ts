import { trackEngagement } from "@/lib/analytics"

export type SocialPlatform = "twitter" | "facebook" | "linkedin" | "whatsapp" | "email" | "copy" | "instagram"

export interface ShareOptions {
  title: string
  text: string
  url: string
  hashtags?: string[]
  via?: string
  image?: string
  achievementType?: string
  achievementId?: string
  userId?: string
  animated?: boolean // New option to toggle animation
}

export interface ShareResult {
  success: boolean
  platform: SocialPlatform
  error?: string
  imageUrl?: string
  isAnimated?: boolean
}

/**
 * Generates share URLs for different social platforms
 */
export const SocialSharingService = {
  /**
   * Share content on Twitter
   */
  getTwitterShareUrl(options: ShareOptions): string {
    const params = new URLSearchParams()
    params.append("text", `${options.title}\n\n${options.text}`)
    params.append("url", options.url)

    if (options.hashtags && options.hashtags.length > 0) {
      params.append("hashtags", options.hashtags.join(","))
    }

    if (options.via) {
      params.append("via", options.via)
    }

    return `https://twitter.com/intent/tweet?${params.toString()}`
  },

  /**
   * Share content on Facebook
   */
  getFacebookShareUrl(options: ShareOptions): string {
    const params = new URLSearchParams()
    params.append("u", options.url)
    params.append("quote", `${options.title} - ${options.text}`)

    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`
  },

  /**
   * Share content on LinkedIn
   */
  getLinkedInShareUrl(options: ShareOptions): string {
    const params = new URLSearchParams()
    params.append("url", options.url)
    params.append("title", options.title)
    params.append("summary", options.text)

    return `https://www.linkedin.com/shareArticle?mini=true&${params.toString()}`
  },

  /**
   * Share content on WhatsApp
   */
  getWhatsAppShareUrl(options: ShareOptions): string {
    const text = `${options.title}: ${options.text} ${options.url}`
    return `https://wa.me/?text=${encodeURIComponent(text)}`
  },

  /**
   * Share content via email
   */
  getEmailShareUrl(options: ShareOptions): string {
    const subject = encodeURIComponent(options.title)
    const body = encodeURIComponent(`${options.text}\n\n${options.url}`)
    return `mailto:?subject=${subject}&body=${body}`
  },

  /**
   * Generate Instagram story image and provide download
   */
  async getInstagramStoryImage(options: ShareOptions): Promise<ShareResult> {
    try {
      if (!options.userId || !options.achievementType || !options.achievementId) {
        console.error("Missing required parameters for Instagram story")
        return {
          success: false,
          platform: "instagram",
          error: "Missing required parameters",
        }
      }

      const animated = options.animated !== false // Default to true if not specified

      const response = await fetch("/api/social-share/instagram-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: options.userId,
          achievementType: options.achievementType,
          achievementId: options.achievementId,
          achievementTitle: options.title,
          achievementDescription: options.text,
          imageUrl: options.image,
          animated,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate Instagram story: ${response.statusText}`)
      }

      // Create a blob URL for the image
      const blob = await response.blob()
      return {
        success: true,
        platform: "instagram",
        imageUrl: URL.createObjectURL(blob),
        isAnimated: animated,
      }
    } catch (error) {
      console.error("Error generating Instagram story:", error)
      return {
        success: false,
        platform: "instagram",
        error: "Failed to generate Instagram story image",
      }
    }
  },

  /**
   * Share content using the Web Share API if available, otherwise open in a new window
   */
  async share(platform: SocialPlatform, options: ShareOptions): Promise<ShareResult> {
    try {
      // Track sharing analytics
      if (options.userId) {
        trackEngagement("achievement_share", {
          platform,
          achievementTitle: options.title,
          userId: options.userId,
          animated: options.animated,
        })

        // Also send to our API to track shares and award points
        fetch("/api/social-share", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: options.userId,
            platform,
            contentType: options.achievementType || "achievement",
            contentId: options.achievementId || "",
            contentTitle: options.title,
            url: options.url,
            animated: options.animated,
          }),
        }).catch((err) => console.error("Error tracking share:", err))
      }

      // Special handling for Instagram
      if (platform === "instagram") {
        return await this.getInstagramStoryImage(options)
      }

      // If Web Share API is available and not using "copy" platform
      if (navigator.share && platform !== "copy" && !["facebook", "twitter", "linkedin"].includes(platform)) {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url,
        })
        return { success: true, platform }
      }

      // Otherwise use platform-specific sharing
      let shareUrl = ""

      switch (platform) {
        case "twitter":
          shareUrl = this.getTwitterShareUrl(options)
          break
        case "facebook":
          shareUrl = this.getFacebookShareUrl(options)
          break
        case "linkedin":
          shareUrl = this.getLinkedInShareUrl(options)
          break
        case "whatsapp":
          shareUrl = this.getWhatsAppShareUrl(options)
          break
        case "email":
          shareUrl = this.getEmailShareUrl(options)
          break
        case "copy":
          await navigator.clipboard.writeText(`${options.title} - ${options.text} ${options.url}`)
          return { success: true, platform }
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank", "noopener,noreferrer")
        return { success: true, platform }
      }

      return {
        success: false,
        platform,
        error: "Sharing not supported for this platform",
      }
    } catch (error) {
      console.error("Error sharing:", error)
      return {
        success: false,
        platform,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  },
}
