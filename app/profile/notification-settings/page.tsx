"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import ImprovedHeader from "@/components/improved-header"

interface NotificationSettings {
  email_notifications: boolean
  push_notifications: boolean
  achievement_notifications: boolean
  reminder_notifications: boolean
  system_notifications: boolean
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    achievement_notifications: true,
    reminder_notifications: true,
    system_notifications: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchSettings() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from("user_notification_settings")
        .select("*")
        .eq("user_id", session.user.id)
        .single()

      if (!error && data) {
        setSettings(data)
      }

      setIsLoading(false)
    }

    fetchSettings()
  }, [supabase])

  const handleToggle = (setting: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const saveSettings = async () => {
    setIsSaving(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error("Not authenticated")

      const { error } = await supabase.from("user_notification_settings").upsert({
        user_id: session.user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      })
    } catch (error) {
      console.error("Error saving notification settings:", error)
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <ImprovedHeader />
        <div className="container px-4 py-8 mx-auto">
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ImprovedHeader />
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Notification Settings</h1>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Manage Your Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Delivery Methods</h3>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={() => handleToggle("email_notifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-base">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.push_notifications}
                  onCheckedChange={() => handleToggle("push_notifications")}
                />
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <h3 className="text-lg font-medium">Notification Types</h3>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="achievement-notifications" className="text-base">
                    Achievements
                  </Label>
                  <p className="text-sm text-gray-500">Points, badges, and rewards</p>
                </div>
                <Switch
                  id="achievement-notifications"
                  checked={settings.achievement_notifications}
                  onCheckedChange={() => handleToggle("achievement_notifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminder-notifications" className="text-base">
                    Reminders
                  </Label>
                  <p className="text-sm text-gray-500">Upcoming events and deadlines</p>
                </div>
                <Switch
                  id="reminder-notifications"
                  checked={settings.reminder_notifications}
                  onCheckedChange={() => handleToggle("reminder_notifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-notifications" className="text-base">
                    System Updates
                  </Label>
                  <p className="text-sm text-gray-500">Important announcements and system changes</p>
                </div>
                <Switch
                  id="system-notifications"
                  checked={settings.system_notifications}
                  onCheckedChange={() => handleToggle("system_notifications")}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={saveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
