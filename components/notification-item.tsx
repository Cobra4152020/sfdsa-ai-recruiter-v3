"use client";

import type React from "react";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/lib/notification-service";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead } = useNotifications();
  const [isHovering, setIsHovering] = useState(false);

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await markAsRead(notification.id);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "badge":
        return "/generic-badge.png";
      case "donation":
        return "/donation-icon.png"; // You'll need to add this icon
      case "achievement":
        return "/achievement-icon.png"; // You'll need to add this icon
      default:
        return "/notification-icon.png"; // You'll need to add this icon
    }
  };

  const formattedTime = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  const NotificationContent = () => (
    <div
      className={cn(
        "flex items-start p-4 hover:bg-accent/10 dark:hover:bg-gray-700/50 transition-colors",
        !notification.is_read && "bg-blue-50/50 dark:bg-blue-900/10",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex-shrink-0 mr-3">
        {notification.image_url ? (
          <Image
            src={notification.image_url || "/placeholder.svg"}
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <Image
            src={getIconForType(notification.type) || "/placeholder.svg"}
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4
            className={cn(
              "text-sm font-medium",
              !notification.is_read && "font-semibold",
            )}
          >
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            {formattedTime}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {notification.message}
        </p>

        {!notification.is_read && isHovering && (
          <div className="mt-2 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAsRead}
              className="text-xs h-7 px-2"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark as read
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (notification.action_url) {
    return (
      <Link href={notification.action_url} className="block">
        <NotificationContent />
      </Link>
    );
  }

  return <NotificationContent />;
}
