import { NextResponse } from "next/server"
import { recordBriefingShare } from "@/lib/daily-briefing-service"
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

    const { briefingId, platform } = await request.json()

    if (!briefingId || !platform) {
      return NextResponse.json({ error: "Briefing ID and platform are required" }, { status: 400 })
    }

    const result = await recordBriefingShare(user.id, briefingId, platform)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in share briefing API:", error)
    return NextResponse.json({ error: "Failed to record share" }, { status: 500 })
  }
}
