import { getServiceSupabase } from "@/lib/supabase-clients"

// We'll use a more direct approach without the web-push library
// to avoid the inheritance chain issues
interface PushNotificationPayload {
  title: string
  message: string
  icon?: string
  badge?: string
  actionUrl?: string
  tag?: string
  renotify?: boolean
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export async function sendPushNotification(userId: string, payload: PushNotificationPayload) {
  try {
    // Get the user's push subscriptions
    const supabase = getServiceSupabase()
    const { data: subscriptions, error } = await supabase.from("push_subscriptions").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching push subscriptions:", error)
      return false
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${userId}`)
      return false
    }

    // Instead of using web-push directly, we'll use the Push API via a server action
    // This avoids the problematic dependency
    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          // Store the notification in the database for the service worker to pick up
          const { error: notifError } = await supabase.from("push_notification_queue").insert({
            subscription_id: sub.id,
            payload: JSON.stringify(payload),
            created_at: new Date().toISOString(),
            status: "pending",
          })

          if (notifError) {
            console.error("Error queueing push notification:", notifError)
            return false
          }

          return true
        } catch (error) {
          console.error("Error processing push notification:", error)
          return false
        }
      }),
    )

    // Return true if at least one notification was queued successfully
    return results.some((result) => result)
  } catch (error) {
    console.error("Error in sendPushNotification:", error)
    return false
  }
}
