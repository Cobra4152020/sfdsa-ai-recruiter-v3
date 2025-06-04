"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Calendar, TrendingUp } from "lucide-react";

export function DashboardStatsWrapper() {
  const stats = [
    {
      title: "Total Applicants",
      value: "Loading...",
      icon: Users,
      change: "+5% from last month",
    },
    {
      title: "Active Challenges",
      value: "Loading...",
      icon: Award,
      change: "3 new this week",
    },
    {
      title: "Upcoming Events",
      value: "Loading...",
      icon: Calendar,
      change: "Next event in 2 days",
    },
    {
      title: "Success Rate",
      value: "Loading...",
      icon: TrendingUp,
      change: "+2% improvement",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.title}
                </h3>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
