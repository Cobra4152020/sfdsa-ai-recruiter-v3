"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VolunteerRecruiterDashboard } from "@/components/volunteer-recruiter-dashboard"
import { RecruiterAnalyticsDashboard } from "@/components/recruiter-analytics-dashboard"
import { ReferralLinkGenerator } from "@/components/referral-link-generator"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"

export default function VolunteerDashboardPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = "/volunteer-login"
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3C1F]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="referrals">Referral Links</TabsTrigger>
          <TabsTrigger value="contacts">Contact Recruits</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <VolunteerRecruiterDashboard className="mt-6" />
        </TabsContent>

        <TabsContent value="analytics">
          <RecruiterAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="referrals">
          <ReferralLinkGenerator />
        </TabsContent>

        <TabsContent value="contacts">
          {/* Contact form component would go here */}
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-[#0A3C1F] mb-4">Contact Potential Recruits</h2>
            <p className="text-gray-600 mb-4">
              This section allows you to directly contact potential recruits. The feature is coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
