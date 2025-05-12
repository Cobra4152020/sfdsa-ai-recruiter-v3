import { NextResponse } from "next/server"

// Fallback briefing data
const fallbackBriefing = {
  id: "fallback-briefing",
  title: "San Francisco Deputy Sheriff's Daily Briefing",
  content: `
  # Today's Briefing
  
  ## Safety Reminders
  - Always be aware of your surroundings
  - Check your equipment before starting your shift
  - Report any safety concerns immediately
  
  ## Community Engagement
  - Remember to engage positively with community members
  - Be a visible presence in your assigned areas
  - Listen to community concerns and relay them appropriately
  
  ## Department Updates
  - Regular training sessions continue next week
  - New communication protocols are being implemented
  - Remember to complete all required documentation promptly
  
  Stay safe and thank you for your service!
  `,
  date: new Date().toISOString(),
  theme: "Safety",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export async function GET(request: Request) {
  try {
    // Try to get the real briefing data
    // For now, we'll use the fallback data to ensure the page loads
    const briefing = fallbackBriefing

    return NextResponse.json({ briefing })
  } catch (error) {
    console.error("Error in daily briefing API:", error)

    // Return fallback data with status 200 to prevent page crashes
    return NextResponse.json(
      {
        error: "Failed to fetch daily briefing",
        briefing: fallbackBriefing,
      },
      { status: 200 },
    )
  }
}
