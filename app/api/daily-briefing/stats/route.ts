import { NextResponse } from "next/server"
import { getUserBriefingStats } from "@/lib/daily-briefing-service"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const stats = await getUserBriefingStats(userId)

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error in briefing stats API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
