import { NextResponse } from "next/server"
import { getBriefingHistory } from "@/lib/daily-briefing-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "7", 10)

    const history = await getBriefingHistory(limit)

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Error in briefing history API:", error)
    return NextResponse.json({ error: "Failed to fetch briefing history" }, { status: 500 })
  }
}
