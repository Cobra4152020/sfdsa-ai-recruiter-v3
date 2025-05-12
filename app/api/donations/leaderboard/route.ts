import { NextResponse } from "next/server"
import { getDonationLeaderboard } from "@/lib/donation-points-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    const result = await getDonationLeaderboard(limit, offset)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching donation leaderboard:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
