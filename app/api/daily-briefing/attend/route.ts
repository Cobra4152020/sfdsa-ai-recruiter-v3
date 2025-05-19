export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { recordAttendance } from "@/lib/daily-briefing-service"
import { getServiceSupabase } from "@/app/lib/supabase/server"

export async function POST(request: Request) {
  try {
    // Get the user ID from the session
    const supabase = getServiceSupabase()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get briefing ID from request body
    const { briefingId } = await request.json()

    if (!briefingId) {
      return NextResponse.json({ error: "Briefing ID is required" }, { status: 400 })
    }

    // Record attendance
    const success = await recordAttendance(userId, briefingId)

    if (!success) {
      return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in attendance API:", error)
    return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 })
  }
}
