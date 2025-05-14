import NotificationSettingsClient from "@/components/notification-system/notification-settings-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notification Settings | SF Deputy Sheriff's Association",
  description: "Manage your notification preferences",
}

export default function NotificationSettingsPage() {
  return <NotificationSettingsClient />
}
