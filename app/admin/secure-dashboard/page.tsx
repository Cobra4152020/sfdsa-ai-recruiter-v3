"use client"

import { Suspense, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { TiktokChallengesList } from "@/components/dashboard/tiktok-challenges-list"
import { RecentApplicants } from "@/components/dashboard/recent-applicants"
import { BadgeShareStats } from "@/components/dashboard/badge-share-stats"
import { DailyBriefingsList } from "@/components/dashboard/daily-briefings-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Challenge {
  id: number
  title: string
  description: string
  instructions: string
  hashtags: string[]
  badge_reward: string
  example_video_url: string
  thumbnail_url: string
  status: string
  start_date: string
  end_date: string
  points: number
  points_reward: number
  requirements: string[]
  created_at: string
  updated_at: string
}

interface Applicant {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  zip_code: string
  referral_source: string
  referral_code: string
  tracking_number: string
  application_status: string
  created_at: string
  updated_at: string
}

interface BadgeShare {
  platform: string
  count: number
}

interface Briefing {
  id: string
  title: string
  content: string
  date: string
  theme: string
  created_at: string
  updated_at: string
}

// Client Components for data fetching
function DashboardStatsWrapper() {
  const [stats, setStats] = useState({
    challengesCount: 0,
    applicantsCount: 0,
    badgeSharesCount: 0,
    briefingsCount: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClientComponentClient()

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

        setStats({
          challengesCount: challengesCount || 0,
          applicantsCount: applicantsCount || 0,
          badgeSharesCount: badgeSharesCount || 0,
          briefingsCount: briefingsCount || 0,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      }
    }

    fetchStats()
  }, [])

  return <DashboardStats {...stats} />
}

function TiktokChallengesWrapper() {
  const [challenges, setChallenges] = useState<Challenge[]>([])

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const supabase = createClientComponentClient()

        const { data } = await supabase
          .from("active_tiktok_challenges")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        setChallenges(data || [])
      } catch (error) {
        console.error("Error fetching challenges:", error)
      }
    }

    fetchChallenges()
  }, [])

  return <TiktokChallengesList challenges={challenges} />
}

function RecentApplicantsWrapper() {
  const [applicants, setApplicants] = useState<Applicant[]>([])

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const supabase = createClientComponentClient()

        const { data } = await supabase
          .from("applicants")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        setApplicants(data || [])
      } catch (error) {
        console.error("Error fetching applicants:", error)
      }
    }

    fetchApplicants()
  }, [])

  return <RecentApplicants applicants={applicants} />
}

function BadgeShareStatsWrapper() {
  const [shares, setShares] = useState<BadgeShare[]>([])

  useEffect(() => {
    const fetchShares = async () => {
      try {
        const supabase = createClientComponentClient()

        const { data } = await supabase
          .from("badge_shares")
          .select("platform, count")
          .order("count", { ascending: false })
          .limit(5)

        setShares(data || [])
      } catch (error) {
        console.error("Error fetching badge shares:", error)
      }
    }

    fetchShares()
  }, [])

  return <BadgeShareStats shares={shares} />
}

function DailyBriefingsWrapper() {
  const [briefings, setBriefings] = useState<Briefing[]>([])

  useEffect(() => {
    const fetchBriefings = async () => {
      try {
        const supabase = createClientComponentClient()

        const { data } = await supabase
          .from("daily_briefings")
          .select("*")
          .order("date", { ascending: false })
          .limit(5)

        setBriefings(data || [])
      } catch (error) {
        console.error("Error fetching briefings:", error)
      }
    }

    fetchBriefings()
  }, [])

  return <DailyBriefingsList briefings={briefings} />
}

export default function SecureDashboardPage() {
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
