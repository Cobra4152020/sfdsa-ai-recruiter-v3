"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, BellOff, CheckCircle, XCircle } from "lucide-react"
import {
  isPushNotificationSupported,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isSubscribedToPushNotifications,
} from "@/lib/push-notification-service"

interface PushNotificationPermissionProps {
  userId: string
}

export function PushNotificationPermission({ userId }: PushNotificationPermissionProps) {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | "unsupported" | null>(null)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSupport = async () => {
      if (!isPushNotificationSupported()) {
        setPermissionStatus("unsupported")
        return
      }

      setPermissionStatus(Notification.permission)
      const subscribed = await isSubscribedToPushNotifications()
      setIsSubscribed(subscribed)
    }

    checkSupport()
  }, [])

  const requestPermission = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission()
        setPermissionStatus(permission)

        if (permission === "granted") {
          const subscription = await subscribeToPushNotifications(userId)
          setIsSubscribed(!!subscription)
        }
      } else if (Notification.permission === "granted" && !isSubscribed) {
        const subscription = await subscribeToPushNotifications(userId)
        setIsSubscribed(!!subscription)
      }
    } catch (err) {
      console.error("Error requesting permission:", err)
      setError("Failed to enable push notifications. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await unsubscribeFromPushNotifications(userId)
      setIsSubscribed(!result)
    } catch (err) {
      console.error("Error unsubscribing:", err)
      setError("Failed to disable push notifications. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (permissionStatus === null) {
    return <div>Checking notification support...</div>
  }

  if (permissionStatus === "unsupported") {
    return (
      <Alert variant="destructive">
        <BellOff className="h-4 w-4" />
        <AlertTitle>Not Supported</AlertTitle>
        <AlertDescription>Push notifications are not supported in your browser.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {permissionStatus === "denied" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Permission Denied</AlertTitle>
          <AlertDescription>
            You have blocked notifications for this site. Please update your browser settings to enable notifications.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {permissionStatus === "granted" && isSubscribed && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Push Notifications Enabled</AlertTitle>
          <AlertDescription>You will receive notifications even when you're not using the site.</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={isSubscribed ? unsubscribe : requestPermission}
        disabled={isLoading || permissionStatus === "denied"}
        variant={isSubscribed ? "outline" : "default"}
        className="w-full"
      >
        {isLoading ? (
          "Processing..."
        ) : isSubscribed ? (
          <>
            <BellOff className="mr-2 h-4 w-4" /> Disable Push Notifications
          </>
        ) : (
          <>
            <Bell className="mr-2 h-4 w-4" /> Enable Push Notifications
          </>
        )}
      </Button>
    </div>
  )
}
