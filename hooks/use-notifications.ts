"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import type { Notification } from "@/lib/notification-service"
import { useToast } from "@/components/ui/use-toast"

export function useNotifications(userId?: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([])
      setUnreadCount(0)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)

      // Fetch notifications
      const { data, error: fetchError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20)

      if (fetchError) throw new Error(fetchError.message)

      setNotifications(data || [])

      // Fetch unread count
      const { data: countData, error: countError } = await supabase
        .from("user_notification_counts")
        .select("unread_count")
        .eq("user_id", userId)
        .single()

      if (countError && countError.code !== "PGRST116") throw new Error(countError.message)

      setUnreadCount(countData?.unread_count || 0)
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [userId, supabase])

  const markAsRead = useCallback(
    async (notificationId: number) => {
      if (!userId) return false

      try {
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", notificationId)
          .eq("user_id", userId)

        if (error) throw new Error(error.message)

        // Update local state
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))

        return true
      } catch (err) {
        console.error("Error marking notification as read:", err)
        return false
      }
    },
    [userId, supabase],
  )

  const markAllAsRead = useCallback(async () => {
    if (!userId) return false

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false)

      if (error) throw new Error(error.message)

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)

      return true
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
      return false
    }
  }, [userId, supabase])

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return

    // Initial fetch
    fetchNotifications()

    // Subscribe to notifications table changes
    const subscription = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification

          // Update notifications list
          setNotifications((prev) => [newNotification, ...prev])

          // Update unread count
          setUnreadCount((prev) => prev + 1)

          // Show toast notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
            duration: 5000,
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [userId, supabase, fetchNotifications, toast])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  }
}
