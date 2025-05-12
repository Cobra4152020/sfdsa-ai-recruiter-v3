import { NextResponse } from "next/server"
import { recordBriefingAttendance } from "@/lib/daily-briefing-service"
import { getServiceSupabase } from "@/lib/supabase-clients"

export async function POST(req: Request) {
  try {
    const { userId, briefingId } = await req.json()

    if (!userId || !briefingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user exists
    const supabase = getServiceSupabase()
    const { data: user, error: userError } = await supabase.from("users").select("id").eq("id", userId).single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const result = await recordBriefingAttendance(userId, briefingId)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      pointsAwarded: result.pointsAwarded,
      newStreak: result.newStreak,
      alreadyAttended: result.alreadyAttended,
    })
  } catch (error) {
    console.error("Error in briefing attendance API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
