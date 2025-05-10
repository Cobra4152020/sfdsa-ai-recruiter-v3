"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  type Notification,
} from "@/lib/notification-service"
import { supabase } from "@/lib/supabase-client"

export function useNotifications(userId?: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [notificationsData, count] = await Promise.all([getNotifications(userId), getUnreadCount(userId)])

      setNotifications(notificationsData)
      setUnreadCount(count)
    } catch (err) {
      console.error("Error in useNotifications:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Set up real-time subscription
  useEffect(() => {
    if (!userId || isSubscribed) return

    // Subscribe to changes in the notifications table for this user
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Refetch notifications when changes occur
          fetchNotifications()
        },
      )
      .subscribe()

    setIsSubscribed(true)

    return () => {
      supabase.removeChannel(channel)
      setIsSubscribed(false)
    }
  }, [userId, isSubscribed, fetchNotifications])

  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      if (!userId) return false

      const success = await markAsRead(notificationId)
      if (success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, is_read: true } : notification,
          ),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
      return success
    },
    [userId],
  )

  const handleMarkAllAsRead = useCallback(async () => {
    if (!userId) return false

    const success = await markAllAsRead(userId)
    if (success) {
      setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })))
      setUnreadCount(0)
    }
    return success
  }, [userId])

  const handleDeleteNotification = useCallback(
    async (notificationId: string) => {
      if (!userId) return false

      const notification = notifications.find((n) => n.id === notificationId)
      const success = await deleteNotification(notificationId)

      if (success) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
        if (notification && !notification.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }
      }
      return success
    },
    [userId, notifications],
  )

  const handleDeleteAllNotifications = useCallback(async () => {
    if (!userId) return false

    const success = await deleteAllNotifications(userId)
    if (success) {
      setNotifications([])
      setUnreadCount(0)
    }
    return success
  }, [userId])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    deleteAllNotifications: handleDeleteAllNotifications,
    refresh: fetchNotifications,
  }
}
