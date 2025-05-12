import { NextResponse } from "next/server"
import { getTodaysBriefing } from "@/lib/daily-briefing-service"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (date) {
      // If a specific date is requested, fetch that briefing
      const supabase = createClient()
      const { data, error } = await supabase
        .from("daily_briefings")
        .select("*")
        .eq("date", date)
        .eq("active", true)
        .maybeSingle()

      if (error) {
        console.error("Error fetching briefing for date:", error)
        return NextResponse.json(
          {
            error: "Failed to fetch briefing",
            message: "An error occurred while fetching the briefing for the specified date.",
          },
          { status: 500 },
        )
      }

      if (!data) {
        return NextResponse.json(
          {
            error: "Briefing not found",
            message: "No briefing is available for the specified date.",
          },
          { status: 404 },
        )
      }

      return NextResponse.json({ briefing: data })
    }

    // Otherwise, get today's briefing
    console.log("API route: Fetching today's briefing")
    const briefing = await getTodaysBriefing()

    if (!briefing) {
      console.log("API route: No briefing available")
      return NextResponse.json(
        {
          error: "No briefing available",
          message: "No briefing is currently available. Please check back later.",
        },
        { status: 404 },
      )
    }

    console.log("API route: Briefing found, returning data")
    return NextResponse.json({ briefing })
  } catch (error) {
    console.error("Error in daily briefing API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch briefing",
        message: "An unexpected error occurred while fetching the briefing.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
