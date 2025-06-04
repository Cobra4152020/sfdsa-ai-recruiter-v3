import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Trophy, Users, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BadgeAnalytics } from "@/types/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BadgeAnalyticsProps {
  analytics: BadgeAnalytics[];
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: number;
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend !== undefined && (
          <div
            className={cn(
              "text-xs font-medium mt-1",
              trend > 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {trend > 0 ? "+" : ""}
            {trend}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function BadgeAnalytics({ analytics, className }: BadgeAnalyticsProps) {
  const chartData = useMemo(() => {
    return analytics.map((badge) => ({
      name: badge.badgeId,
      earned: badge.totalEarned,
      rate: Math.round(badge.completionRate * 100),
    }));
  }, [analytics]);

  const totalEarned = useMemo(() => {
    return analytics.reduce((sum, badge) => sum + badge.totalEarned, 0);
  }, [analytics]);

  const averageCompletionRate = useMemo(() => {
    const total = analytics.reduce(
      (sum, badge) => sum + badge.completionRate,
      0,
    );
    return Math.round((total / analytics.length) * 100);
  }, [analytics]);

  const averageTimeToEarn = useMemo(() => {
    const times = analytics.map((badge) => {
      const [hours, minutes] = badge.averageTimeToEarn.split(":").map(Number);
      return hours * 60 + minutes;
    });
    const avgMinutes =
      times.reduce((sum, time) => sum + time, 0) / times.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);
    return `${hours}h ${minutes}m`;
  }, [analytics]);

  const mostPopularBadge = useMemo(() => {
    return analytics.reduce((popular, badge) => {
      return badge.popularityScore > popular.popularityScore ? badge : popular;
    }, analytics[0]);
  }, [analytics]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Badges Earned"
          value={totalEarned}
          description="Across all users"
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          trend={12}
        />
        <StatCard
          title="Average Completion Rate"
          value={`${averageCompletionRate}%`}
          description="Of users who start badges"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={-3}
        />
        <StatCard
          title="Average Time to Earn"
          value={averageTimeToEarn}
          description="From start to completion"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Most Popular Badge"
          value={mostPopularBadge?.badgeId || "N/A"}
          description={`${Math.round(mostPopularBadge?.popularityScore || 0)} popularity score`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend={8}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badge Performance</CardTitle>
          <CardDescription>
            Comparison of badge completion rates and total earners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                <Tooltip />
                <Bar
                  yAxisId="left"
                  dataKey="earned"
                  fill="#8884d8"
                  name="Total Earned"
                />
                <Bar
                  yAxisId="right"
                  dataKey="rate"
                  fill="#82ca9d"
                  name="Completion Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
