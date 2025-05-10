import { NextResponse } from "next/server"
import { createNotification } from "@/lib/notification-service"

export async function POST(request: Request) {
  try {
    const { userId, title, message, type } = await request.json()

    if (!userId || !title || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID, title, and message are required",
        },
        { status: 400 },
      )
    }

    // Create a test notification
    const notification = await createNotification({
      user_id: userId,
      type: type || "system",
      title,
      message,
      action_url: type === "badge" ? "/badges" : type === "donation" ? "/donate/thank-you" : undefined,
    })

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create test notification",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      notification,
    })
  } catch (error) {
    console.error("Error creating test notification:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
