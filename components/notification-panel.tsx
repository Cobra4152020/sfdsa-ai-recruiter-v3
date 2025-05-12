"use client"

import { useState, useEffect } from "react"
import { NotificationItem } from "./notification-item"
import { Loader2 } from "lucide-react"

interface NotificationPanelProps {
  userId: string
  onClose: () => void
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  created_at: string
  read: boolean
  action_url?: string
  icon?: string
}

export function NotificationPanel({ userId, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError(null)

        // Import dynamically to avoid issues during SSR
        const { supabase } = await import("@/lib/supabase-client-singleton")

        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) {
          console.warn("Error fetching notifications:", error)
          setError("Failed to load notifications")
          return
        }

        setNotifications(data || [])
      } catch (error) {
        console.warn("Exception fetching notifications:", error)
        setError("Failed to load notifications")
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [userId])

  const markAsRead = async (notificationId: string) => {
    try {
      // Import dynamically to avoid issues during SSR
      const { supabase } = await import("@/lib/supabase-client-singleton")

      await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } catch (error) {
      console.warn("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // Import dynamically to avoid issues during SSR
      const { supabase } = await import("@/lib/supabase-client-singleton")

      await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false)

      // Update local state
      setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    } catch (error) {
      console.warn("Error marking all notifications as read:", error)
    }
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
      <div className="p-3 bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-800 dark:text-white">Notifications</h3>
        {notifications.length > 0 && (
          <button onClick={markAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications yet</div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={() => markAsRead(notification.id)}
              onClick={onClose}
            />
          ))
        )}
      </div>
    </div>
  )
}
