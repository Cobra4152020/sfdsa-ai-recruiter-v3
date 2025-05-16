import type React from "react"
import type { Metadata } from "next"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"

export const metadata: Metadata = {
  title: "User Dashboard | SF Deputy Sheriff Recruitment",
  description: "Manage your recruitment journey and track your progress with the San Francisco Sheriff's Office.",
}

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ImprovedHeader />
      <main className="flex-1 bg-[#F8F5EE] dark:bg-[#121212] pt-20">{children}</main>
      <ImprovedFooter />
    </div>
  )
}
