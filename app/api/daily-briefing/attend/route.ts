
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { recordAttendance } from "@/lib/daily-briefing-service"
import { createClient } from "@/lib/supabase-clients"

export async function POST(request: Request) {
  try {
    // Get the user ID from the session
    const supabase = createClient()
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
