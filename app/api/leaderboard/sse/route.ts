import { fetchLeaderboard } from "@/lib/leaderboard-service";
import { NextResponse } from "next/server";
import type {
  LeaderboardTimeframe,
  LeaderboardCategory,
  LeaderboardFilters,
} from "@/types/leaderboard";

export const dynamic = "force-static";
export const revalidate = 60; // Revalidate every minute

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") ||
      "all") as LeaderboardTimeframe;
    const category = (searchParams.get("category") ||
      "participation") as LeaderboardCategory;
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit") as string)
      : 10;
    const search = searchParams.get("search") || undefined;

    const filters: LeaderboardFilters = {
      timeframe,
      category,
      limit,
      search,
      offset: 0, // Default offset
    };

    // Fetch the leaderboard data
    const leaderboard = await fetchLeaderboard(filters);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch leaderboard",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
