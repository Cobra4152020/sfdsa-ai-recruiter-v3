export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { type NextRequest, NextResponse } from "next/server"
import { getNotifications } from "@/lib/notification-service"
import { getServiceSupabase } from "@/app/lib/supabase/server"

// Mock notifications for static export
const STATIC_NOTIFICATIONS = [
  {
    id: "1",
    title: "Welcome!",
    message: "Welcome to the SFDA AI Recruiter platform.",
    type: "info",
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Get Started",
    message: "Complete your profile to get personalized recommendations.",
    type: "action",
    read: false,
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    // For static export, return mock notifications
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      return NextResponse.json({ 
        notifications: STATIC_NOTIFICATIONS,
        source: 'static'
      })
    }

    // Get user ID from session
    const {
      data: { session },
    } = await getServiceSupabase().auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const notifications = await getNotifications(userId)

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ 
      error: "Failed to fetch notifications",
      source: 'error'
    }, { status: 500 })
  }
}
