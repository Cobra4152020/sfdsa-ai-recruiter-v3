import { NextResponse } from "next/server"
import { fetchLeaderboard } from "@/lib/leaderboard-service"
import { API_CACHE_HEADERS } from "@/lib/cache-utils"

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

export type LeaderboardTimeframe = "daily" | "weekly" | "monthly" | "all-time"
export type LeaderboardCategory = "participation" | "badges" | "nfts" | "application"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = (searchParams.get("timeframe") as LeaderboardTimeframe) || "all-time"
    const category = (searchParams.get("category") as LeaderboardCategory) || "participation"
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || undefined
    const currentUserId = searchParams.get("currentUserId") || undefined

    const leaderboard = await fetchLeaderboard({ timeframe, category, limit, search }, currentUserId)

    // Add cache control headers to prevent caching
    return NextResponse.json({ success: true, leaderboard, timestamp: Date.now() }, { headers: API_CACHE_HEADERS })
  } catch (error) {
    console.error("Error in /api/leaderboard:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboard data" },
      { status: 500, headers: API_CACHE_HEADERS },
    )
  }
}
