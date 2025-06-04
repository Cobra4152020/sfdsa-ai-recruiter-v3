"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, TrendingUp } from "lucide-react";
import type { DonationStats } from "@/app/types/donation-analytics";

interface DonationStatsCardsProps {
  data: DonationStats;
}

export function DonationStatsCards({ data }: DonationStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.totalDonations.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {data.monthlyGrowth > 0 ? (
              <span className="text-green-500">
                ↑ {data.monthlyGrowth}% this month
              </span>
            ) : (
              <span className="text-red-500">
                ↓ {Math.abs(data.monthlyGrowth)}% this month
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.totalDonors.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {data.recurringDonors} recurring donors
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Donation
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.averageDonation.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {data.conversionRate}% conversion rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.totalPoints.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {data.activePrograms} active programs
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
