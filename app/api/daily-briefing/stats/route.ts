import { NextResponse } from "next/server"
import { getUserBriefingStats } from "@/lib/daily-briefing-service"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("User not authenticated for stats")
      // Return empty stats for unauthenticated users
      return NextResponse.json({
        stats: {
          currentStreak: 0,
          longestStreak: 0,
          totalAttended: 0,
          totalPoints: 0,
          lastAttendance: null,
        },
      })
    }

    // Get the user's briefing stats
    const stats = await getUserBriefingStats(user.id)

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching briefing stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch briefing stats",
        message: "An unexpected error occurred while fetching the briefing stats.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
