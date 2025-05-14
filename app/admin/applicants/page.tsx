import { Suspense } from "react"
import { ApplicantDashboard } from "@/components/admin/applicant-dashboard"
import { AdminAuthCheck } from "@/components/admin/admin-auth-check"

export const metadata = {
  title: "Applicant Management | SFDSA Admin",
  description: "Manage applicant data and track recruitment progress",
}

export default function ApplicantsAdminPage() {
  return (
    <AdminAuthCheck>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Applicant Management</h1>
        <Suspense fallback={<div className="text-center py-10">Loading applicant data...</div>}>
          <ApplicantDashboard />
        </Suspense>
      </div>
    </AdminAuthCheck>
  )
}
