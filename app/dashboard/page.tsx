"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseClient } from "@/lib/supabase-core"
import { Award, Trophy, Star, Clock, User, FileText, BadgeCheck } from "lucide-react"
import { RecruitDashboard } from "@/components/recruit-dashboard"
import { ApplicationProgressGamification } from "@/components/application-progress-gamification"
import { EarnedBadges } from "@/components/earned-badges"
import { useUser } from "@/context/user-context"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()
  const { currentUser, setCurrentUser } = useUser()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error

        if (!session) {
          // Not authenticated, redirect to login
          router.push("/login")
          return
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError
        }

        setUserProfile(
          profile || {
            user_id: session.user.id,
            first_name: session.user.user_metadata?.first_name || "",
            last_name: session.user.user_metadata?.last_name || "",
            email: session.user.email,
            points: 0,
            level: 1,
            application_status: "new",
          },
        )

        // Update context
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || "",
          firstName: session.user.user_metadata?.first_name || "",
          lastName: session.user.user_metadata?.last_name || "",
          ...profile,
        })
      } catch (error) {
        console.error("Auth check error:", error)
        toast({
          title: "Authentication error",
          description: error instanceof Error ? error.message : "Failed to authenticate user",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast, supabase, setCurrentUser])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear user context
      setCurrentUser(null)

      // Redirect to home
      router.push("/")

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Sign out failed",
        description: error instanceof Error ? error.message : "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <>
        <ImprovedHeader showOptInForm={() => {}} />
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
        <ImprovedFooter />
      </>
    )
  }

  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0A3C1F]">Welcome, {userProfile?.first_name || "Recruit"}!</h1>
            <p className="text-gray-600">Track your recruitment progress and achievements</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="mt-4 md:mt-0">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 text-[#FFD700] mr-2" />
                Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userProfile?.points || 0}</div>
              <p className="text-sm text-gray-500">Earn points by completing activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Star className="h-5 w-5 text-[#FFD700] mr-2" />
                Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userProfile?.level || 1}</div>
              <p className="text-sm text-gray-500">Level up by earning points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 text-[#FFD700] mr-2" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userProfile?.badges_count || 0}</div>
              <p className="text-sm text-gray-500">Earn badges by completing challenges</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <RecruitDashboard />
          </TabsContent>

          <TabsContent value="application">
            <ApplicationProgressGamification />
          </TabsContent>

          <TabsContent value="badges">
            <EarnedBadges userId={userProfile?.user_id} />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal information and application details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {userProfile?.first_name} {userProfile?.last_name}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      {userProfile?.email}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Application Status</h3>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {userProfile?.application_status ? (
                        <span className="capitalize">{userProfile.application_status}</span>
                      ) : (
                        "Not started"
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                    <p className="flex items-center">
                      <BadgeCheck className="h-4 w-4 mr-2 text-gray-400" />
                      {userProfile?.created_at
                        ? new Date(userProfile.created_at).toLocaleDateString()
                        : new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push("/profile/edit")}>
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <ImprovedFooter />
    </>
  )
}
