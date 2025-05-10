"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, BellOff, CheckCircle, XCircle } from "lucide-react"
import {
  isNotificationSupported,
  areNotificationsEnabled,
  enableNotifications,
  disableNotifications,
} from "@/lib/push-notification-service"

interface PushNotificationPermissionProps {
  userId: string
}

export function PushNotificationPermission({ userId }: PushNotificationPermissionProps) {
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkStatus = async () => {
      const isSupported = isNotificationSupported()
      setSupported(isSupported)

      if (isSupported && userId) {
        const isEnabled = await areNotificationsEnabled(userId)
        setEnabled(isEnabled)
      }

      setLoading(false)
    }

    checkStatus()
  }, [userId])

  const handleEnable = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await enableNotifications(userId)
      setEnabled(result)

      if (!result) {
        setError("Failed to enable notifications. Please check your browser settings.")
      }
    } catch (err) {
      console.error("Error enabling notifications:", err)
      setError("An error occurred while enabling notifications.")
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await disableNotifications(userId)
      setEnabled(!result)

      if (!result) {
        setError("Failed to disable notifications.")
      }
    } catch (err) {
      console.error("Error disabling notifications:", err)
      setError("An error occurred while disabling notifications.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Checking notification support...</div>
  }

  if (!supported) {
    return (
      <Alert variant="destructive">
        <BellOff className="h-4 w-4" />
        <AlertTitle>Not Supported</AlertTitle>
        <AlertDescription>Notifications are not supported in your browser.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {enabled && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Notifications Enabled</AlertTitle>
          <AlertDescription>You will receive notifications about important updates.</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={enabled ? handleDisable : handleEnable}
        disabled={loading}
        variant={enabled ? "outline" : "default"}
        className="w-full"
      >
        {loading ? (
          "Processing..."
        ) : enabled ? (
          <>
            <BellOff className="mr-2 h-4 w-4" /> Disable Notifications
          </>
        ) : (
          <>
            <Bell className="mr-2 h-4 w-4" /> Enable Notifications
          </>
        )}
      </Button>
    </div>
  )
}
