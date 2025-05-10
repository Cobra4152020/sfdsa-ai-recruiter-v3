import { NextResponse } from "next/server"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/notification-service"

export async function POST(request: Request) {
  try {
    const { notificationId, userId, markAll = false } = await request.json()

    if (markAll) {
      if (!userId) {
        return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
      }

      const success = await markAllNotificationsAsRead(userId)

      return NextResponse.json({
        success,
        message: success ? "All notifications marked as read" : "Failed to mark all notifications as read",
      })
    } else {
      if (!notificationId) {
        return NextResponse.json({ success: false, message: "Notification ID is required" }, { status: 400 })
      }

      const success = await markNotificationAsRead(notificationId)

      return NextResponse.json({
        success,
        message: success ? "Notification marked as read" : "Failed to mark notification as read",
      })
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ success: false, message: "Failed to mark notification as read" }, { status: 500 })
  }
}
