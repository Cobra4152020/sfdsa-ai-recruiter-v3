"use client"

import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { useUser } from "@/context/user-context"
import { Award, Heart } from "lucide-react"

export function NotificationToastListener() {
  const { currentUser } = useUser()
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (!currentUser?.id || isSubscribed) return

    // Subscribe to new notifications for this user
    const channel = supabase
      .channel(`notifications:${currentUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          const notification = payload.new

          // Show toast notification
          toast({
            title: notification.title,
            description: notification.message,
            icon:
              notification.type === "badge" ? (
                <Award className="h-4 w-4 text-blue-500" />
              ) : (
                <Heart className="h-4 w-4 text-red-500" />
              ),
            duration: 5000,
          })
        },
      )
      .subscribe()

    setIsSubscribed(true)

    return () => {
      supabase.removeChannel(channel)
      setIsSubscribed(false)
    }
  }, [currentUser, isSubscribed])

  return null
}
