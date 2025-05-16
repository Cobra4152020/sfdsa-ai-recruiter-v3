"use client"

import { Suspense } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStatsWrapper } from "@/components/admin/dashboard-stats-wrapper"
import { TiktokChallengesWrapper } from "@/components/admin/tiktok-challenges-wrapper"
import { RecentApplicantsWrapper } from "@/components/admin/recent-applicants-wrapper"

export default function SecureDashboardPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8 text-[#0A3C1F]">Secure Admin Dashboard</h1>

        <div className="mb-8">
          <Suspense fallback={<div>Loading stats...</div>}>
            <DashboardStatsWrapper />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Active TikTok Challenges</CardTitle>
              <CardDescription>Currently active challenges for users</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading challenges...</div>}>
                <TiktokChallengesWrapper />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applicants</CardTitle>
              <CardDescription>Latest applicants in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading applicants...</div>}>
                <RecentApplicantsWrapper />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
