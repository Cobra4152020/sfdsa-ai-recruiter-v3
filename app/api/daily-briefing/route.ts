import { NextResponse } from "next/server"
import { getTodaysBriefing } from "@/lib/daily-briefing-service"

export async function GET() {
  try {
    const briefing = await getTodaysBriefing()

    if (!briefing) {
      return NextResponse.json(
        {
          error: "No briefing available",
          message: "No briefing is currently available. Please check back later.",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({ briefing })
  } catch (error) {
    console.error("Error in daily briefing API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch briefing",
        message: "An unexpected error occurred while fetching the briefing.",
      },
      { status: 500 },
    )
  }
}
