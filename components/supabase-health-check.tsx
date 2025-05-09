"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, Database, RefreshCw } from "lucide-react"

interface TableCheckResult {
  table: string
  exists: boolean
  error: string | null
  responseTimeMs?: number
}

interface PermissionsCheck {
  success: boolean
  error: string | null
}

interface HealthCheckResponse {
  success: boolean
  message: string
  details: {
    connectionTimeMs: number
    totalResponseTimeMs: number
    tablesChecked: TableCheckResult[]
    missingTables: string[]
    permissions: PermissionsCheck
    environment: {
      hasSupabaseUrl: boolean
      hasSupabaseAnonKey: boolean
      hasSupabaseServiceKey: boolean
    }
  }
}

export function SupabaseHealthCheck() {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/health/supabase")
      const data = await response.json()
      setHealthData(data)
    } catch (err: any) {
      setError(err.message || "Failed to check Supabase health")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Health Check
        </CardTitle>
        <CardDescription>Checks the connection to Supabase and verifies required tables</CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <div className="flex items-center gap-2 text-red-700 font-medium">
              <AlertCircle className="h-5 w-5" />
              Error checking Supabase health
            </div>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        ) : healthData ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {healthData.success ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Healthy
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Unhealthy
                </Badge>
              )}
              <span className="text-sm text-gray-500">{healthData.message}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Connection Time</div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{healthData.details.connectionTimeMs}ms</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Total Response Time</div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{healthData.details.totalResponseTimeMs}ms</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Tables Status</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {healthData.details.tablesChecked.map((table) => (
                      <tr key={table.table}>
                        <td className="px-4 py-2 whitespace-nowrap">{table.table}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {table.exists ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Exists
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Missing
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{table.responseTimeMs}ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Permissions</h3>
              <div className={`p-3 rounded-md ${healthData.details.permissions.success ? "bg-green-50" : "bg-red-50"}`}>
                {healthData.details.permissions.success ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    Write permissions verified
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      Permission issues detected
                    </div>
                    <p className="mt-1 text-sm text-red-600">{healthData.details.permissions.error}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Environment</h3>
              <div className="grid grid-cols-3 gap-2">
                <div
                  className={`p-2 rounded-md text-xs ${healthData.details.environment.hasSupabaseUrl ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  Supabase URL: {healthData.details.environment.hasSupabaseUrl ? "Set" : "Missing"}
                </div>
                <div
                  className={`p-2 rounded-md text-xs ${healthData.details.environment.hasSupabaseAnonKey ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  Anon Key: {healthData.details.environment.hasSupabaseAnonKey ? "Set" : "Missing"}
                </div>
                <div
                  className={`p-2 rounded-md text-xs ${healthData.details.environment.hasSupabaseServiceKey ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  Service Key: {healthData.details.environment.hasSupabaseServiceKey ? "Set" : "Missing"}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>

      <CardFooter>
        <Button variant="outline" onClick={checkHealth} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  )
}
