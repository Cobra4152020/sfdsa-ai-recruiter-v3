"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: "application" | "participation"
  earned?: boolean
}

export function useBadges(userId?: string) {
  const [userBadges, setUserBadges] = useState<Badge[]>([])
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBadges = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, this would be API calls
      // const userBadgesResponse = await fetch(`/api/users/${userId}/badges`)
      // const availableBadgesResponse = await fetch('/api/badges')

      // For demo purposes, use static data
      const allBadges: Badge[] = [
        {
          id: "written",
          name: "Written Test Expert",
          description: "Successfully completed the written test preparation",
          icon: "/document-icon.png",
          color: "bg-blue-100",
          category: "application",
        },
        {
          id: "oral",
          name: "Oral Board Master",
          description: "Successfully prepared for the oral board interview",
          icon: "/chat-icon.png",
          color: "bg-green-100",
          category: "application",
        },
        {
          id: "physical",
          name: "Physical Test Champion",
          description: "Successfully prepared for the physical fitness test",
          icon: "/fitness-icon.png",
          color: "bg-orange-100",
          category: "application",
        },
        {
          id: "polygraph",
          name: "Polygraph Pro",
          description: "Successfully prepared for the polygraph examination",
          icon: "/document-icon.png",
          color: "bg-purple-100",
          category: "application",
        },
        {
          id: "psychological",
          name: "Psychological Exam Ace",
          description: "Successfully prepared for the psychological evaluation",
          icon: "/psychology-icon.png",
          color: "bg-pink-100",
          category: "application",
        },
        {
          id: "full",
          name: "Full Process Graduate",
          description: "Completed preparation for the entire hiring process",
          icon: "/document-icon.png",
          color: "bg-yellow-100",
          category: "application",
        },
        {
          id: "chat-participation",
          name: "Chat Participant",
          description: "Actively participated in the recruitment chat",
          icon: "/chat-icon.png",
          color: "bg-teal-100",
          category: "participation",
        },
        {
          id: "first-response",
          name: "First Responder",
          description: "Among the first to respond to new content",
          icon: "/document-icon.png",
          color: "bg-cyan-100",
          category: "participation",
        },
        {
          id: "application-started",
          name: "Application Starter",
          description: "Started the application process",
          icon: "/document-icon.png",
          color: "bg-indigo-100",
          category: "application",
        },
        {
          id: "application-completed",
          name: "Application Completer",
          description: "Completed the application process",
          icon: "/document-icon.png",
          color: "bg-emerald-100",
          category: "application",
        },
        {
          id: "frequent-user",
          name: "Frequent User",
          description: "Regularly engages with the platform",
          icon: "/document-icon.png",
          color: "bg-amber-100",
          category: "participation",
        },
        {
          id: "resource-downloader",
          name: "Resource Downloader",
          description: "Downloaded resources to aid in preparation",
          icon: "/document-icon.png",
          color: "bg-rose-100",
          category: "participation",
        },
      ]

      // If user is logged in, randomly assign some badges as earned
      if (userId) {
        // For demo purposes, randomly select some badges as earned
        const earnedBadgeIds = []
        const badgeCount = Math.floor(Math.random() * 5) + 2 // 2-6 badges

        for (let i = 0; i < badgeCount; i++) {
          const randomIndex = Math.floor(Math.random() * allBadges.length)
          earnedBadgeIds.push(allBadges[randomIndex].id)
        }

        // Remove duplicates
        const uniqueEarnedBadgeIds = [...new Set(earnedBadgeIds)]

        // Set user badges
        setUserBadges(
          allBadges
            .filter((badge) => uniqueEarnedBadgeIds.includes(badge.id))
            .map((badge) => ({ ...badge, earned: true })),
        )
      } else {
        setUserBadges([])
      }

      // Set all available badges
      setAvailableBadges(allBadges)
    } catch (err) {
      console.error("Error fetching badges:", err)
      setError("Failed to load badges")
      toast({
        title: "Error",
        description: "Failed to load badges. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBadges()
  }, [userId])

  return {
    userBadges,
    availableBadges,
    isLoading,
    error,
    refetch: fetchBadges,
  }
}
