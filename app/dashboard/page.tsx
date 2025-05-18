"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseClient } from "@/lib/supabase-core"
import { Award, Trophy, Star, Clock, User, FileText, BadgeCheck, Bell, Settings, LogOut } from "lucide-react"
import { RecruitDashboard } from "@/components/recruit-dashboard"
import { ApplicationProgressGamification } from "@/components/application-progress-gamification"
import { EarnedBadges } from "@/components/earned-badges"
import { useUser } from "@/context/user-context"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { currentUser } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-24 mt-4 md:mt-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>

        <Skeleton className="h-96" />
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-2">Welcome back, {currentUser?.name || "Recruit"}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your progress and stay updated on your recruitment journey.</p>
        </div>
        <Button
          onClick={() => router.push("/profile/settings")}
          variant="outline"
          className="mt-4 md:mt-0"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#0A3C1F] dark:text-[#FFD700]">
              <Trophy className="h-5 w-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">12</div>
            <p className="text-gray-600 dark:text-gray-300">Badges earned this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#0A3C1F] dark:text-[#FFD700]">
              <Star className="h-5 w-5 mr-2" />
              Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">850</div>
            <p className="text-gray-600 dark:text-gray-300">Total points accumulated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#0A3C1F] dark:text-[#FFD700]">
              <Clock className="h-5 w-5 mr-2" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">2</div>
            <p className="text-gray-600 dark:text-gray-300">Tasks pending completion</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <RecruitDashboard />
        </TabsContent>

        <TabsContent value="progress">
          <ApplicationProgressGamification />
        </TabsContent>

        <TabsContent value="badges">
          <EarnedBadges />
        </TabsContent>
      </Tabs>
    </main>
  )
}
