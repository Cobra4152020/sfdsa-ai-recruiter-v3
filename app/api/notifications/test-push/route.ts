
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { createNotification } from "@/lib/notification-service"
import { getServiceSupabase } from "@/lib/supabase-clients"

export async function POST(request: Request) {
  try {
    const { userId, title, message, type = "system", actionUrl } = await request.json()

    if (!userId || !title || !message) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Verify the user exists
    const supabase = getServiceSupabase()
    const { data: user, error: userError } = await supabase.from("profiles").select("id").eq("id", userId).single()

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Create notification with push
    const notification = await createNotification({
      user_id: userId,
      type: type as any,
      title,
      message,
      send_push: true,
      action_url: actionUrl || "/notifications",
      image_url: `/public/${type}-icon.png`,
    })

    if (!notification) {
      return NextResponse.json({ success: false, message: "Failed to create notification" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      notification,
    })
  } catch (error) {
    console.error("Error sending test notification:", error)
    return NextResponse.json({ success: false, message: "Failed to send notification" }, { status: 500 })
  }
}
