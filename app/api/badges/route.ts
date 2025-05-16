
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Use the badge types from your AchievementBadge component
type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "application-started"
  | "application-completed"
  | "first-response"
  | "frequent-user"
  | "resource-downloader"

interface Badge {
  id: string
  badge_type: BadgeType
  name: string
  description: string
  created_at: string
}

export async function GET() {
  try {
    const supabase = createClient()

    const { data: badges, error } = await supabase.from("badges").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching badges:", error)
      return NextResponse.json({ success: false, message: "Failed to fetch badges" }, { status: 500 })
    }

    return NextResponse.json({ success: true, badges })
  } catch (error) {
    console.error("Unexpected error:", error)

    // Fallback to static data if database query fails
    const staticBadges: Badge[] = [
      {
        id: "written",
        badge_type: "written",
        name: "Written Test",
        description: "Completed written test preparation",
        created_at: new Date().toISOString(),
      },
      {
        id: "oral",
        badge_type: "oral",
        name: "Oral Board",
        description: "Prepared for oral board interviews",
        created_at: new Date().toISOString(),
      },
      {
        id: "physical",
        badge_type: "physical",
        name: "Physical Test",
        description: "Completed physical test preparation",
        created_at: new Date().toISOString(),
      },
      {
        id: "polygraph",
        badge_type: "polygraph",
        name: "Polygraph",
        description: "Learned about the polygraph process",
        created_at: new Date().toISOString(),
      },
      {
        id: "psychological",
        badge_type: "psychological",
        name: "Psychological",
        description: "Prepared for psychological evaluation",
        created_at: new Date().toISOString(),
      },
      {
        id: "full",
        badge_type: "full",
        name: "Full Process",
        description: "Completed all preparation areas",
        created_at: new Date().toISOString(),
      },
      {
        id: "chat-participation",
        badge_type: "chat-participation",
        name: "Chat Participation",
        description: "Engaged with Sgt. Ken",
        created_at: new Date().toISOString(),
      },
      {
        id: "first-response",
        badge_type: "first-response",
        name: "First Response",
        description: "Received first response from Sgt. Ken",
        created_at: new Date().toISOString(),
      },
      {
        id: "application-started",
        badge_type: "application-started",
        name: "Application Started",
        description: "Started the application process",
        created_at: new Date().toISOString(),
      },
      {
        id: "application-completed",
        badge_type: "application-completed",
        name: "Application Completed",
        description: "Completed the application process",
        created_at: new Date().toISOString(),
      },
      {
        id: "frequent-user",
        badge_type: "frequent-user",
        name: "Frequent User",
        description: "Regularly engages with the recruitment platform",
        created_at: new Date().toISOString(),
      },
      {
        id: "resource-downloader",
        badge_type: "resource-downloader",
        name: "Resource Downloader",
        description: "Downloaded recruitment resources and materials",
        created_at: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ success: true, badges: staticBadges })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { badge_type, name, description } = await request.json()

    if (!badge_type || !name || !description) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase.from("badges").insert([{ badge_type, name, description }]).select()

    if (error) {
      console.error("Error creating badge:", error)
      return NextResponse.json({ success: false, message: "Failed to create badge" }, { status: 500 })
    }

    return NextResponse.json({ success: true, badge: data[0] })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
