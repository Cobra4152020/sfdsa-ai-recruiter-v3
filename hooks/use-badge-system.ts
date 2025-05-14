"use client"

import { useState } from "react"
import { useUser } from "@/context/user-context"
import type { BadgeType } from "@/lib/badge-utils"

interface BadgeDetails {
  type: BadgeType
  name?: string
  description?: string
  shareMessage?: string
  participationPoints?: number
}

interface UseBadgeSystemReturn {
  awardBadge: (badge: BadgeDetails) => Promise<{
    success: boolean
    alreadyEarned?: boolean
    badge?: any
    message?: string
  }>
  isAwarding: boolean
  error: string | null
}

/**
 * Hook for interacting with the badge system
 */
export function useBadgeSystem(): UseBadgeSystemReturn {
  const { currentUser } = useUser()
  const [isAwarding, setIsAwarding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const awardBadge = async (badge: BadgeDetails) => {
    if (!currentUser?.id) {
      setError("User not logged in")
      return { success: false, message: "User not logged in" }
    }

    setIsAwarding(true)
    setError(null)

    try {
      const response = await fetch("/api/award-badge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          badgeType: badge.type,
          badgeName: badge.name,
          badgeDescription: badge.description,
          participationPoints: badge.participationPoints,
          shareMessage: badge.shareMessage,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || "Failed to award badge")
        return { success: false, message: data.message || "Failed to award badge" }
      }

      return {
        success: true,
        alreadyEarned: data.alreadyEarned,
        badge: data.badge,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      return { success: false, message }
    } finally {
      setIsAwarding(false)
    }
  }

  return {
    awardBadge,
    isAwarding,
    error,
  }
}
