import { NextResponse } from "next/server"
import { getTodaysBriefing, recordAttendance } from "@/lib/daily-briefing-service"
import { getSupabaseClient } from "@/lib/supabase-client-singleton"

export async function GET(request: Request) {
  try {
    // Get the user ID from the session using the singleton client
    const supabase = getSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id

    // Get today's briefing
    const briefing = await getTodaysBriefing()

    if (!briefing) {
      return NextResponse.json({
        briefing: {
          id: "",
          title: "No Briefing Available",
          content: "There is no briefing available for today.",
          date: new Date().toISOString(),
          theme: "None",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      })
    }

    // If user is logged in, record attendance
    if (userId) {
      await recordAttendance(userId, briefing.id)
    }

    return NextResponse.json({ briefing })
  } catch (error) {
    console.error("Error in daily briefing API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch daily briefing",
        briefing: {
          id: "",
          title: "Error Loading Briefing",
          content: "There was an error loading today's briefing. Please try again later.",
          date: new Date().toISOString(),
          theme: "Error",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      { status: 200 },
    ) // Return 200 with fallback data instead of error
  }
}
