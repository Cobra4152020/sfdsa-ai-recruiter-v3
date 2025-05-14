import { supabase } from "@/lib/supabase-client"

// Check if the browser supports notifications
export function isNotificationSupported() {
  return "Notification" in window
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return "denied"
  }

  return await Notification.requestPermission()
}

// Register the service worker
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
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

// Save notification preferences
export async function saveNotificationPreferences(userId: string, enabled: boolean) {
  if (!userId) return false

  try {
    const { error } = await supabase.from("user_notification_settings").upsert(
      {
        user_id: userId,
        push_notifications: enabled,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    )

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error saving notification preferences:", error)
    return false
  }
}

// Get notification preferences
export async function getNotificationPreferences(userId: string) {
  if (!userId) return { push_notifications: false }

  try {
    const { data, error } = await supabase
      .from("user_notification_settings")
      .select("push_notifications")
      .eq("user_id", userId)
      .single()

    if (error) throw error
    return data || { push_notifications: false }
  } catch (error) {
    console.error("Error getting notification preferences:", error)
    return { push_notifications: false }
  }
}

// Check if notifications are enabled
export async function areNotificationsEnabled(userId: string): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false
  }

  // Check browser permission
  if (Notification.permission !== "granted") {
    return false
  }

  // Check user preferences
  const prefs = await getNotificationPreferences(userId)
  return prefs.push_notifications
}

// Enable notifications
export async function enableNotifications(userId: string): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false
  }

  try {
    // Request permission if needed
    if (Notification.permission !== "granted") {
      const permission = await requestNotificationPermission()
      if (permission !== "granted") {
        return false
      }
    }

    // Register service worker
    const registration = await registerServiceWorker()
    if (!registration) {
      return false
    }

    // Save preferences
    return await saveNotificationPreferences(userId, true)
  } catch (error) {
    console.error("Error enabling notifications:", error)
    return false
  }
}

// Disable notifications
export async function disableNotifications(userId: string): Promise<boolean> {
  try {
    return await saveNotificationPreferences(userId, false)
  } catch (error) {
    console.error("Error disabling notifications:", error)
    return false
  }
}
