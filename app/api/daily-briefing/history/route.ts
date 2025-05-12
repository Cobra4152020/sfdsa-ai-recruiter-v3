import { NextResponse } from "next/server"
import { getRecentBriefings } from "@/lib/daily-briefing-service"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "7", 10)

    const briefings = await getRecentBriefings(limit)

    return NextResponse.json({ briefings })
  } catch (error) {
    console.error("Error in briefing history API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
