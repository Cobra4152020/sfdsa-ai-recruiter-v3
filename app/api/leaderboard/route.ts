import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"

export type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "application-started"
  | "application-completed"
  | "first-response"
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
    const url = new URL(request.url)
    const timeframe = (url.searchParams.get("timeframe") || "all-time") as LeaderboardTimeframe
    const category = (url.searchParams.get("category") || "participation") as LeaderboardCategory
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")
    const search = url.searchParams.get("search") || ""

    // Create a response with proper headers
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    }

    try {
      const serviceClient = getServiceSupabase()

      const { data, error, count } = await serviceClient
        .from("users")
        .select(`
          id,
          name,
          avatar_url,
          participation_count,
          has_applied,
          created_at,
          (SELECT count(*) FROM badges WHERE badges.user_id = users.id) as badge_count,
          (SELECT count(*) FROM user_nft_awards WHERE user_nft_awards.user_id = users.id) as nft_count
        `)
        .ilike("name", `%${search}%`)
        .order("participation_count", { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error("Error fetching leaderboard:", error)
        return NextResponse.json({ success: false, message: "Failed to fetch leaderboard" }, { status: 500, headers })
      }

      return NextResponse.json({ success: true, leaderboard: { users: data, total: count } }, { status: 200, headers })
    } catch (dbError) {
      console.error("Database error:", dbError)

      // Return a fallback response with mock data
      const mockData = generateMockLeaderboardData(limit)
      return NextResponse.json(
        {
          success: true,
          leaderboard: {
            users: mockData,
            total: mockData.length,
          },
          isMock: true,
        },
        { status: 200, headers },
      )
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  }
}

// Helper function to generate mock data if the database query fails
function generateMockLeaderboardData(limit: number) {
  const names = [
    "John Smith",
    "Maria Garcia",
    "James Johnson",
    "David Williams",
    "Sarah Brown",
    "Michael Jones",
    "Jessica Miller",
    "Robert Davis",
    "Jennifer Wilson",
    "Thomas Moore",
  ]

  return Array.from({ length: Math.min(limit, names.length) }, (_, i) => ({
    id: `mock-user-${i + 1}`,
    name: names[i],
    participation_count: Math.floor(Math.random() * 1000) + 100,
    badge_count: Math.floor(Math.random() * 5),
    nft_count: Math.floor(Math.random() * 3),
    has_applied: Math.random() > 0.7,
    avatar_url: `/placeholder.svg?height=40&width=40&query=avatar ${i + 1}`,
    rank: i + 1,
    created_at: new Date().toISOString(),
  }))
}
