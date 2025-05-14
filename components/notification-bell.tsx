"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function NotificationBell() {
  const [notificationCount, setNotificationCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
    if (notificationCount > 0) {
      setNotificationCount(0)
    }
  }

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
        {notificationCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 p-0 text-xs bg-red-500"
            variant="destructive"
          >
            {notificationCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-80 mt-2 overflow-hidden bg-white rounded-md shadow-lg">
          <div className="p-3 font-medium border-b">Notifications</div>
          <div className="p-4 text-center text-gray-500">
            <p>No new notifications</p>
          </div>
        </div>
      )}
    </div>
  )
}
