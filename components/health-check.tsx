"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react"

interface HealthStatus {
  status: string
  timestamp: string
  checks: {
    api: { status: string; message: string }
    database: { status: string; message: string }
    environment: { status: string; message: string }
  }
}

export function HealthCheck() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setHealthStatus(data)
    } catch (err) {
      console.error("Health check error:", err)
      setError(err instanceof Error ? err.message : "Failed to check system health")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "ok") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status === "error") return <XCircle className="h-5 w-5 text-red-500" />
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current status of system components</CardDescription>
          </div>
          <Button onClick={checkHealth} disabled={isLoading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Checking..." : "Check Health"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
            <p className="font-medium">Error checking health:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {healthStatus && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StatusIcon status={healthStatus.status === "healthy" ? "ok" : "error"} />
                <span className="ml-2 font-medium">Overall Status</span>
              </div>
              <Badge
                variant="outline"
                className={`
                  ${
                    healthStatus.status === "healthy"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }
                `}
              >
                {healthStatus.status.toUpperCase()}
              </Badge>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium mb-2">Component Status</h3>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <StatusIcon status={healthStatus.checks.api.status} />
                  <span className="ml-2">API</span>
                </div>
                <span
                  className={`text-sm ${healthStatus.checks.api.status === "ok" ? "text-green-600" : "text-red-600"}`}
                >
                  {healthStatus.checks.api.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <StatusIcon status={healthStatus.checks.database.status} />
                  <span className="ml-2">Database</span>
                </div>
                <span
                  className={`text-sm ${
                    healthStatus.checks.database.status === "ok"
                      ? "text-green-600"
                      : healthStatus.checks.database.status === "error"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {healthStatus.checks.database.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <StatusIcon status={healthStatus.checks.environment.status} />
                  <span className="ml-2">Environment</span>
                </div>
                <span
                  className={`text-sm ${
                    healthStatus.checks.environment.status === "ok"
                      ? "text-green-600"
                      : healthStatus.checks.environment.status === "error"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {healthStatus.checks.environment.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {isLoading && !healthStatus && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
