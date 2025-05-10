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
} from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-core"

interface SystemStatus {
  database: { status: "ok" | "error" | "loading"; message: string }
  email: { status: "ok" | "error" | "loading"; message: string }
  auth: { status: "ok" | "error" | "loading"; message: string }
  storage: { status: "ok" | "error" | "loading"; message: string }
}

export default function AdminDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: { status: "loading", message: "Checking database connection..." },
    email: { status: "loading", message: "Checking email service..." },
    auth: { status: "loading", message: "Checking authentication service..." },
    storage: { status: "loading", message: "Checking storage service..." },
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    setIsRefreshing(true)

    // Check database
    try {
      const { data, error } = await supabase.from("health_check").select("*").limit(1)
      if (error) throw error
      setSystemStatus((prev) => ({
        ...prev,
        database: { status: "ok", message: "Database connection successful" },
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
      const response = await fetch("/api/health/email", { method: "GET" })
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
      const { data, error } = await supabase.auth.getSession()
      setSystemStatus((prev) => ({
        ...prev,
        auth: {
          status: "ok",
          message: "Authentication service is operational",
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
      const { data, error } = await supabase.storage.getBucket("public")
      setSystemStatus((prev) => ({
        ...prev,
        storage: {
          status: error ? "error" : "ok",
          message: error ? error.message : "Storage service is operational",
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
                  <CardDescription>View and manage applicant data and track recruitment progress</CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/performance-dashboard" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    <BarChart3 className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Analyze platform performance and user engagement metrics</CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/journey-performance" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">User Journeys</CardTitle>
                    <Award className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Track user journey performance and conversion metrics</CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/database-health" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Database Health</CardTitle>
                    <Database className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Monitor database health and performance metrics</CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/email-test" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Email Testing</CardTitle>
                    <Mail className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Test email templates and delivery functionality</CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/donations" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Donation Management</CardTitle>
                    <DollarSign className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Track and manage donation transactions and analytics</CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/diagnostics" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">System Diagnostics</CardTitle>
                    <Settings className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Run diagnostics and check system health</CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/health" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">System Health</CardTitle>
                    <Settings className="h-5 w-5 text-[#0A3C1F]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Monitor system health and check for issues</CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <Settings className="h-5 w-5 text-[#0A3C1F]" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleRefreshCache} variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Leaderboard Cache
                </Button>
                <Link href="/admin/test" className="block w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Test Components
                  </Button>
                </Link>
                <Link href="/admin/image-diagnostics" className="block w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Image Diagnostics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HealthCheck />
            <PerformanceWidget />
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Messages</CardTitle>
                <CardDescription>Recent system alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(systemStatus).map(
                    ([key, value]) =>
                      value.status === "error" && (
                        <div key={key} className="flex p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-700">
                              {key.charAt(0).toUpperCase() + key.slice(1)} Error
                            </p>
                            <p className="text-sm text-red-600">{value.message}</p>
                          </div>
                        </div>
                      ),
                  )}

                  {Object.values(systemStatus).every((status) => status.status !== "error") && (
                    <div className="flex p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-700">All Systems Operational</p>
                        <p className="text-sm text-green-600">All services are running normally.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
