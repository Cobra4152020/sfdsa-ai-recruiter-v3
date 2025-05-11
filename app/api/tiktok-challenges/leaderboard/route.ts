import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = createClient()

    // Get leaderboard data from the view
    const { data, error } = await supabase.from("tiktok_challenge_leaderboard").select("*").limit(20)

    if (error) throw error

    return NextResponse.json({ leaderboard: data })
  } catch (error) {
    console.error("Error fetching TikTok challenge leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
