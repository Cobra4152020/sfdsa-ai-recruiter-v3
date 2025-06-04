"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  UserCheck,
  RefreshCw,
  Clock,
  Users,
  ShieldAlert,
  BarChart3,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

type UserRole = "recruit" | "volunteer" | "admin";
type LoginMethod = "password" | "social" | "magic_link" | "sso";

interface LoginMetrics {
  total_logins: number;
  successful_logins: number;
  failed_logins: number;
  avg_response_time_ms: number;
  unique_users: number;
  by_role: Record<UserRole, number>;
  by_method: Record<LoginMethod, number>;
  recent_errors: Array<{
    created_at: string;
    error_type: string;
    error_message: string;
  }>;
  by_day: Array<{
    day: string;
    count: number;
    success_rate: number;
  }>;
}

export function LoginAuditDashboard() {
  const [metrics, setMetrics] = useState<LoginMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("7d");

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/auth/login-audit?timeRange=${timeRange}`,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch login metrics: ${response.statusText}`,
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch login metrics");
      }

      setMetrics(result.data);
    } catch (err) {
      console.error("Error fetching login metrics:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchMetrics();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading login metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-2" />
        <h3 className="text-lg font-medium">Failed to load metrics</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-2" />
        <h3 className="text-lg font-medium">No data available</h3>
        <p className="text-muted-foreground mb-4">
          Could not load login audit metrics
        </p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    );
  }

  const successRate = (
    (metrics.successful_logins / metrics.total_logins) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Login System Audit</h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <span className="text-sm text-muted-foreground">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none text-sm font-medium focus:outline-none"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Logins
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {metrics.total_logins.toLocaleString()}
                </h3>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </p>
                <h3 className="text-3xl font-bold mt-1">{successRate}%</h3>
              </div>
              <div className="rounded-full bg-green-500/10 p-3">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Response Time
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {metrics.avg_response_time_ms} ms
                </h3>
              </div>
              <div className="rounded-full bg-yellow-500/10 p-3">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Unique Users
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {metrics.unique_users}
                </h3>
              </div>
              <div className="rounded-full bg-blue-500/10 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Login Methods</h3>
            <div className="space-y-4">
              {Object.entries(metrics.by_method).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge
                      variant={
                        method === "password"
                          ? "default"
                          : method === "social"
                            ? "secondary"
                            : "outline"
                      }
                      className="mr-2"
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {((count / metrics.total_logins) * 100).toFixed(1)}% of
                      logins
                    </span>
                  </div>
                  <span className="font-medium">{count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">User Roles</h3>
            <div className="space-y-4">
              {Object.entries(metrics.by_role).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge
                      variant={
                        role === "recruit"
                          ? "default"
                          : role === "volunteer"
                            ? "secondary"
                            : "outline"
                      }
                      className="mr-2"
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {((count / metrics.total_logins) * 100).toFixed(1)}% of
                      logins
                    </span>
                  </div>
                  <span className="font-medium">{count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Login Errors</h3>
            <Badge variant="destructive">{metrics.failed_logins} Errors</Badge>
          </div>
          <div className="space-y-4">
            {metrics.recent_errors.length > 0 ? (
              metrics.recent_errors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 rounded-md bg-red-50 border border-red-100"
                >
                  <ShieldAlert className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-red-700">
                        {error.error_type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(error.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      {error.error_message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No login errors recorded in this time period
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
