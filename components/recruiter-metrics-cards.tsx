"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Percent,
  Clock,
  FileText,
  MousePointer,
  TrendingUp,
} from "lucide-react";

interface RecruiterMetricsCardsProps {
  metrics: {
    totalReferrals: number;
    activeReferrals: number;
    conversionRate: number;
    averageTimeToHire: number;
    totalHires: number;
    pendingApplications: number;
    totalClicks: number;
    clickToReferralRate: number;
    totalApplications: number;
    newApplicationsThisWeek: number;
    qualifiedCandidates: number;
  };
}

export function RecruiterMetricsCards({ metrics }: RecruiterMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 bg-card border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Applications
            </p>
            <h3 className="text-2xl font-bold text-foreground">
              {metrics.totalApplications.toLocaleString()}
            </h3>
            <p className="text-xs text-muted-foreground">
              +{metrics.newApplicationsThisWeek} this week
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Qualified Candidates
            </p>
            <h3 className="text-2xl font-bold text-foreground">
              {metrics.qualifiedCandidates.toLocaleString()}
            </h3>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (metrics.qualifiedCandidates / metrics.totalApplications) * 100
              )}% 
              qualification rate
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Hires</p>
              <h3 className="text-2xl font-bold text-[#0A3C1F]">
                {metrics.totalHires}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-[#0A3C1F]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Referrals who were successfully hired
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Conversion Rate
              </p>
              <h3 className="text-2xl font-bold text-[#0A3C1F]">
                {metrics.conversionRate}%
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
              <Percent className="h-6 w-6 text-[#0A3C1F]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Percentage of referrals who were hired
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Avg Time to Hire
              </p>
              <h3 className="text-2xl font-bold text-[#0A3C1F]">
                {metrics.averageTimeToHire} days
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-[#0A3C1F]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Average days from referral to hire
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Referrals
              </p>
              <h3 className="text-2xl font-bold text-[#0A3C1F]">
                {metrics.activeReferrals}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-[#0A3C1F]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Referrals currently in the hiring process
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Applications
              </p>
              <h3 className="text-2xl font-bold text-[#0A3C1F]">
                {metrics.pendingApplications}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#0A3C1F]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Referrals who have submitted applications
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Link Clicks
              </p>
              <h3 className="text-2xl font-bold text-[#0A3C1F]">
                {metrics.totalClicks}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
              <MousePointer className="h-6 w-6 text-[#0A3C1F]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Number of clicks on your referral links
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Click-to-Referral Rate
              </p>
              <h3 className="text-2xl font-bold text-[#0A3C1F]">
                {metrics.clickToReferralRate}%
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#0A3C1F]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Percentage of clicks that become referrals
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
