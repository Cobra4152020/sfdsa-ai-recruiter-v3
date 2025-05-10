import { NextResponse } from "next/server"
import { getUserNotifications } from "@/lib/notification-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 20
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : 0
    const includeRead = searchParams.get("includeRead") === "true"

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const notifications = await getUserNotifications(userId, limit, offset, includeRead)

    return NextResponse.json({
      success: true,
      notifications,
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 })
  }
}
