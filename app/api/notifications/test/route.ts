
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { type NextRequest, NextResponse } from "next/server"
import { createNotification } from "@/lib/notification-service"
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
    const { type = "test", title, message, actionUrl, imageUrl } = await request.json()

    const notification = await createNotification({
      userId,
      type,
      title: title || "Test Notification",
      message: message || "This is a test notification.",
      actionUrl,
      imageUrl,
    })

    if (notification) {
      return NextResponse.json({ success: true, notification })
    } else {
      return NextResponse.json({ error: "Failed to create test notification" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating test notification:", error)
    return NextResponse.json({ error: "Failed to create test notification" }, { status: 500 })
  }
}
