import { NextResponse } from "next/server"
import { getUserBriefingStats } from "@/lib/daily-briefing-service"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const stats = await getUserBriefingStats(user.id)

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error in briefing stats API:", error)
    return NextResponse.json({ error: "Failed to fetch briefing stats" }, { status: 500 })
  }
}
