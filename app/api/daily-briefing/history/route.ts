import { NextResponse } from "next/server"
import { getBriefingHistory } from "@/lib/daily-briefing-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 7

    const history = await getBriefingHistory(limit)

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Error fetching briefing history:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch briefing history",
        message: "An unexpected error occurred while fetching the briefing history.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
