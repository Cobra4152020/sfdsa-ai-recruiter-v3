import { NextResponse } from "next/server"
import { getRecruiterLeaderboard } from "@/lib/recruiter-rewards-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get("limit")
    const offsetParam = searchParams.get("offset")

    const limit = limitParam ? Number.parseInt(limitParam, 10) : 10
    const offset = offsetParam ? Number.parseInt(offsetParam, 10) : 0

    const result = await getRecruiterLeaderboard(limit, offset)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in recruiter leaderboard GET:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
