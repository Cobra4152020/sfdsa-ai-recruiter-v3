"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecruitDashboard } from "@/components/recruit-dashboard"
import { VolunteerRecruiterDashboard } from "@/components/volunteer-recruiter-dashboard"
import { useUser } from "@/context/user-context"

export default function DashboardPage() {
  const [userType, setUserType] = useState<"recruit" | "recruiter">("recruit")
  const { currentUser } = useUser()

  // In a real implementation, you would determine the user type from their profile
  // For now, we'll use a toggle for demonstration purposes

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0A3C1F]">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">View as:</span>
          <Tabs value={userType} onValueChange={(value) => setUserType(value as "recruit" | "recruiter")}>
            <TabsList>
              <TabsTrigger value="recruit">Recruit</TabsTrigger>
              <TabsTrigger value="recruiter">Volunteer Recruiter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {userType === "recruit" ? <RecruitDashboard /> : <VolunteerRecruiterDashboard />}
    </div>
  )
}
