
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { recordShare } from "@/lib/daily-briefing-service"
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

    // Get briefing ID and platform from request body
    const { briefingId, platform } = await request.json()

    if (!briefingId || !platform) {
      return NextResponse.json({ error: "Briefing ID and platform are required" }, { status: 400 })
    }

    // Record share
    const success = await recordShare(userId, briefingId, platform)

    if (!success) {
      return NextResponse.json({ error: "Failed to record share or already shared on this platform" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in share API:", error)
    return NextResponse.json({ error: "Failed to record share" }, { status: 500 })
  }
}
