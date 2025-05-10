import { supabase } from "@/lib/supabase-client"

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  action_url?: string
  image_url?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  if (!userId) return []

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  if (!userId) return 0

  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return 0
  }
}

export async function markAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq("id", notificationId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return false
  }
}

export async function markAllAsRead(userId: string): Promise<boolean> {
  if (!userId) return false

  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return false
  }
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  actionUrl,
  imageUrl,
  metadata,
}: {
  userId: string
  type: string
  title: string
  message: string
  actionUrl?: string
  imageUrl?: string
  metadata?: Record<string, any>
}): Promise<Notification | null> {
  if (!userId) return null

  try {
    const notification = {
      user_id: userId,
      type,
      title,
      message,
      is_read: false,
      action_url: actionUrl,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata,
    }

    const { data, error } = await supabase.from("notifications").insert(notification).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}

export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting notification:", error)
    return false
  }
}

export async function deleteAllNotifications(userId: string): Promise<boolean> {
  if (!userId) return false

  try {
    const { error } = await supabase.from("notifications").delete().eq("user_id", userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting all notifications:", error)
    return false
  }
}
