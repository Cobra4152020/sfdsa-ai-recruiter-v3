import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PushNotificationTester } from "@/components/push-notification-tester";

export const metadata: Metadata = {
  title: "Push Notification Test",
  description: "Test push notifications",
};

export default function PushNotificationTestPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Push Notification Test</h1>

      <Card>
        <CardHeader>
          <CardTitle>Send Test Push Notification</CardTitle>
          <CardDescription>
            Use this form to send a test push notification to a user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PushNotificationTester />
        </CardContent>
      </Card>
    </div>
  );
}
