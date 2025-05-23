"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApplicantDashboard } from "@/components/admin/applicant-dashboard"
import { LoginAuditDashboard } from "@/components/admin/login-audit-dashboard"
import { getClientSideSupabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type LoginEvent = Database["public"]["Tables"]["login_audit"]["Row"]

export default function AdminDashboard() {
  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([])
  const supabase = getClientSideSupabase()

  const fetchLoginEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("login_audit")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100)

      if (error) throw error
      setLoginEvents(data || [])
    } catch (error) {
      console.error("Error fetching login events:", error)
    }
  }

  useEffect(() => {
    fetchLoginEvents()
  }, [supabase, fetchLoginEvents])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="applicants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
          <TabsTrigger value="login-audit">Login Audit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applicants">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicantDashboard />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="login-audit">
          <Card>
            <CardHeader>
              <CardTitle>Login Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginAuditDashboard 
                events={loginEvents.map(event => ({
                  id: event.id,
                  userId: event.user_id,
                  userEmail: event.user_email,
                  eventType: event.event_type,
                  timestamp: event.timestamp,
                  ipAddress: event.ip_address,
                  userAgent: event.user_agent,
                  location: event.location
                }))} 
                onRefresh={fetchLoginEvents} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 