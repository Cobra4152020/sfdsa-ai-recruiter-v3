/**
 * Client for the dedicated image generation service
 */
export class ImageGenerationClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.IMAGE_GENERATION_SERVICE_URL || "http://localhost:3001"
    this.apiKey = process.env.IMAGE_GENERATION_SERVICE_API_KEY || ""

    if (!this.apiKey) {
      console.warn("IMAGE_GENERATION_SERVICE_API_KEY is not set. Image generation service calls will fail.")
    }
  }

  /**
   * Generates an Instagram story image
   */
  async generateInstagramStory(params: {
    achievementType: string
    achievementId: string
    achievementTitle: string
    achievementDescription?: string
    imageUrl?: string
    animated?: boolean
  }): Promise<Response> {
    const response = await fetch(`${this.baseUrl}/generate/instagram-story`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to generate Instagram story: ${errorData.error || response.statusText}`)
    }

    return response
  }

  /**
   * Generates a TikTok video
   */
  async generateTikTokVideo(params: {
    achievementType: string
    achievementId: string
    achievementTitle: string
    achievementDescription?: string
    imageUrl?: string
  }): Promise<Response> {
    const response = await fetch(`${this.baseUrl}/generate/tiktok-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to generate TikTok video: ${errorData.error || response.statusText}`)
    }

    return response
  }

  /**
   * Checks if the service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: {
          "X-API-Key": this.apiKey,
        },
      })
      return response.ok
    } catch (error) {
      console.error("Error checking image generation service availability:", error)
      return false
    }
  }
}

// Create a singleton instance
export const imageGenerationClient = new ImageGenerationClient()
