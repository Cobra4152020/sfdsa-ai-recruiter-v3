"use client"

import { useState, useEffect } from "react"
import { Bell, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "achievement" | "reminder" | "system"
  read: boolean
  created_at: string
  action_url?: string
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchNotifications() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from("user_notifications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (!error && data) {
        setNotifications(data)
        setUnreadCount(data.filter((n) => !n.read).length)
      }
    }

    fetchNotifications()

    // Set up real-time subscription
    const {
      data: { session },
    } = supabase.auth.getSession()
    if (session) {
      const channel = supabase
        .channel("user_notifications")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "user_notifications", filter: `user_id=eq.${session.user.id}` },
          (payload) => {
            setNotifications((prev) => [payload.new as Notification, ...prev])
            setUnreadCount((prev) => prev + 1)
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
  }

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("user_notifications").update({ read: true }).eq("id", id)

    if (!error) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const markAllAsRead = async () => {
    const { error } = await supabase.from("user_notifications").update({ read: true }).eq("read", false)

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">🏆</div>
        )
      case "reminder":
        return <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">⏰</div>
      case "system":
        return (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">🔔</div>
        )
      default:
        return <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">📢</div>
    }
  }

  const filteredNotifications = activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 p-0 text-xs bg-red-500"
            variant="destructive"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-80 mt-2 overflow-hidden bg-white rounded-md shadow-lg">
          <div className="flex items-center justify-between p-3 font-medium border-b">
            <h3>Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                  Mark all as read
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-2 border-b">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="achievement">Rewards</TabsTrigger>
                <TabsTrigger value="reminder">Reminders</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="max-h-[400px] overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                <div>
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          {notification.action_url && (
                            <Link href={notification.action_url} className="text-xs text-blue-600 mt-1 block">
                              View details
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No notifications</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="p-2 border-t text-center">
            <Link
              href="/profile/notification-settings"
              className="text-xs text-blue-600 flex items-center justify-center gap-1"
            >
              <Settings className="w-3 h-3" />
              Notification Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
