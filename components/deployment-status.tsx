"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface StatusCheck {
  name: string
  status: "success" | "error" | "warning" | "loading"
  message?: string
}

export function DeploymentStatus() {
  const [checks, setChecks] = useState<StatusCheck[]>([
    { name: "Environment", status: "loading" },
    { name: "Database", status: "loading" },
    { name: "API Endpoints", status: "loading" },
    { name: "Assets", status: "loading" },
    { name: "Feature Flags", status: "loading" },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const runChecks = async () => {
    setIsLoading(true)

    // Check environment
    const envCheck = { name: "Environment", status: "loading" } as StatusCheck
    try {
      const envRes = await fetch("/api/health/environment")
      if (envRes.ok) {
        const data = await envRes.json()
        envCheck.status = data.success ? "success" : "error"
        envCheck.message = data.message
      } else {
        envCheck.status = "error"
        envCheck.message = "Failed to check environment"
      }
    } catch (error) {
      envCheck.status = "error"
      envCheck.message = "Error checking environment"
    }

    // Check database
    const dbCheck = { name: "Database", status: "loading" } as StatusCheck
    try {
      const dbRes = await fetch("/api/health/database")
      if (dbRes.ok) {
        const data = await dbRes.json()
        dbCheck.status = data.success ? "success" : "error"
        dbCheck.message = data.message
      } else {
        dbCheck.status = "error"
        dbCheck.message = "Failed to check database"
      }
    } catch (error) {
      dbCheck.status = "error"
      dbCheck.message = "Error checking database"
    }

    // Check API endpoints
    const apiCheck = { name: "API Endpoints", status: "loading" } as StatusCheck
    try {
      const apiRes = await fetch("/api/health/endpoints")
      if (apiRes.ok) {
        const data = await apiRes.json()
        apiCheck.status = data.success ? "success" : "error"
        apiCheck.message = data.message
      } else {
        apiCheck.status = "error"
        apiCheck.message = "Failed to check API endpoints"
      }
    } catch (error) {
      apiCheck.status = "error"
      apiCheck.message = "Error checking API endpoints"
    }

    // Check assets
    const assetsCheck = { name: "Assets", status: "loading" } as StatusCheck
    try {
      const assetsRes = await fetch("/api/health/assets")
      if (assetsRes.ok) {
        const data = await assetsRes.json()
        assetsCheck.status = data.success ? "success" : "error"
        assetsCheck.message = data.message
      } else {
        assetsCheck.status = "error"
        assetsCheck.message = "Failed to check assets"
      }
    } catch (error) {
      assetsCheck.status = "error"
      assetsCheck.message = "Error checking assets"
    }

    // Check feature flags
    const flagsCheck = { name: "Feature Flags", status: "loading" } as StatusCheck
    try {
      const flagsRes = await fetch("/api/health/feature-flags")
      if (flagsRes.ok) {
        const data = await flagsRes.json()
        flagsCheck.status = data.success ? "success" : "warning"
        flagsCheck.message = data.message
      } else {
        flagsCheck.status = "error"
        flagsCheck.message = "Failed to check feature flags"
      }
    } catch (error) {
      flagsCheck.status = "error"
      flagsCheck.message = "Error checking feature flags"
    }

    setChecks([envCheck, dbCheck, apiCheck, assetsCheck, flagsCheck])
    setIsLoading(false)
    setLastChecked(new Date())
  }

  useEffect(() => {
    runChecks()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <RefreshCw className="h-5 w-5 animate-spin" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Deployment Status</CardTitle>
          <Button variant="outline" size="sm" onClick={runChecks} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        {lastChecked && (
          <p className="text-sm text-muted-foreground">Last checked: {lastChecked.toLocaleTimeString()}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checks.map((check) => (
            <div key={check.name} className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(check.status)}
                <span className="ml-2">{check.name}</span>
              </div>
              <div>
                {check.status === "success" && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    OK
                  </Badge>
                )}
                {check.status === "error" && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Failed
                  </Badge>
                )}
                {check.status === "warning" && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Warning
                  </Badge>
                )}
                {check.status === "loading" && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Checking...
                  </Badge>
                )}
              </div>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium mb-2">Build Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Environment:</div>
              <div className="font-mono">{process.env.NEXT_PUBLIC_VERCEL_ENV || "Unknown"}</div>

              <div>Build ID:</div>
              <div className="font-mono">{process.env.NEXT_PUBLIC_BUILD_ID || "Unknown"}</div>

              <div>Leaderboard Enabled:</div>
              <div>{process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD === "true" ? "Yes" : "No"}</div>

              <div>Badges Enabled:</div>
              <div>{process.env.NEXT_PUBLIC_ENABLE_BADGES === "true" ? "Yes" : "No"}</div>

              <div>Points Enabled:</div>
              <div>{process.env.NEXT_PUBLIC_ENABLE_POINTS === "true" ? "Yes" : "No"}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
