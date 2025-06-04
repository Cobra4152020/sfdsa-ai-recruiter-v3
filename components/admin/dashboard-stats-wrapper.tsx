"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, Award, Clock, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalApplicants: number;
  qualifiedCandidates: number;
  processingTime: string;
  conversionRate: string;
}

interface DashboardStatsWrapperProps {
  stats: DashboardStats;
}

export function DashboardStatsWrapper({ stats }: DashboardStatsWrapperProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Total Applicants
            </CardTitle>
            <CardDescription>All time applications</CardDescription>
          </div>
          <Users className="h-4 w-4 text-[#0A3C1F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalApplicants}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Qualified Candidates
            </CardTitle>
            <CardDescription>Meeting requirements</CardDescription>
          </div>
          <Award className="h-4 w-4 text-[#0A3C1F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.qualifiedCandidates}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Avg. Processing Time
            </CardTitle>
            <CardDescription>Application to decision</CardDescription>
          </div>
          <Clock className="h-4 w-4 text-[#0A3C1F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.processingTime}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <CardDescription>Qualified to hired</CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-[#0A3C1F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.conversionRate}</div>
        </CardContent>
      </Card>
    </div>
  );
}
