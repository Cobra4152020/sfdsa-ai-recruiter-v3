import type React from "react"
import { VolunteerAuthCheck } from "@/components/volunteer/volunteer-auth-check"

export default function VolunteerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <VolunteerAuthCheck>{children}</VolunteerAuthCheck>
}
