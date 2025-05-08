"use client"

import { useState, useEffect, useCallback } from "react"
import { addCacheBustingParam } from "@/lib/cache-utils"

export interface LeaderboardUser {
  id: string
  name: string
  avatar_url?: string
  participation_count: number
  badge_count: number
  nft_count: number
  has_applied: boolean
  rank?: number
  is_current_user?: boolean
}

export interface LeaderboardFilters {
  timeframe: "daily" | "weekly" | "monthly" | "all-time"
  category: "participation" | "badges" | "nfts" | "application"
  limit: number
  offset: number
  search?: string
}

const defaultFilters: LeaderboardFilters = {
  timeframe: "all-time",
  category: "participation",
  limit: 10,
  offset: 0,
}

export function useLeaderboardData(initialFilters?: Partial<LeaderboardFilters>, currentUserId?: string) {
  const [filters, setFilters] = useState<LeaderboardFilters>({
    ...defaultFilters,
    ...initialFilters,
  })
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Build query parameters
      const params = new URLSearchParams({
        timeframe: filters.timeframe,
        category: filters.category,
        limit: filters.limit.toString(),
        offset: filters.offset.toString(),
      })

      if (filters.search) {
        params.append("search", filters.search)
      }

      if (currentUserId) {
        params.append("currentUserId", currentUserId)
      }

      // Add cache busting parameter
      const url = addCacheBustingParam(`/api/leaderboard?${params.toString()}`)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch leaderboard data")
      }

      setLeaderboard(data.leaderboard || [])
      setTotalUsers(data.total || data.leaderboard?.length || 0)
    } catch (err) {
      console.error("Error fetching leaderboard:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch leaderboard data")
      setLeaderboard([])
    } finally {
      setIsLoading(false)
    }
  }, [filters, currentUserId])

  // Fetch leaderboard data when filters change
  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  // Filter update functions
  const setTimeframe = useCallback((timeframe: LeaderboardFilters["timeframe"]) => {
    setFilters((prev) => ({ ...prev, timeframe, offset: 0 }))
  }, [])

  const setCategory = useCallback((category: LeaderboardFilters["category"]) => {
    setFilters((prev) => ({ ...prev, category, offset: 0 }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, offset: 0 }))
  }, [])

  const setOffset = useCallback((offset: number) => {
    setFilters((prev) => ({ ...prev, offset }))
  }, [])

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, offset: 0 }))
  }, [])

  const refreshLeaderboard = useCallback(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return {
    leaderboard,
    isLoading,
    error,
    totalUsers,
    filters,
    setTimeframe,
    setCategory,
    setLimit,
    setOffset,
    setSearch,
    refreshLeaderboard,
  }
}
