import { Suspense } from "react"
import { getServerSupabase } from "@/lib/supabase-server"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { TiktokChallengesList } from "@/components/dashboard/tiktok-challenges-list"
import { RecentApplicants } from "@/components/dashboard/recent-applicants"
import { BadgeShareStats } from "@/components/dashboard/badge-share-stats"
import { DailyBriefingsList } from "@/components/dashboard/daily-briefings-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function SecureDashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-[#0A3C1F]">Secure Admin Dashboard</h1>

      <div className="mb-8">
        <Suspense fallback={<div>Loading stats...</div>}>
          <DashboardStatsWrapper />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Active TikTok Challenges</CardTitle>
            <CardDescription>Currently active challenges for users</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading challenges...</div>}>
              <TiktokChallengesWrapper />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applicants</CardTitle>
            <CardDescription>Latest applicants in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading applicants...</div>}>
              <RecentApplicantsWrapper />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Badge Share Statistics</CardTitle>
            <CardDescription>How users are sharing their badges</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading badge stats...</div>}>
              <BadgeShareStatsWrapper />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Briefings</CardTitle>
            <CardDescription>Recent daily briefings</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading briefings...</div>}>
              <DailyBriefingsWrapper />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Server Components for data fetching
async function DashboardStatsWrapper() {
  try {
    const supabase = getServerSupabase()

    // Get counts from different tables
    const [
      { count: challengesCount },
      { count: applicantsCount },
      { count: badgeSharesCount },
      { count: briefingsCount },
    ] = await Promise.all([
      supabase.from("active_tiktok_challenges").select("*", { count: "exact", head: true }),
      supabase.from("applicants").select("*", { count: "exact", head: true }),
      supabase.from("badge_shares").select("*", { count: "exact", head: true }),
      supabase.from("daily_briefings").select("*", { count: "exact", head: true }),
    ])

    return (
      <DashboardStats
        challengesCount={challengesCount || 0}
        applicantsCount={applicantsCount || 0}
        badgeSharesCount={badgeSharesCount || 0}
        briefingsCount={briefingsCount || 0}
      />
    )
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return <DashboardStats challengesCount={0} applicantsCount={0} badgeSharesCount={0} briefingsCount={0} />
  }
}

async function TiktokChallengesWrapper() {
  try {
    const supabase = getServerSupabase()

    const { data: challenges } = await supabase
      .from("active_tiktok_challenges")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    return <TiktokChallengesList challenges={challenges || []} />
  } catch (error) {
    console.error("Error fetching challenges:", error)
    return <TiktokChallengesList challenges={[]} />
  }
}

async function RecentApplicantsWrapper() {
  try {
    const supabase = getServerSupabase()

    const { data: applicants } = await supabase
      .from("applicants")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    return <RecentApplicants applicants={applicants || []} />
  } catch (error) {
    console.error("Error fetching applicants:", error)
    return <RecentApplicants applicants={[]} />
  }
}

async function BadgeShareStatsWrapper() {
  try {
    const supabase = getServerSupabase()

    const { data: shares } = await supabase
      .from("badge_shares")
      .select("platform, count")
      .order("count", { ascending: false })
      .limit(5)

    return <BadgeShareStats shares={shares || []} />
  } catch (error) {
    console.error("Error fetching badge shares:", error)
    return <BadgeShareStats shares={[]} />
  }
}

async function DailyBriefingsWrapper() {
  try {
    const supabase = getServerSupabase()

    const { data: briefings } = await supabase
      .from("daily_briefings")
      .select("*")
      .order("date", { ascending: false })
      .limit(5)

    return <DailyBriefingsList briefings={briefings || []} />
  } catch (error) {
    console.error("Error fetching briefings:", error)
    return <DailyBriefingsList briefings={[]} />
  }
}
