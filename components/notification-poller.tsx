"use client"

import { useEffect, useRef } from "react"
import { getClientSideSupabase } from "@/lib/supabase"

interface NotificationPollerProps {
  userId: string
  interval?: number // in milliseconds
}

export function NotificationPoller({ userId, interval = 30000 }: NotificationPollerProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!userId) return

    // Function to check for new notifications
    const checkNotifications = async () => {
      try {
        // Get the Supabase client
        const supabase = getClientSideSupabase()

        // Get pending notifications from the queue
        const { data: notifications, error } = await supabase
          .from("push_notification_queue")
          .select(`
            id, 
            payload,
            push_subscriptions!inner(user_id)
          `)
          .eq("push_subscriptions.user_id", userId)
          .eq("status", "pending")
          .order("created_at", { ascending: true })
          .limit(5)

        if (error) {
          console.warn("Error fetching notifications:", error)
          return
        }

        if (!notifications || notifications.length === 0) {
          return
        }

        // Process each notification
        for (const notification of notifications) {
          try {
            // Show the notification
            if (Notification && Notification.permission === "granted") {
              const payload = notification.payload

              // Display the notification
              new Notification(payload.title, {
                body: payload.message,
                icon: payload.icon || "/notification-icon.png",
                badge: payload.badge || "/sfdsa-logo.png",
                tag: payload.tag || "default",
                data: {
                  url: payload.actionUrl || "/",
                },
              })

              // Mark the notification as delivered
              await supabase
                .from("push_notification_queue")
                .update({
                  status: "delivered",
                  processed_at: new Date().toISOString(),
                })
                .eq("id", notification.id)
            }
          } catch (notifError) {
            console.warn("Error processing notification:", notifError)

            // Mark the notification as failed
            await supabase
              .from("push_notification_queue")
              .update({
                status: "failed",
                processed_at: new Date().toISOString(),
                error: notifError.message,
              })
              .eq("id", notification.id)
          }
        }
      } catch (error) {
        console.warn("Error in notification poller:", error)
      }
    }

    // Check immediately on mount
    checkNotifications()

    // Set up interval for checking
    timerRef.current = setInterval(checkNotifications, interval)

    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [userId, interval])

  // This component doesn't render anything
  return null
}
