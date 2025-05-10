import { supabase } from "@/lib/supabase-client"

// Check if the browser supports push notifications
export function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window
}

// Register the service worker
export async function registerServiceWorker() {
  if (!isPushNotificationSupported()) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js", {
      scope: "/",
    })
    return registration
  } catch (error) {
    console.error("Service Worker registration failed:", error)
    return null
  }
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(userId: string) {
  if (!isPushNotificationSupported()) {
    return null
  }

  try {
    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready

    // Get the subscription if it exists
    let subscription = await registration.pushManager.getSubscription()

    // If no subscription exists, create one
    if (!subscription) {
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          // Use a simple application server key
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        })
      } catch (error) {
        console.error("Failed to subscribe to push notifications:", error)
        return null
      }
    }

    // Store the subscription in the database
    await saveSubscription(userId, subscription)

    return subscription
  } catch (error) {
    console.error("Error subscribing to push notifications:", error)
    return null
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(userId: string) {
  if (!isPushNotificationSupported()) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
      await deleteSubscription(userId, subscription.endpoint)
      return true
    }

    return false
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error)
    return false
  }
}

// Check if the user is subscribed to push notifications
export async function isSubscribedToPushNotifications() {
  if (!isPushNotificationSupported()) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return !!subscription
  } catch (error) {
    console.error("Error checking push notification subscription:", error)
    return false
  }
}

// Save the subscription to the database
async function saveSubscription(userId: string, subscription: PushSubscription) {
  try {
    // Extract the necessary data from the subscription
    const subscriptionJSON = subscription.toJSON()
    const endpoint = subscriptionJSON.endpoint
    const p256dh = subscriptionJSON.keys?.p256dh
    const auth = subscriptionJSON.keys?.auth

    if (!endpoint || !p256dh || !auth) {
      console.error("Invalid subscription data")
      return false
    }

    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: userId,
        endpoint,
        p256dh,
        auth,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "endpoint",
      },
    )

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error saving push subscription:", error)
    return false
  }
}

// Delete the subscription from the database
async function deleteSubscription(userId: string, endpoint: string) {
  try {
    const { error } = await supabase.from("push_subscriptions").delete().eq("user_id", userId).eq("endpoint", endpoint)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting push subscription:", error)
    return false
  }
}
