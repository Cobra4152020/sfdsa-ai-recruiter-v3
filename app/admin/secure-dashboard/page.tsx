"use client";

import { Suspense } from "react";
import { PageWrapper } from "@/components/page-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardStatsWrapper } from "@/components/admin/dashboard-stats-wrapper";
import { TikTokChallengesAdmin } from "@/components/admin/tiktok-challenges-admin";
import { RecentApplicantsWrapper } from "@/components/admin/recent-applicants-wrapper";

const mockStats = {
  totalApplicants: 1250,
  qualifiedCandidates: 850,
  processingTime: "14 days",
  conversionRate: "68%",
};

const mockApplicants = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "pending" as const,
    appliedDate: "2024-03-20",
    position: "Deputy Sheriff Trainee",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    status: "approved" as const,
    appliedDate: "2024-03-19",
    position: "Deputy Sheriff Trainee",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    status: "pending" as const,
    appliedDate: "2024-03-18",
    position: "Deputy Sheriff Trainee",
  },
];

export default function SecureDashboardPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          Secure Admin Dashboard
        </h1>

        <div className="mb-8">
          <Suspense fallback={<div>Loading stats...</div>}>
            <DashboardStatsWrapper stats={mockStats} />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Active TikTok Challenges</CardTitle>
              <CardDescription>
                Currently active challenges for users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading challenges...</div>}>
                <TikTokChallengesAdmin />
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
                <RecentApplicantsWrapper applicants={mockApplicants} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
