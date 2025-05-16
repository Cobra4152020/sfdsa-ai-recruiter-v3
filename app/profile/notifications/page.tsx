"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { PushNotificationPermission } from "@/components/push-notification-permission"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function NotificationPreferencesPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push("/login?redirect=/profile/notifications")
        return
      }

      setUserId(session.user.id)
    }

    checkSession()
  }, [router, supabase])

  if (!userId) {
    return null // Or a loading spinner
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Notification Preferences</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>Receive notifications even when you're not using the site</CardDescription>
          </CardHeader>
          <CardContent>
            <PushNotificationPermission userId={userId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Manage which emails you receive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-badges">Badge Achievements</Label>
                  <p className="text-sm text-muted-foreground">Receive emails when you earn new badges</p>
                </div>
                <Switch id="email-badges" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-donations">Donation Receipts</Label>
                  <p className="text-sm text-muted-foreground">Receive email receipts for your donations</p>
                </div>
                <Switch id="email-donations" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-news">News & Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive occasional updates about the platform</p>
                </div>
                <Switch id="email-news" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
