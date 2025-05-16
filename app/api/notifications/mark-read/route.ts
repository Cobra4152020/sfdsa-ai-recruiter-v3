
export const dynamic = 'force-dynamic';

import { type NextRequest, NextResponse } from "next/server"
import { markAsRead, markAllAsRead } from "@/lib/notification-service"
import { supabase } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  try {
    // Get user ID from session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { notificationId, markAll } = await request.json()

    let success = false

    if (markAll) {
      success = await markAllAsRead(userId)
    } else if (notificationId) {
      success = await markAsRead(notificationId)
    } else {
      return NextResponse.json({ error: "Missing notificationId or markAll parameter" }, { status: 400 })
    }

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to mark notification(s) as read" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
  }
}
