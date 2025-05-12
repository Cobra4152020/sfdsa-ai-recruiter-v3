import { NextResponse } from "next/server"
import { markBriefingAttended } from "@/lib/daily-briefing-service"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { briefingId } = await request.json()

    if (!briefingId) {
      return NextResponse.json({ error: "Briefing ID is required" }, { status: 400 })
    }

    const result = await markBriefingAttended(user.id, briefingId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in attend briefing API:", error)
    return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 })
  }
}
