import { getServiceSupabase } from "@/app/lib/supabase/server"

export type NotificationType = "donation" | "badge" | "system" | "achievement"

export interface Notification {
  id: number
  user_id: string
  type: NotificationType
  title: string
  message: string
  image_url?: string
  action_url?: string
  is_read: boolean
  created_at: string
  metadata?: Record<string, any>
}

export interface CreateNotificationParams {
  user_id: string
  type: NotificationType
  title: string
  message: string
  image_url?: string
  action_url?: string
  metadata?: Record<string, any>
}

export async function createNotification(params: CreateNotificationParams): Promise<Notification | null> {
  try {
    const supabase = getServiceSupabase()

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: params.user_id,
        type: params.type,
        title: params.title,
        message: params.message,
        image_url: params.image_url,
        action_url: params.action_url,
        metadata: params.metadata || {},
      })
      .select("*")
      .single()

    if (error) {
      console.error("Error creating notification:", error)
      return null
    }

    return data as Notification
  } catch (error) {
    console.error("Exception creating notification:", error)
    return null
  }
}

export async function getNotifications(
  userId: string,
  limit = 20,
  offset = 0,
  includeRead = false,
): Promise<Notification[]> {
  try {
    const supabase = getServiceSupabase()

    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (!includeRead) {
      query = query.eq("is_read", false)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching notifications:", error)
      return []
    }

    return data as Notification[]
  } catch (error) {
    console.error("Exception fetching notifications:", error)
    return []
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const supabase = getServiceSupabase()

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) {
      console.error("Error fetching unread count:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Exception fetching unread count:", error)
    return 0
  }
}

export async function markAsRead(notificationId: number): Promise<boolean> {
  try {
    const supabase = getServiceSupabase()

    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

    if (error) {
      console.error("Error marking notification as read:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Exception marking notification as read:", error)
    return false
  }
}

export async function markAllAsRead(userId: string): Promise<boolean> {
  try {
    const supabase = getServiceSupabase()

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) {
      console.error("Error marking all notifications as read:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Exception marking all notifications as read:", error)
    return false
  }
}

// Add the missing deleteNotification function
export async function deleteNotification(notificationId: number): Promise<boolean> {
  try {
    const supabase = getServiceSupabase()

    const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

    if (error) {
      console.error("Error deleting notification:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Exception deleting notification:", error)
    return false
  }
}

export async function deleteAllNotifications(userId: string): Promise<boolean> {
  try {
    const supabase = getServiceSupabase()

    const { error } = await supabase.from("notifications").delete().eq("user_id", userId)

    if (error) {
      console.error("Error deleting notifications:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Exception deleting notifications:", error)
    return false
  }
}

// For compatibility with existing code
export async function getUserNotifications(userId: string, limit = 20, offset = 0, includeRead = false) {
  return getNotifications(userId, limit, offset, includeRead)
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return getUnreadCount(userId)
}

export async function markNotificationAsRead(notificationId: number): Promise<boolean> {
  return markAsRead(notificationId)
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  return markAllAsRead(userId)
}
