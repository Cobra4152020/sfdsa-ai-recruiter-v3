"use client"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthCheck } from "@/components/health-check"
import { LinkChecker } from "@/components/link-checker"
import { SupabaseHealthCheck } from "@/components/supabase-health-check"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HealthPage() {
  const router = useRouter()

  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/admin/dashboard")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">System Health</h1>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6">
              <HealthCheck />

              <Card>
                <CardHeader>
                  <CardTitle>Health Check Documentation</CardTitle>
                  <CardDescription>Information about the system health checks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Overview</h3>
                    <p className="text-gray-600">
                      The health check system monitors the status of various components of the application. It checks
                      the API, database connection, and environment variables to ensure everything is working correctly.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Components Checked</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>
                        <strong>API</strong>: Checks if the API endpoints are responding correctly
                      </li>
                      <li>
                        <strong>Database</strong>: Verifies the connection to the Supabase database
                      </li>
                      <li>
                        <strong>Environment</strong>: Ensures all required environment variables are set
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Status Codes</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>
                        <strong>OK</strong>: The component is functioning correctly
                      </li>
                      <li>
                        <strong>ERROR</strong>: The component is not functioning correctly
                      </li>
                      <li>
                        <strong>UNKNOWN</strong>: The status of the component could not be determined
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="database">
            <SupabaseHealthCheck />
          </TabsContent>

          <TabsContent value="links">
            <LinkChecker />
          </TabsContent>
        </Tabs>
      </main>
      <ImprovedFooter />
    </>
  )
}
