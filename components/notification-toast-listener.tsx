"use client"

import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { getClientSideSupabase } from '@/lib/supabase/index'
import { useUser } from "@/context/user-context"
import { Award, Heart } from "lucide-react"

export function NotificationToastListener() {
  const { currentUser } = useUser()
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (!currentUser?.id || isSubscribed) return

    // Subscribe to new notifications for this user
    const channel = getClientSideSupabase()
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
            duration: 5000,
          })
        },
      )
      .subscribe()

    setIsSubscribed(true)

    return () => {
      getClientSideSupabase().removeChannel(channel)
      setIsSubscribed(false)
    }
  }, [currentUser, isSubscribed])

  return null
}
