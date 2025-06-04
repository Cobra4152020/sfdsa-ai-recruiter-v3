import { getServiceSupabase } from "@/app/lib/supabase/server";

// This implementation avoids using the problematic web-push library
export interface PushNotificationPayload {
  title: string;
  message: string;
  icon?: string;
  badge?: string;
  actionUrl?: string;
  tag?: string;
}

export async function sendPushNotification(
  userId: string,
  payload: PushNotificationPayload,
): Promise<boolean> {
  try {
    const supabase = getServiceSupabase();

    // Get the user's push subscriptions
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching push subscriptions:", error);
      return false;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${userId}`);
      return false;
    }

    // Instead of using web-push, we'll store the notification in a queue table
    // that will be processed by a client-side polling mechanism
    const results = await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          // Store the notification in the push_notification_queue table
          const { error: queueError } = await supabase
            .from("push_notification_queue")
            .insert({
              subscription_id: subscription.id,
              payload: {
                title: payload.title,
                message: payload.message,
                icon: payload.icon || "/notification-icon.png",
                badge: payload.badge || "/sfdsa-logo.png",
                actionUrl: payload.actionUrl || "/",
                tag: payload.tag || "default",
              },
              status: "pending",
              created_at: new Date().toISOString(),
            });

          if (queueError) {
            console.error("Error queueing push notification:", queueError);
            return false;
          }

          return true;
        } catch (error) {
          console.error("Error processing push notification:", error);
          return false;
        }
      }),
    );

    // Return true if at least one notification was queued successfully
    return results.some((result) => result);
  } catch (error) {
    console.error("Error in sendPushNotification:", error);
    return false;
  }
}
