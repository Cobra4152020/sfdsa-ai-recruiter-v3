"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/context/user-context"
import type { LeaderboardTimeframe, LeaderboardCategory } from "@/app/api/leaderboard/route"

interface LeaderboardUser {
  id: string
  name: string
  avatar_url?: string
  bio?: string
  participation_count: number
  has_applied: boolean
  badge_count: number
  nft_count: number
  rank?: number
  badges?: any[]
  nft_awards?: any[]
  is_current_user?: boolean
}

interface UseEnhancedLeaderboardProps {
  initialTimeframe?: LeaderboardTimeframe
  initialCategory?: LeaderboardCategory
  initialLimit?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useEnhancedLeaderboard({
  initialTimeframe = "all-time",
  initialCategory = "participation",
  initialLimit = 10,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}: UseEnhancedLeaderboardProps = {}) {
  const { currentUser } = useUser()
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>(initialTimeframe)
  const [category, setCategory] = useState<LeaderboardCategory>(initialCategory)
  const [limit, setLimit] = useState<number>(initialLimit)
  const [search, setSearch] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState<boolean>(autoRefresh)
  const eventSourceRef = useRef<EventSource | null>(null)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams({
        timeframe,
        category,
        limit: limit.toString(),
      })

      if (search) {
        queryParams.append("search", search)
      }

      const response = await fetch(`/api/leaderboard?${queryParams.toString()}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch leaderboard data")
      }

      setLeaderboard(data.leaderboard)
    } catch (err) {
      console.error("Error fetching leaderboard:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Set up real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return

    // Clean up any existing event source
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    // Set up SSE connection
    const queryParams = new URLSearchParams({
      timeframe,
      category,
      limit: limit.toString(),
    })

    if (search) {
      queryParams.append("search", search)
    }

    const eventSource = new EventSource(`/api/leaderboard/sse?${queryParams.toString()}`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "update" && data.leaderboard) {
          setLeaderboard(data.leaderboard)
        }
      } catch (err) {
        console.error("Error processing SSE message:", err)
      }
    }

    eventSource.onerror = () => {
      console.error("SSE connection error")
      eventSource.close()

      // Fall back to polling if SSE fails
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }

      refreshTimerRef.current = setInterval(fetchLeaderboard, refreshInterval)
    }

    eventSourceRef.current = eventSource

    return () => {
      eventSource.close()
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
        refreshTimerRef.current = null
      }
    }
  }, [isRealTimeEnabled, timeframe, category, limit, search, refreshInterval])

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard()
  }, [timeframe, category, limit, search])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [])

  return {
    leaderboard,
    isLoading,
    error,
    filters: {
      timeframe,
      category,
      limit,
      search,
    },
    setTimeframe,
    setCategory,
    setLimit,
    setSearch,
    refreshLeaderboard: fetchLeaderboard,
    isRealTimeEnabled,
    setIsRealTimeEnabled,
  }
}
