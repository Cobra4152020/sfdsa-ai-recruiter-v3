"use client"

import type React from "react"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationItem } from "@/components/notification-item"
import type { Notification } from "@/lib/notification-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NotificationPanelProps {
  notifications: Notification[]
  onMarkAllAsRead: (e: React.MouseEvent) => void
  onClose: () => void
}

export function NotificationPanel({ notifications, onMarkAllAsRead, onClose }: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState("all")

  const unreadNotifications = notifications.filter((n) => !n.is_read)
  const hasUnread = unreadNotifications.length > 0

  const filteredNotifications = activeTab === "unread" ? unreadNotifications : notifications

  const badgeNotifications = notifications.filter((n) => n.type === "badge")
  const donationNotifications = notifications.filter((n) => n.type === "donation")

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg">Notifications</h3>
        <div className="flex items-center space-x-2">
          {hasUnread && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="text-xs flex items-center">
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
              <span className="ml-1 text-xs text-gray-500">({notifications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread
              <span className="ml-1 text-xs text-gray-500">({unreadNotifications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex-1">
              Badges
              <span className="ml-1 text-xs text-gray-500">({badgeNotifications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex-1">
              Donations
              <span className="ml-1 text-xs text-gray-500">({donationNotifications.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <NotificationList notifications={notifications} />
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
          <NotificationList notifications={unreadNotifications} />
        </TabsContent>

        <TabsContent value="badges" className="mt-0">
          <NotificationList notifications={badgeNotifications} />
        </TabsContent>

        <TabsContent value="donations" className="mt-0">
          <NotificationList notifications={donationNotifications} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationList({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) {
    return <div className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">No notifications to display</div>
  }

  return (
    <ScrollArea className="h-[350px]">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </ScrollArea>
  )
}
