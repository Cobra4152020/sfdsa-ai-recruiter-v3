import { NextResponse } from "next/server"
import { getTodaysBriefing, generateTodaysBriefingIfNeeded } from "@/lib/daily-briefing-service"

export async function GET() {
  try {
    // First try to get today's briefing
    let briefing = await getTodaysBriefing()

    // If no briefing exists for today, generate one
    if (!briefing) {
      briefing = await generateTodaysBriefingIfNeeded()
    }

    if (!briefing) {
      return NextResponse.json({ error: "Failed to retrieve or generate today's briefing" }, { status: 500 })
    }

    return NextResponse.json({ briefing })
  } catch (error) {
    console.error("Error in daily briefing API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
