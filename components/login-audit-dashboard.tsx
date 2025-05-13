"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase-clients"
import { AlertTriangle, UserCheck, RefreshCw } from "lucide-react"

type UserRole = "recruit" | "volunteer" | "admin"
type LoginMethod = "password" | "social" | "magic_link" | "sso"

interface LoginMetrics {
  total_logins: number
  successful_logins: number
  failed_logins: number
  avg_response_time_ms: number
  unique_users: number
  by_role: Record<UserRole, number>
  by_method: Record<LoginMethod, number>
  recent_errors: Array<{
    created_at: string
    error_type: string
    error_message: string
  }>
  by_day: Array<{
    day: string
    count: number
    success_rate: number
  }>
}

export default function LoginAuditDashboard() {
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [metrics, setMetrics] = useState<LoginMetrics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [timeRange, setTimeRange] = useState<string>("7d")

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        
        // These would be actual API calls to get the metrics
        // For this example, we'll simulate the data
        
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        const mockMetrics: LoginMetrics = {
          total_logins: 1268,
          successful_logins: 1187,
          failed_logins: 81,
          avg_response_time_ms: 428,
          unique_users: 342,
          by_role: {
            recruit: 876,
            volunteer: 276,
            admin: 35
          },
          by_method: {
            password: 732,
            social: 416,
            magic_link: 120,
            sso: 0
          },
          recent_errors: [
            {
              created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              error_type: "auth/invalid-credential",
              error_message: "Email or password is incorrect"
            },
            {
              created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              error_type: "auth/network-error",
              error_message: "Network connection failed"
            },
            {
              created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              error_type: "auth/too-many-requests",
              error_message: "Too many requests. Try again later"
            }
          ],
          by_day: [
            { day: "Mon", count: 168, success_rate: 92.3 },
            { day: "Tue", count: 203, success_rate: 94.1 },
            { day: "Wed", count: 187, success_rate: 96.8 },
            { day: "Thu", count: 192, success_rate: 93.2 },
            { day: "Fri", count: 176, success_rate: 91.5 },
            { day: "Sat", count: 145, success_rate: 97.2 },
            { day: "Sun", count: 197, success_rate: 95.4 },
          ]
        }
        
        setMetrics(mockMetrics)
      } catch (error) {
        console.error("Error fetching login metrics:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMetrics()
  }, [timeRange])
  
  const handleRefresh = () => {
    setLoading(true)
    // Re-fetch the data
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading login metrics...</p>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-2" />
        <h3 className="text-lg font-medium">Failed to load metrics</h3>
        <p className="text-muted-foreground mb-4">Could not load login audit metrics</p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    )
  }

  const successRate = ((metrics.successful_logins / metrics.total_logins) * 100).toFixed(1)
  
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
            disabled={loading}
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
                <p className="text-sm font-medium text-muted-foreground">Total Logins</p>
                <h3 className="text-3xl font-bold mt-1">{metrics.total_logins.toLocaleString()}</h3>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-\
