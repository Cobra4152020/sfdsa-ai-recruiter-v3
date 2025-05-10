import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/supabase-server"
import { PushNotificationPermission } from "@/components/push-notification-permission"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "Notification Preferences",
  description: "Manage your notification preferences",
}

export default async function NotificationPreferencesPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login?redirect=/profile/notifications")
  }

  const userId = session.user.id

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

        <Card>
          <CardHeader>
            <CardTitle>In-App Notifications</CardTitle>
            <CardDescription>Manage which notifications appear in the app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inapp-badges">Badge Achievements</Label>
                  <p className="text-sm text-muted-foreground">Show notifications when you earn new badges</p>
                </div>
                <Switch id="inapp-badges" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inapp-donations">Donation Confirmations</Label>
                  <p className="text-sm text-muted-foreground">Show notifications when your donations are processed</p>
                </div>
                <Switch id="inapp-donations" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inapp-leaderboard">Leaderboard Updates</Label>
                  <p className="text-sm text-muted-foreground">Show notifications about your leaderboard position</p>
                </div>
                <Switch id="inapp-leaderboard" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
