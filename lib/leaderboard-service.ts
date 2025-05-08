import type { LeaderboardFilters, LeaderboardUser, LeaderboardResponse } from "../types/leaderboard"
import { DEFAULT_FILTERS } from "../constants"
import { getServiceSupabase } from "./supabase"
import { getMockLeaderboardData } from "./mock"

/**
 * Fetches leaderboard data from the database
 * @param filters Filters to apply to the leaderboard data
 * @returns Promise resolving to leaderboard data
 */
export async function fetchLeaderboard(filters: LeaderboardFilters = DEFAULT_FILTERS): Promise<LeaderboardResponse> {
  try {
    // Use mock data in development if needed
    if (process.env.NODE_ENV === "development" && process.env.USE_MOCK_DATA === "true") {
      const mockUsers = getMockLeaderboardData(filters.limit)
      return {
        users: mockUsers,
        total: 100, // Mock total count
      }
    }

    const supabase = getServiceSupabase()

    // Get filtered leaderboard data
    const { data, error } = await supabase.rpc("get_leaderboard", {
      timeframe: filters.timeframe,
      category: filters.category,
      limit_val: filters.limit,
      offset_val: filters.offset,
      search_term: filters.search || "",
    })

    if (error) {
      console.error("Error fetching leaderboard:", error)
      throw new Error(`Failed to fetch leaderboard: ${error.message}`)
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("leaderboard_view")
      .select("user_id", { count: "exact", head: true })
      .ilike("name", `%${filters.search || ""}%`)

    if (countError) {
      console.error("Error fetching leaderboard count:", countError)
      throw new Error(`Failed to fetch leaderboard count: ${countError.message}`)
    }

    return {
      users: data as LeaderboardUser[],
      total: count || 0,
    }
  } catch (error) {
    console.error("Error in fetchLeaderboard:", error)
    throw error
  }
}

/**
 * Updates a user's participation count
 * @param userId User ID to update
 * @param points Points to add to participation count
 * @returns Promise resolving to success status
 */
export async function updateUserParticipation(userId: string, points: number): Promise<boolean> {
  try {
    const supabase = getServiceSupabase()

    // Add activity record
    const { error } = await supabase.from("user_activities").insert({
      user_id: userId,
      activity_type: "participation",
      description: `Earned ${points} participation points`,
      points,
    })

    if (error) {
      console.error("Error updating user participation:", error)
      throw new Error(`Failed to update user participation: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error("Error in updateUserParticipation:", error)
    return false
  }
}

/**
 * Refreshes the leaderboard materialized view
 * @returns Promise resolving to success status
 */
export async function refreshLeaderboardView(): Promise<boolean> {
  try {
    const supabase = getServiceSupabase()

    // Execute refresh function
    const { error } = await supabase.rpc("refresh_leaderboard_view")

    if (error) {
      console.error("Error refreshing leaderboard view:", error)
      throw new Error(`Failed to refresh leaderboard view: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error("Error in refreshLeaderboardView:", error)
    return false
  }
}
