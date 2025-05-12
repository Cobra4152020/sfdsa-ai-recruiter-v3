import { SetupDailyBriefingButton } from "@/components/admin/setup-daily-briefing-button"
import { AdminAuthCheck } from "@/components/admin/admin-auth-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SetupDailyBriefingPage() {
  return (
    <AdminAuthCheck>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Setup Daily Briefing System</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Daily Briefing System Setup</CardTitle>
            <CardDescription>
              Set up Sgt. Ken's Daily Briefing System to engage recruits and increase participation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>This setup process will:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create the necessary database tables for daily briefings</li>
                <li>Set up attendance tracking for users</li>
                <li>Configure the points system integration</li>
                <li>Initialize the streak tracking system</li>
                <li>Create a sample briefing for today</li>
              </ul>

              <div className="mt-6">
                <SetupDailyBriefingButton />
              </div>

              <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                <p>
                  After setup, you can manage briefings from the{" "}
                  <Link href="/admin/daily-briefings" className="text-blue-600 hover:underline">
                    Daily Briefings Admin page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminAuthCheck>
  )
}
