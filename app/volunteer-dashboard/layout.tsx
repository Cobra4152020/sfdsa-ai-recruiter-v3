import type React from "react"
import type { Metadata } from "next"
import { VolunteerAuthCheck } from "@/components/volunteer/volunteer-auth-check"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"

export const metadata: Metadata = {
  title: "Volunteer Recruiter Dashboard | SF Deputy Sheriff",
  description: "Manage your volunteer recruitment activities for the San Francisco Deputy Sheriff's Office",
}

export default function VolunteerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ImprovedHeader />
      <VolunteerAuthCheck>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </VolunteerAuthCheck>
      <ImprovedFooter />
    </>
  )
}
