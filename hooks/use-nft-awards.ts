"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/user-context"
import type { NFTAward } from "@/lib/nft-utils"

interface UseNFTAwardsReturn {
  awards: NFTAward[]
  currentPoints: number
  nextAward: NFTAward | null
  isLoading: boolean
  error: string | null
  checkForNewAwards: () => Promise<{ success: boolean; newAwards?: NFTAward[] }>
}

export function useNFTAwards(): UseNFTAwardsReturn {
  const { currentUser } = useUser()
  const [awards, setAwards] = useState<NFTAward[]>([])
  const [currentPoints, setCurrentPoints] = useState(0)
  const [nextAward, setNextAward] = useState<NFTAward | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAwards = async () => {
    if (!currentUser?.id) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${currentUser.id}/nft-awards`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch NFT awards")
      }

      setAwards(data.awards || [])
      setCurrentPoints(data.currentPoints || 0)
      setNextAward(data.nextAward || null)
    } catch (err) {
      console.error("Error fetching NFT awards:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAwards()
  }, [currentUser?.id])

  const checkForNewAwards = async () => {
    if (!currentUser?.id) {
      return { success: false }
    }

    try {
      // This endpoint would check for new awards based on current points
      // and award them if eligible
      const response = await fetch(`/api/users/${currentUser.id}/check-nft-awards`, {
        method: "POST",
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to check for new NFT awards")
      }

      // If new awards were earned, refresh the awards list
      if (data.newAwards && data.newAwards.length > 0) {
        await fetchAwards()
      }

      return {
        success: true,
        newAwards: data.newAwards,
      }
    } catch (err) {
      console.error("Error checking for new NFT awards:", err)
      return { success: false }
    }
  }

  return {
    awards,
    currentPoints,
    nextAward,
    isLoading,
    error,
    checkForNewAwards,
  }
}
