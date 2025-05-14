"use client"

import { useState, useEffect } from "react"
import { type Badge, type BadgeType, getBadgeById } from "@/lib/badge-utils"
import { useUser } from "@/context/user-context"

interface BadgeProgress {
  badgeId: string
  progress: number
  earned: boolean
  lastUpdated: string
}

export function useBadgeGallery() {
  const { currentUser } = useUser()
  const [badges, setBadges] = useState<Badge[]>([])
  const [userProgress, setUserProgress] = useState<Record<string, BadgeProgress>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<"all" | "application" | "participation">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<"name" | "progress" | "category">("category")

  // Fetch all badges
  useEffect(() => {
    const fetchBadges = async () => {
      setIsLoading(true)
      try {
        // This would typically be an API call, but we're using the static data for now
        const badgeTypes: BadgeType[] = [
          "written",
          "oral",
          "physical",
          "polygraph",
          "psychological",
          "full",
          "chat-participation",
          "first-response",
          "application-started",
          "application-completed",
          "frequent-user",
          "resource-downloader",
          "hard-charger",
          "connector",
          "deep-diver",
          "quick-learner",
          "persistent-explorer",
          "dedicated-applicant",
        ]

        const badgePromises = badgeTypes.map((type) => getBadgeById(type))
        const badgeResults = await Promise.all(badgePromises)
        const validBadges = badgeResults.filter((badge) => badge !== null) as Badge[]

        setBadges(validBadges)
      } catch (error) {
        console.error("Error fetching badges:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBadges()
  }, [])

  // Fetch user progress if logged in
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!currentUser) {
        setUserProgress({})
        return
      }

      try {
        // In a real app, this would be an API call to get the user's badge progress
        // For now, we'll simulate some random progress
        const progress: Record<string, BadgeProgress> = {}

        badges.forEach((badge) => {
          const earned = Math.random() > 0.7
          progress[badge.id] = {
            badgeId: badge.id,
            progress: earned ? 100 : Math.floor(Math.random() * 80),
            earned,
            lastUpdated: new Date().toISOString(),
          }
        })

        setUserProgress(progress)
      } catch (error) {
        console.error("Error fetching user progress:", error)
      }
    }

    if (badges.length > 0 && currentUser) {
      fetchUserProgress()
    }
  }, [badges, currentUser])

  // Filter badges based on category and search query
  const filteredBadges = badges.filter((badge) => {
    const matchesCategory = activeCategory === "all" || badge.category === activeCategory
    const matchesSearch =
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Sort badges based on sort option
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name)
    } else if (sortOption === "progress") {
      const progressA = userProgress[a.id]?.progress || 0
      const progressB = userProgress[b.id]?.progress || 0
      return progressB - progressA
    } else {
      // Sort by category
      if (a.category !== b.category) {
        return a.category === "application" ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    }
  })

  // Handle sharing to progress
  const handleShare = async (badgeId: string) => {
    if (!currentUser) return

    // In a real app, this would trigger a sharing dialog and then update the progress
    // For now, we'll just simulate progress update
    setUserProgress((prev) => {
      const currentProgress = prev[badgeId]?.progress || 0
      const newProgress = Math.min(100, currentProgress + 25)
      const earned = newProgress >= 100

      return {
        ...prev,
        [badgeId]: {
          badgeId,
          progress: newProgress,
          earned,
          lastUpdated: new Date().toISOString(),
        },
      }
    })

    // Show a toast or notification that sharing was successful
    console.log(`Shared badge ${badgeId} to progress`)
  }

  return {
    badges: sortedBadges,
    userProgress,
    isLoading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    handleShare,
  }
}
