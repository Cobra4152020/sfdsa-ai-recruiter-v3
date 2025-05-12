import { NextResponse } from "next/server"
import { getTodaysBriefing, recordAttendance } from "@/lib/daily-briefing-service"
import { createClient } from "@/lib/supabase-clients"

export async function GET(request: Request) {
  try {
    // Get the user ID from the session
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id

    // Get today's briefing
    const briefing = await getTodaysBriefing()

    if (!briefing) {
      return NextResponse.json({ error: "No briefing available for today" }, { status: 404 })
    }

    // If user is logged in, record attendance
    if (userId) {
      await recordAttendance(userId, briefing.id)
    }

    return NextResponse.json({ briefing })
  } catch (error) {
    console.error("Error in daily briefing API:", error)
    return NextResponse.json({ error: "Failed to fetch daily briefing" }, { status: 500 })
  }
}
