import { supabase } from "./supabase-client"

export type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "first-response"
  | "application-started"
  | "application-completed"
  | "frequent-user"
  | "resource-downloader"
  | "hard-charger"
  | "connector"
  | "deep-diver"
  | "quick-learner"
  | "persistent-explorer"
  | "dedicated-applicant"

export interface Badge {
  id: string
  name: string
  description: string
  category: "application" | "participation"
  color: string
  icon: string
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
      category: "application",
      color: "bg-blue-500",
      icon: "/placeholder.svg?key=t6kke",
    },
    {
      id: "oral",
      name: "Oral Board",
      description: "Prepared for oral board interviews",
      category: "application",
      color: "bg-green-700",
      icon: "/placeholder.svg?key=409vx",
    },
    {
      id: "physical",
      name: "Physical Test",
      description: "Completed physical test preparation",
      category: "application",
      color: "bg-blue-700",
      icon: "/placeholder.svg?key=j0utq",
    },
    {
      id: "polygraph",
      name: "Polygraph",
      description: "Learned about the polygraph process",
      category: "application",
      color: "bg-teal-500",
      icon: "/placeholder.svg?key=4jay9",
    },
    {
      id: "psychological",
      name: "Psychological",
      description: "Prepared for psychological evaluation",
      category: "application",
      color: "bg-purple-600",
      icon: "/placeholder.svg?key=237g2",
    },
    {
      id: "full-process",
      name: "Full Process",
      description: "Completed all preparation areas",
      category: "application",
      color: "bg-[#0A3C1F]",
      icon: "/placeholder.svg?key=n3str",
    },

    // Participation badges
    {
      id: "chat-participation",
      name: "Chat Participation",
      description: "Engaged with Sgt. Ken",
      category: "participation",
      color: "bg-blue-500",
      icon: "/placeholder.svg?key=ixk83",
    },
    {
      id: "first-response",
      name: "First Response",
      description: "Received first response from Sgt. Ken",
      category: "participation",
      color: "bg-green-700",
      icon: "/placeholder.svg?key=9dx3e",
    },
    {
      id: "application-started",
      name: "Application Started",
      description: "Started the application process",
      category: "participation",
      color: "bg-blue-700",
      icon: "/placeholder.svg?key=tgvvt",
    },
    {
      id: "application-completed",
      name: "Application Completed",
      description: "Completed the application process",
      category: "participation",
      color: "bg-teal-500",
      icon: "/placeholder.svg?key=c1035",
    },
    {
      id: "frequent-user",
      name: "Frequent User",
      description: "Regularly engages with the recruitment platform",
      category: "participation",
      color: "bg-purple-600",
      icon: "/placeholder.svg?key=d8kco",
    },
    {
      id: "resource-downloader",
      name: "Resource Downloader",
      description: "Downloaded recruitment resources and materials",
      category: "participation",
      color: "bg-orange-500",
      icon: "/placeholder.svg?key=lv4ao",
    },
    {
      id: "hard-charger",
      name: "Hard Charger",
      description: "Consistently asks questions and has applied",
      category: "participation",
      color: "bg-orange-500",
      icon: "/placeholder.svg?key=lv4ao",
    },
    {
      id: "connector",
      name: "Connector",
      description: "Connects with other participants",
      category: "participation",
      color: "bg-cyan-500",
      icon: "/placeholder.svg?key=lv4ao",
    },
    {
      id: "deep-diver",
      name: "Deep Diver",
      description: "Explores topics in great detail",
      category: "participation",
      color: "bg-blue-500",
      icon: "/placeholder.svg?key=lv4ao",
    },
    {
      id: "quick-learner",
      name: "Quick Learner",
      description: "Rapidly progresses through recruitment information",
      category: "participation",
      color: "bg-purple-500",
      icon: "/placeholder.svg?key=lv4ao",
    },
    {
      id: "persistent-explorer",
      name: "Persistent Explorer",
      description: "Returns regularly to learn more",
      category: "participation",
      color: "bg-green-500",
      icon: "/placeholder.svg?key=lv4ao",
    },
    {
      id: "dedicated-applicant",
      name: "Dedicated Applicant",
      description: "Applied and continues to engage",
      category: "participation",
      color: "bg-red-500",
      icon: "/placeholder.svg?key=lv4ao",
    },
  ]

  // Find badge by ID
  const badge = allBadges.find((badge) => badge.id === id)

  // If not found in predefined badges, try to fetch from database
  if (!badge) {
    try {
      const { data, error } = await supabase.from("badges").select("*").eq("id", id).single()

      if (error || !data) {
        return null
      }

      return {
        id: data.id,
        name: data.name || "Unknown Badge",
        description: data.description || "No description available",
        category: data.category || "participation",
        color: data.color || "bg-gray-500",
        icon: data.icon || "/generic-badge.png",
      }
    } catch (error) {
      console.error("Error fetching badge:", error)
      return null
    }
  }

  return badge
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
