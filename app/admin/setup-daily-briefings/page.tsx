import { createClient } from "@/app/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function SetupDailyBriefingsPage() {
  const supabase = await createClient();

  const { data: briefings } = await supabase
    .from("daily_briefings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Setup Daily Briefings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Initialize Daily Briefings Table</CardTitle>
            <CardDescription>
              Create the daily_briefings table in your database if it
              doesn&apos;t exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This page sets up the daily briefings system for the SF Deputy
              Sheriff&apos;s Association recruitment platform.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              This will check if the daily_briefings table exists in your
              database. If it doesn&apos;t, it will create the table with the
              necessary structure and RLS policies.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Briefings</CardTitle>
            <CardDescription>
              View and manage your daily briefings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {briefings && briefings.length > 0 ? (
              <div className="space-y-4">
                {briefings.map((briefing) => (
                  <div
                    key={briefing.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <h3 className="font-semibold">{briefing.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {briefing.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(briefing.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Briefings Found</AlertTitle>
                <AlertDescription>
                  There are no daily briefings set up yet. Use the
                  initialization tool above to create the table.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
