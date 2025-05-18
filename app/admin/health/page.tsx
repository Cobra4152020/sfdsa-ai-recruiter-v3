"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthCheck } from "@/components/health-check"
import { LinkChecker } from "@/components/link-checker"
import { SupabaseHealthCheck } from "@/components/supabase-health-check"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const mockHealthData = {
  database: {
    status: "healthy",
    latency: "45ms",
    connections: 12,
    uptime: "99.99%"
  },
  email: {
    status: "healthy",
    deliveryRate: "98.5%",
    bounceRate: "1.5%",
    queueSize: 0
  },
  auth: {
    status: "healthy",
    activeUsers: 156,
    failedLogins: 2,
    tokenExpiry: "24h"
  },
  storage: {
    status: "healthy",
    availability: "99.99%",
    errorRate: "0.01%",
    bandwidth: "45MB/s"
  }
}

export default function HealthPage() {
  const router = useRouter()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin/dashboard")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-[#0A3C1F]">System Health</h1>
      </div>

      <Tabs defaultValue="health">
        <TabsList className="mb-6">
          <TabsTrigger value="health">Health Check</TabsTrigger>
          <TabsTrigger value="links">Link Checker</TabsTrigger>
          <TabsTrigger value="database">Database Health</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Application Health</CardTitle>
              <CardDescription>Check the overall health of the application</CardDescription>
            </CardHeader>
            <CardContent>
              <HealthCheck data={mockHealthData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Link Checker</CardTitle>
              <CardDescription>Verify all links in the application are working</CardDescription>
            </CardHeader>
            <CardContent>
              <LinkChecker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Health</CardTitle>
              <CardDescription>Check Supabase connection and database health</CardDescription>
            </CardHeader>
            <CardContent>
              <SupabaseHealthCheck />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
