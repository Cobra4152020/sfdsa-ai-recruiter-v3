
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-clients"
import { getBriefingStats } from "@/lib/daily-briefing-service"

// Fallback briefing data
const fallbackBriefing = {
  id: "fallback-briefing",
  title: "San Francisco Deputy Sheriff's Daily Briefing",
  content: `
    <h3>Today's Focus: Community Safety</h3>
    <p>
      Welcome to today's briefing. We continue our commitment to serving the San Francisco 
      community with dedication and integrity.
    </p>
    
    <h4>Safety Reminders:</h4>
    <ul>
      <li>Always be aware of your surroundings</li>
      <li>Check your equipment before starting your shift</li>
      <li>Report any safety concerns immediately</li>
    </ul>
    
    <h4>Community Engagement:</h4>
    <p>
      Our presence in the community is vital for building trust and ensuring safety. 
      Remember to engage positively with community members and be a visible presence 
      in your assigned areas.
    </p>
    
    <h4>Department Updates:</h4>
    <p>
      Regular training sessions continue next week. Please ensure all required documentation 
      is completed properly and promptly.
    </p>
  `,
  date: new Date().toISOString(),
  theme: "Safety",
  created_at: new Date().toISOString(),
}

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Query the daily_briefings table for today's briefing
    const { data, error } = await supabase.from("daily_briefings").select("*").eq("date", today).single()

    if (error) {
      console.error("Error fetching today's briefing:", error)

      // If no briefing for today, get the most recent one
      const { data: recentData, error: recentError } = await supabase
        .from("daily_briefings")
        .select("*")
        .order("date", { ascending: false })
        .limit(1)
        .single()

      if (recentError) {
        console.error("Error fetching recent briefing:", recentError)
        return NextResponse.json({ briefing: fallbackBriefing, error: "Failed to load briefing from database" })
      }

      // Get stats for the briefing
      const stats = await getBriefingStats(recentData.id)

      return NextResponse.json({
        briefing: { ...recentData, userStreak: 0 },
        stats,
        error: null,
      })
    }

    // Get stats for the briefing
    const stats = await getBriefingStats(data.id)

    return NextResponse.json({
      briefing: { ...data, userStreak: 0 },
      stats,
      error: null,
    })
  } catch (error) {
    console.error("Exception in GET /api/daily-briefing/today:", error)
    return NextResponse.json({
      briefing: fallbackBriefing,
      error: "An unexpected error occurred",
    })
  }
}
