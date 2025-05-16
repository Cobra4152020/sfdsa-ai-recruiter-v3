"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Award, FileText, Bell, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase-client"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [badges, setBadges] = useState([])
  const [applications, setApplications] = useState([])
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState({
    points: 0,
    rank: 0,
    completedActivities: 0,
  })

  useEffect(() => {
    async function checkUser() {
      setLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login?redirect=/user-dashboard")
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)

      // Fetch user badges
      const { data: badgeData } = await supabase
        .from("user_badges")
        .select("*, badges(*)")
        .eq("user_id", userData.user?.id)

      if (badgeData) {
        setBadges(badgeData)
      }

      // Fetch user applications
      const { data: applicationData } = await supabase.from("applicants").select("*").eq("email", userData.user?.email)

      if (applicationData) {
        setApplications(applicationData)
      }

      // Fetch user notifications
      const { data: notificationData } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userData.user?.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (notificationData) {
        setNotifications(notificationData)
      }

      // Fetch user stats
      const { data: statsData } = await supabase
        .from("user_points")
        .select("points")
        .eq("user_id", userData.user?.id)
        .single()

      if (statsData) {
        // Get user rank
        const { data: rankData, count } = await supabase
          .from("user_points")
          .select("*", { count: "exact" })
          .gte("points", statsData.points)

        // Get completed activities
        const { count: activitiesCount } = await supabase
          .from("user_activities")
          .select("*", { count: "exact" })
          .eq("user_id", userData.user?.id)
          .eq("completed", true)

        setStats({
          points: statsData.points || 0,
          rank: count || 0,
          completedActivities: activitiesCount || 0,
        })
      }

      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">
            Welcome, {user?.user_metadata?.full_name || user?.email}
          </h1>
          <p className="text-gray-600">Manage your recruitment journey and track your progress</p>
        </div>

        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Points</CardTitle>
            <CardDescription>Your recruitment points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A3C1F]">{stats.points}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/awards" className="text-sm text-[#0A3C1F] hover:underline">
              View leaderboard
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Rank</CardTitle>
            <CardDescription>Your position on the leaderboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A3C1F]">#{stats.rank}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/awards" className="text-sm text-[#0A3C1F] hover:underline">
              View all recruits
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Activities</CardTitle>
            <CardDescription>Completed recruitment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A3C1F]">{stats.completedActivities}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/gamification" className="text-sm text-[#0A3C1F] hover:underline">
              Find more activities
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Recruitment Journey</CardTitle>
              <CardDescription>Track your progress toward becoming a Deputy Sheriff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0A3C1F]/10 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-[#0A3C1F]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Complete Your Profile</h3>
                    <p className="text-sm text-gray-500">
                      Update your profile information to help us better understand your qualifications.
                    </p>
                    <Button asChild className="mt-2" variant="outline" size="sm">
                      <Link href="/profile/edit">Update Profile</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#0A3C1F]/10 p-3 rounded-full">
                    <Award className="h-6 w-6 text-[#0A3C1F]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Earn More Badges</h3>
                    <p className="text-sm text-gray-500">
                      Complete activities and challenges to earn badges and increase your recruitment score.
                    </p>
                    <Button asChild className="mt-2" variant="outline" size="sm">
                      <Link href="/badges">View Badges</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#0A3C1F]/10 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-[#0A3C1F]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Submit Your Application</h3>
                    <p className="text-sm text-gray-500">
                      Ready to take the next step? Submit your official application to the San Francisco Sheriff's
                      Office.
                    </p>
                    <Button asChild className="mt-2" variant="outline" size="sm">
                      <Link href="https://careers.sf.gov/interest/public-safety/sheriff/">Apply Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Earned Badges</CardTitle>
              <CardDescription>Badges you've earned through your recruitment journey</CardDescription>
            </CardHeader>
            <CardContent>
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges.map((badge: any) => (
                    <div key={badge.id} className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-[#0A3C1F]/10 rounded-full flex items-center justify-center mb-2">
                        <img
                          src={badge.badges?.image_url || "/generic-badge.png"}
                          alt={badge.badges?.name || "Badge"}
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <h3 className="font-medium text-sm">{badge.badges?.name || "Badge"}</h3>
                      <p className="text-xs text-gray-500">{badge.badges?.description || "Achievement badge"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-500">No badges yet</h3>
                  <p className="text-sm text-gray-400 mb-4">Complete activities to earn your first badge</p>
                  <Button asChild variant="outline">
                    <Link href="/gamification">Find Activities</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>Track the status of your applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app: any) => (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Application #{app.tracking_number}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            app.application_status === "hired"
                              ? "bg-green-100 text-green-800"
                              : app.application_status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {app.application_status?.charAt(0).toUpperCase() + app.application_status?.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Submitted on {new Date(app.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between items-center">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/application/${app.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-500">No applications yet</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Start your application to the San Francisco Sheriff's Office
                  </p>
                  <Button asChild>
                    <Link href="https://careers.sf.gov/interest/public-safety/sheriff/">Apply Now</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>Recent updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification: any) => (
                    <div key={notification.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      {notification.action_url && (
                        <Button asChild variant="link" className="p-0 h-auto text-[#0A3C1F]">
                          <Link href={notification.action_url}>{notification.action_text || "View"}</Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-500">No notifications</h3>
                  <p className="text-sm text-gray-400">You're all caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
