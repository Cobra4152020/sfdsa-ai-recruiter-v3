"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { NotificationPanel } from "./notification-panel"
import { useClickOutside } from "@/hooks/use-click-outside"

interface NotificationBellProps {
  userId: string
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false))

  useEffect(() => {
    // Only try to fetch notifications if we have a userId
    if (!userId) return

    const fetchUnreadCount = async () => {
      try {
        const { getClientSideSupabase } = require("@/lib/supabase")
        const supabase = getClientSideSupabase()

        // Try with is_read first (this appears to be the correct column name)
        const { data: isReadData, error: isReadError } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", userId)
          .eq("is_read", false)
          .limit(100)

        // If that fails, try with read column
        if (isReadError) {
          console.warn("Error fetching notifications with is_read, trying read column:", isReadError)

          const { data: readData, error: readError } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", userId)
            .eq("read", false)
            .limit(100)

          if (readError) {
            console.warn("Error fetching unread count:", readError)
            return
          }

          setUnreadCount(readData?.length || 0)
          return
        }

        setUnreadCount(isReadData?.length || 0)
      } catch (error) {
        console.warn("Exception fetching unread count:", error)
      }
    }

    fetchUnreadCount()

    // Set up a polling interval to check for new notifications
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [userId])

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={togglePanel}
        className="relative p-1 rounded-full hover:bg-white/10 transition-colors"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && <NotificationPanel userId={userId} onClose={() => setIsOpen(false)} />}
    </div>
  )
}
