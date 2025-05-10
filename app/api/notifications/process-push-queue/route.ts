import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"

// This endpoint will be called by a cron job to process the push notification queue
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getServiceSupabase()

    // Get pending notifications
    const { data: pendingNotifications, error } = await supabase
      .from("push_notification_queue")
      .select(`
        id, 
        payload, 
        push_subscriptions(endpoint, p256dh, auth)
      `)
      .eq("status", "pending")
      .limit(50)

    if (error) {
      console.error("Error fetching pending notifications:", error)
      return NextResponse.json({ error: "Failed to fetch pending notifications" }, { status: 500 })
    }

    if (!pendingNotifications || pendingNotifications.length === 0) {
      return NextResponse.json({ message: "No pending notifications" })
    }

    // Process each notification
    const results = await Promise.all(
      pendingNotifications.map(async (notification) => {
        try {
          const subscription = notification.push_subscriptions

          // Use the Fetch API to send the push notification directly to the endpoint
          // This avoids using the problematic web-push library
          const response = await fetch(subscription.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.VAPID_AUTH_TOKEN}`,
            },
            body: notification.payload,
          })

          // Update the notification status
          const status = response.ok ? "delivered" : "failed"
          const error = !response.ok ? await response.text() : null

          await supabase
            .from("push_notification_queue")
            .update({
              status,
              processed_at: new Date().toISOString(),
              error,
            })
            .eq("id", notification.id)

          return { id: notification.id, success: response.ok }
        } catch (error) {
          console.error(`Error processing notification ${notification.id}:`, error)

          // Update the notification status
          await supabase
            .from("push_notification_queue")
            .update({
              status: "failed",
              processed_at: new Date().toISOString(),
              error: error.message,
            })
            .eq("id", notification.id)

          return { id: notification.id, success: false }
        }
      }),
    )

    return NextResponse.json({
      processed: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    })
  } catch (error) {
    console.error("Error processing push notification queue:", error)
    return NextResponse.json({ error: "Failed to process push notification queue" }, { status: 500 })
  }
}
