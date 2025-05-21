"use client"

import { Suspense } from "react"
import { ApplicantDashboard } from "@/components/admin/applicant-dashboard"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { PageWrapper } from "@/components/page-wrapper"

export default function ApplicantsPageContent() {
  return (
    <AdminAuthCheck>
      <PageWrapper>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Applicant Management</h1>
          <Suspense fallback={<div className="text-center py-10">Loading applicant data...</div>}>
            <ApplicantDashboard />
          </Suspense>
        </div>
      </PageWrapper>
    </AdminAuthCheck>
  )
} 