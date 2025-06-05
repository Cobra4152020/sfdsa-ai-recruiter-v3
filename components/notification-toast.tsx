"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@supabase/supabase-js";
import { useUserContext } from "@/context/user-context";
import Image from "next/image";
import type { Notification } from "@/lib/notification-service";

export function NotificationToastListener() {
  const { toast } = useToast();
  const { currentUser } = useUserContext();

  useEffect(() => {
    if (!currentUser?.id) return;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Subscribe to notifications table changes
    const subscription = supabase
      .channel("notification-toasts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          const notification = payload.new as Notification;

          // Show toast notification
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
            action: notification.action_url ? (
              <a
                href={notification.action_url}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
              >
                View
              </a>
            ) : undefined,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentUser?.id, toast]);

  return null;
}

export function NotificationToast({
  title,
  message,
  type = "default",
  onClose,
  actionUrl,
  actionLabel = "View",
}: {
  title: string;
  message: string;
  type?: "default" | "badge" | "donation";
  onClose: () => void;
  actionUrl?: string;
  actionLabel?: string;
}) {
  const getIconForType = (type: string) => {
    switch (type) {
      case "badge":
        return "/generic-badge.png";
      case "donation":
        return "/donation-icon.png";
      default:
        return "/notification-icon.png";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-[#FFD700]/30 p-4 max-w-md w-full pointer-events-auto"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <Image
            src={getIconForType(type) || "/placeholder.svg"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h4>
            <button
              type="button"
              className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
          {actionUrl && (
            <div className="mt-3">
              <a
                href={actionUrl}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90"
              >
                {actionLabel}
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
