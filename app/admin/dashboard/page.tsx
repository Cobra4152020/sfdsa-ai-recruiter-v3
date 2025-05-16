"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformanceWidget } from "@/components/performance-widget"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { HealthCheck } from "@/components/health-check"
import {
  Users,
  Award,
  BarChart3,
  Database,
  Mail,
  DollarSign,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  UserCog,
} from "lucide-react"
import { mockAdminData } from "@/lib/mock-admin-data"

interface SystemStatus {
  database: { status: "ok" | "error" | "loading"; message: string }
  email: { status: "ok" | "error" | "loading"; message: string }
  auth: { status: "ok" | "error" | "loading"; message: string }
  storage: { status: "ok" | "error" | "loading"; message: string }
}

export default function AdminDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(mockAdminData.systemStatus)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    setIsRefreshing(true)

    // Use mock data for static export
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      setSystemStatus(mockAdminData.systemStatus)
      setIsRefreshing(false)
      return
    }

    // Check database
    try {
      const response = await fetch("/api/health/database")
      const data = await response.json()
      setSystemStatus((prev) => ({
        ...prev,
        database: { status: data.success ? "ok" : "error", message: data.message },
      }))
    } catch (error) {
      console.error("Database check error:", error)
      setSystemStatus((prev) => ({
        ...prev,
        database: {
          status: "error",
          message: error instanceof Error ? error.message : "Database connection failed",
        },
      }))
    }

    // Check email service
    try {
      const response = await fetch("/api/health/email")
      const data = await response.json()
      setSystemStatus((prev) => ({
        ...prev,
        email: {
          status: data.success ? "ok" : "error",
          message: data.message,
        },
      }))
    } catch (error) {
      setSystemStatus((prev) => ({
        ...prev,
        email: {
          status: "error",
          message: error instanceof Error ? error.message : "Email service check failed",
        },
      }))
    }

    // Check auth service
    try {
      const response = await fetch("/api/health/auth")
      const data = await response.json()
      setSystemStatus((prev) => ({
        ...prev,
        auth: {
          status: data.success ? "ok" : "error",
          message: data.message,
        },
      }))
    } catch (error) {
      setSystemStatus((prev) => ({
        ...prev,
        auth: {
          status: "error",
          message: error instanceof Error ? error.message : "Authentication service check failed",
        },
      }))
    }

    // Check storage service
    try {
      const response = await fetch("/api/health/storage")
      const data = await response.json()
      setSystemStatus((prev) => ({
        ...prev,
        storage: {
          status: data.success ? "ok" : "error",
          message: data.message,
        },
      }))
    } catch (error) {
      setSystemStatus((prev) => ({
        ...prev,
        storage: {
          status: "error",
          message: error instanceof Error ? error.message : "Storage service check failed",
        },
      }))
    }

    setIsRefreshing(false)
  }

  const handleRefreshCache = async () => {
    try {
      // In static export, just show success message
      if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
        toast({
          title: "Cache refreshed",
          description: "The leaderboard cache has been successfully refreshed (Demo Mode).",
        })
        return
      }

      const response = await fetch("/api/admin/refresh-leaderboard", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`Failed to refresh cache: ${response.status}`)
      }

      toast({
        title: "Cache refreshed",
        description: "The leaderboard cache has been successfully refreshed.",
      })
    } catch (error) {
      console.error("Error refreshing cache:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to refresh cache",
        variant: "destructive",
      })
    }
  }

  const StatusIcon = ({ status }: { status: "ok" | "error" | "loading" }) => {
    if (status === "loading") return <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
    if (status === "ok") return <CheckCircle className="h-5 w-5 text-green-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your recruitment platform</p>
        </div>
        <Button onClick={checkSystemStatus} variant="outline" className="mt-4 md:mt-0" disabled={isRefreshing}>
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
              This is a demo version with mock data. Changes will not persist after page refresh.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/applicants" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Applicant Management</CardTitle>
                    <Users className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{mockAdminData.stats.totalApplicants}</p>
                    <p className="text-sm text-gray-500">Total Applicants</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pending Applications</span>
                      <span className="font-medium">{mockAdminData.stats.pendingApplications}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed Interviews</span>
                      <span className="font-medium">{mockAdminData.stats.completedInterviews}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/volunteers" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Volunteer Management</CardTitle>
                    <UserCog className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{mockAdminData.stats.activeVolunteers}</p>
                    <p className="text-sm text-gray-500">Active Volunteers</p>
                  </div>
                  <div className="mt-4">
                    <PerformanceWidget data={mockAdminData.performance} />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/analytics" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Analytics</CardTitle>
                    <BarChart3 className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{mockAdminData.stats.emailOpenRate}%</p>
                    <p className="text-sm text-gray-500">Email Open Rate</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Emails Sent</span>
                      <span className="font-medium">{mockAdminData.stats.emailsSent}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/system-settings" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">System Settings</CardTitle>
                    <Settings className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <StatusIcon status={systemStatus.database.status} />
                        <span>Database</span>
                      </div>
                      <span className="text-sm">{mockAdminData.healthChecks.database.latency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <StatusIcon status={systemStatus.storage.status} />
                        <span>Storage</span>
                      </div>
                      <span className="text-sm">{mockAdminData.stats.storageUsed} / {mockAdminData.stats.storageLimit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current status of system components</CardDescription>
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
                        style={{ width: `${mockAdminData.performance.cpu.usage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Memory Usage</span>
                      <span>{mockAdminData.performance.memory.used}GB / {mockAdminData.performance.memory.total}GB</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(mockAdminData.performance.memory.used / mockAdminData.performance.memory.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Disk Usage</span>
                      <span>{mockAdminData.performance.disk.used}GB / {mockAdminData.performance.disk.total}GB</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${(mockAdminData.performance.disk.used / mockAdminData.performance.disk.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
