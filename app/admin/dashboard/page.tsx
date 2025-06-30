"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { HealthCheck } from "@/components/health-check";
import { RefreshCw } from "lucide-react";
import { mockAdminData } from "@/lib/mock-admin-data";
import { DashboardStatsWrapper } from "@/components/admin/dashboard-stats-wrapper";
import { TikTokChallengesWrapper } from "@/components/admin/tiktok-challenges-wrapper";
import { RecentApplicantsWrapper } from "@/components/admin/recent-applicants-wrapper";
import { LoginAuditDashboard } from "@/components/admin/login-audit-dashboard";

export default function AdminDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const checkSystemStatus = async () => {
    setIsRefreshing(true);
    // Simulated delay for demo
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "System Status Updated",
      description: "All systems are operational",
    });
  };

  const mockStats = {
    totalApplicants: 150,
    qualifiedCandidates: 45,
    processingTime: "3.5 days",
    conversionRate: "30%",
  };

  const mockChallenges = [
    {
      id: "1",
      title: "Deputy Skills Challenge",
      participants: 120,
      views: 1500,
      status: "active" as const,
      hashtag: "SFDSAChallenge",
      endDate: "2024-04-30",
    },
    {
      id: "2",
      title: "Community Service",
      participants: 85,
      views: 1200,
      status: "active" as const,
      hashtag: "ServeWithSFDSA",
      endDate: "2024-05-15",
    },
  ];

  const mockApplicants = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      position: "Deputy Sheriff",
      status: "pending" as const,
      appliedDate: "2024-03-20",
      avatarUrl: "",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      position: "Deputy Sheriff",
      status: "approved" as const,
      appliedDate: "2024-03-19",
      avatarUrl: "",
    },
  ];

  const mockLoginEvents = [
    {
      id: "1",
      userId: "user1",
      userEmail: "admin@sfdsa.org",
      eventType: "login" as const,
      timestamp: "2024-03-20 14:30:00",
      ipAddress: "192.168.1.1",
      userAgent: "Chrome/120.0.0.0",
      location: "San Francisco, CA",
    },
    {
      id: "2",
      userId: "user2",
      userEmail: "volunteer@sfdsa.org",
      eventType: "failed_attempt" as const,
      timestamp: "2024-03-20 14:25:00",
      ipAddress: "192.168.1.2",
      userAgent: "Firefox/122.0",
      location: "San Francisco, CA",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your recruitment platform</p>
        </div>
        <Button
          onClick={checkSystemStatus}
          variant="outline"
          className="mt-4 md:mt-0"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </>
          )}
        </Button>
      </div>

      {process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" && (
        <Card className="mb-6 bg-yellow-50">
          <CardHeader>
            <CardTitle>Demo Mode</CardTitle>
            <CardDescription>
              This is a demo version with mock data. Changes will not persist
              after page refresh.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="space-y-6">
        {/* Stats Overview */}
        <DashboardStatsWrapper stats={mockStats} />

        {/* TikTok Challenges and Recent Applicants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TikTokChallengesWrapper challenges={mockChallenges} />
          <RecentApplicantsWrapper applicants={mockApplicants} />
        </div>

        {/* Login Audit */}
        <LoginAuditDashboard events={mockLoginEvents} />

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Current status of system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthCheck data={mockAdminData.healthChecks} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>CPU Usage</span>
                    <span>{mockAdminData.performance.cpu.usage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${mockAdminData.performance.cpu.usage}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Memory Usage</span>
                    <span>
                      {mockAdminData.performance.memory.used}GB /{" "}
                      {mockAdminData.performance.memory.total}GB
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(mockAdminData.performance.memory.used / mockAdminData.performance.memory.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Disk Usage</span>
                    <span>
                      {mockAdminData.performance.disk.used}GB /{" "}
                      {mockAdminData.performance.disk.total}GB
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{
                        width: `${(mockAdminData.performance.disk.used / mockAdminData.performance.disk.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
