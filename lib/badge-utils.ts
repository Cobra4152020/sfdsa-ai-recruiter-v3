import { supabase } from "./supabase-service"

export type BadgeType = "achievement" | "skill" | "participation" | "special"
export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

export interface Badge {
  id: string
  name: string
  description: string
  type: BadgeType
  rarity: BadgeRarity
  points: number
  requirements: string[]
  rewards: string[]
  imageUrl?: string
  createdAt: string
  updatedAt: string
  tierEnabled?: boolean
  maxTier?: number
  parentBadgeId?: string
  expirationDays?: number
  verificationRequired?: boolean
}

// Get badge by ID
export async function getBadgeById(id: string): Promise<Badge | null> {
  // Define all available badges
  const allBadges: Badge[] = [
    // Application badges
    {
      id: "written",
      name: "Written Test",
      description: "Completed written test preparation",
      type: "achievement",
      rarity: "common",
      points: 100,
      requirements: [
        "Complete written test study guide",
        "Pass practice test",
        "Review feedback"
      ],
      rewards: [
        "Access to advanced study materials",
        "Test-taking tips",
        "Practice test feedback"
      ],
      imageUrl: "/placeholder.svg?key=t6kke",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "oral",
      name: "Oral Board",
      description: "Prepared for oral board interviews",
      type: "achievement",
      rarity: "uncommon",
      points: 150,
      requirements: [
        "Complete interview preparation guide",
        "Practice common questions",
        "Review feedback"
      ],
      rewards: [
        "Mock interview access",
        "Interview tips",
        "Sample answers"
      ],
      imageUrl: "/placeholder.svg?key=409vx",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "physical",
      name: "Physical Test",
      description: "Completed physical test preparation",
      type: "achievement",
      rarity: "uncommon",
      points: 150,
      requirements: [
        "Complete fitness assessment",
        "Follow training program",
        "Pass practice test"
      ],
      rewards: [
        "Training program access",
        "Fitness tips",
        "Progress tracking"
      ],
      imageUrl: "/placeholder.svg?key=j0utq",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "polygraph",
      name: "Polygraph",
      description: "Learned about the polygraph process",
      type: "achievement",
      rarity: "rare",
      points: 200,
      requirements: [
        "Review polygraph guide",
        "Complete questionnaire",
        "Understand process"
      ],
      rewards: [
        "Detailed process guide",
        "Preparation tips",
        "Common questions"
      ],
      imageUrl: "/placeholder.svg?key=4jay9",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "psychological",
      name: "Psychological",
      description: "Prepared for psychological evaluation",
      type: "achievement",
      rarity: "rare",
      points: 200,
      requirements: [
        "Review evaluation guide",
        "Complete self-assessment",
        "Understand process"
      ],
      rewards: [
        "Process overview",
        "Preparation tips",
        "Self-assessment tools"
      ],
      imageUrl: "/placeholder.svg?key=237g2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "full-process",
      name: "Full Process",
      description: "Completed all preparation areas",
      type: "achievement",
      rarity: "legendary",
      points: 500,
      requirements: [
        "Complete all test preparations",
        "Pass all practice tests",
        "Submit application"
      ],
      rewards: [
        "Special recognition",
        "Full access to resources",
        "Application support"
      ],
      imageUrl: "/placeholder.svg?key=n3str",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // Participation badges
    {
      id: "chat-participation",
      name: "Chat Participation",
      description: "Engaged with Sgt. Ken",
      type: "participation",
      rarity: "common",
      points: 50,
      requirements: [
        "Start a conversation",
        "Ask questions",
        "Engage meaningfully"
      ],
      rewards: [
        "Chat access",
        "Quick responses",
        "Personalized help"
      ],
      imageUrl: "/placeholder.svg?key=ixk83",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "first-response",
      name: "First Response",
      description: "Received first response from Sgt. Ken",
      type: "participation",
      rarity: "common",
      points: 25,
      requirements: [
        "Ask first question",
        "Receive response",
        "Continue conversation"
      ],
      rewards: [
        "Initial guidance",
        "Resource access",
        "Next steps"
      ],
      imageUrl: "/placeholder.svg?key=9dx3e",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]

  // Find badge by ID
  const badge = allBadges.find((b) => b.id === id)
  return badge || null
}

// Award badge to user
export async function awardBadgeToUser(userId: string, badgeType: string) {
  try {
    const response = await fetch("/api/badges/award", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        badgeType,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to award badge")
    }

    return {
      success: true,
      badge: data.badge,
      isNew: data.isNew,
    }
  } catch (error) {
    console.error("Error awarding badge:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

// Add the missing assignBadgeToUser function
export async function assignBadgeToUser(userId: string, badgeId: string) {
  try {
    // Implementation would go here
    // This is a placeholder since we don't have the actual implementation
    console.log(`Assigning badge ${badgeId} to user ${userId}`)
    return { success: true }
  } catch (error) {
    console.error("Error assigning badge to user:", error)
    return { success: false, error }
  }
}

// Get all available badge IDs
export async function getAllBadgeIds(): Promise<string[]> {
  const allBadges = await Promise.resolve([
    "written",
    "oral",
    "physical",
    "polygraph",
    "psychological",
    "full-process",
    "chat-participation",
    "first-response"
  ])
  return allBadges
}
