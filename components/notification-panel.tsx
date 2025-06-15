"use client";

import React, { useState, useEffect } from "react";
// import { Bell, X, Check, Clock, User, MessageSquare } from "lucide-react"; // Commented out unused imports
import { X } from "lucide-react"; // Only using X icon
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Commented out unused imports
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Commented out unused imports
// import { ScrollArea } from "@/components/ui/scroll-area"; // Commented out unused import
// import { useExternalNavigation } from "@/hooks/use-external-navigation"; // Commented out unused import
import { getClientSideSupabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
// import { Button } from "@/components/ui/button"; // Commented out unused import
// import { NotificationItem } from "./notification-item"; // Commented out unused import
// import type { Notification as NotificationType } from "@/lib/notification-service"; // Commented out unused import

// A more robust Notification interface based on likely database columns
interface Notification {
  id: number;
  user_id: string;
  created_at: string;
  title: string;
  message: string;
  is_read?: boolean; // Optional to handle both cases
  read?: boolean; // Optional for backwards compatibility
  action_url?: string;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationPanelProps {
  userId: string;
  onClose: () => void;
}

export function NotificationPanel({ userId, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  // const router = useRouter(); // Commented out unused variable

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const supabase = getClientSideSupabase();
        const query = supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10);

        const { data, error } = await query;

        if (error) {
          console.warn("Error fetching notifications:", error);
          setNotifications([]);
        } else {
          setNotifications(data || []);
        }
      } catch (error) {
        console.warn("Exception fetching notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId: number) => {
    try {
      // Try to update is_read column first
      const supabase = getClientSideSupabase();
      const result = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (result.error) {
        // If that fails, try with read column
        await supabase
          .from("notifications")
          .update({ read: true })
          .eq("id", notificationId);
      }

      // Update the local state
      setNotifications(
        notifications.map((notification) => {
          if (notification.id === notificationId) {
            return { ...notification, is_read: true, read: true };
          }
          return notification;
        }),
      );
    } catch (error) {
      console.warn("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Try to update is_read column first
      const supabase = getClientSideSupabase();
      const result = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .in(
          "id",
          notifications.filter((n) => !(n.is_read || n.read)).map((n) => n.id),
        );

      if (result.error) {
        // If that fails, try with read column
        await supabase
          .from("notifications")
          .update({ read: true })
          .eq("user_id", userId)
          .in(
            "id",
            notifications
              .filter((n) => !(n.is_read || n.read))
              .map((n) => n.id),
          );
      }

      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          is_read: true,
          read: true,
        })),
      );
    } catch (error) {
      console.warn("Error marking all notifications as read:", error);
    }
  };

  const isUnread = (notification: Notification) => {
    // Check both possible column names
    return !(notification.is_read || notification.read);
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    if (notification.action_url) {
      navigateTo(notification.action_url);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-md shadow-lg overflow-hidden z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium">Notifications</h3>
        <div className="flex">
          {notifications.some(isUnread) && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 mr-4"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 border-b last:border-b-0 hover:bg-gray-50 ${
                  isUnread(notification) ? "bg-blue-50" : ""
                }`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{notification.title}</h4>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        )}
      </div>
    </div>
  );
}
