"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingLeaderboard } from "@/components/daily-briefing/briefing-leaderboard"
import type { DailyBriefing, BriefingStats as BriefingStatsType } from "@/lib/daily-briefing-service"
import { useUser } from "@/context/user-context"
import { Loader2, AlertCircle, Calendar, Share2, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent } from "@/components/ui/card"

// Default empty briefing to prevent null/undefined errors
const emptyBriefing: DailyBriefing = {
  id: "",
  title: "No Briefing Available",
  content: "There is no briefing available for today.",
  date: new Date().toISOString(),
  theme: "None",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Default empty stats
const emptyStats: BriefingStatsType = {
  total_attendees: 0,
  total_shares: 0,
  user_attended: false,
  user_shared: false,
  user_platforms_shared: [],
}

export default function DailyBriefingPage() {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null)
  const [stats, setStats] = useState<BriefingStatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userStreak, setUserStreak] = useState(0)
  const { currentUser, isLoading: isUserLoading } = useUser()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Empty function for showOptInForm prop since we don't need it on this page
  const handleShowOptInForm = () => {}

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch today's briefing
        const response = await fetch("/api/daily-briefing/today")

        if (!response.ok) {
          throw new Error("Failed to fetch daily briefing")
        }

        const data = await response.json()

        // Ensure we have valid briefing data
        if (data.briefing && typeof data.briefing === "object") {
          setBriefing(data.briefing)

          // Fetch stats for the briefing
          try {
            const statsResponse = await fetch(`/api/daily-briefing/stats?briefingId=${data.briefing.id}`)

            if (statsResponse.ok) {
              const statsData = await statsResponse.json()
              setStats(statsData.stats || emptyStats)
            } else {
              setStats(emptyStats)
            }
          } catch (statsError) {
            console.error("Error fetching stats:", statsError)
            setStats(emptyStats)
          }
        } else {
          setBriefing(emptyBriefing)
          setStats(emptyStats)
        }
      } catch (error) {
        console.error("Error fetching briefing:", error)
        setError("Failed to load today's briefing. Please try again later.")
        setBriefing(emptyBriefing)
        setStats(emptyStats)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBriefing()
  }, [])

  const handleShare = async (platform: string) => {
    if (!briefing || !currentUser) return false

    try {
      const response = await fetch("/api/daily-briefing/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          briefingId: briefing.id,
          platform,
        }),
      })

      if (!response.ok) {
        return false
      }

      // Refresh stats after sharing
      try {
        const statsResponse = await fetch(`/api/daily-briefing/stats?briefingId=${briefing.id}`)

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData.stats || emptyStats)
        }
      } catch (statsError) {
        console.error("Error refreshing stats:", statsError)
      }

      return true
    } catch (error) {
      console.error("Error sharing:", error)
      return false
    }
  }

  const renderContent = () => {
    if (isLoading || isUserLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 text-[#0A3C1F] dark:text-[#FFD700] animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading Sgt. Ken's Daily Briefing...
          </h2>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">{error}</h2>
          <Button
            onClick={() => router.refresh()}
            className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#FFD700] dark:text-[#121212] dark:hover:bg-[#FFD700]/90"
          >
            Try Again
          </Button>
        </div>
      )
    }

    return (
      <>
        {!currentUser && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-center">
            <p className="text-yellow-800 dark:text-yellow-200">
              <strong>Sign in to earn points!</strong> Attend daily briefings and share them to climb the leaderboard.
            </p>
            <div className="mt-2">
              <Button
                onClick={() => router.push("/login")}
                className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#FFD700] dark:text-[#121212] dark:hover:bg-[#FFD700]/90"
              >
                Sign In
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BriefingCard briefing={briefing || emptyBriefing} stats={stats || emptyStats} onShare={handleShare} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="mb-6 overflow-hidden border-[#0A3C1F]/20 dark:border-[#FFD700]/20">
                <div className="relative h-48 w-full">
                  <Image
                    src="/sheriff-briefing.png"
                    alt="Sheriff's Daily Briefing"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-[#0A3C1F] dark:text-[#FFD700]">Daily Briefing Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Calendar className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Stay updated with important information</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Earn points and badges for your recruitment profile</span>
                    </li>
                    <li className="flex items-start">
                      <Share2 className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Share insights with fellow recruits</span>
                    </li>
                    <li className="flex items-start">
                      <Users className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Connect with the SF Deputy Sheriff community</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {stats && <BriefingStats stats={stats} userStreak={userStreak} />}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <BriefingLeaderboard />
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">About Daily Briefings</h2>

          <div className="prose dark:prose-invert max-w-none">
            <p>
              <strong>Sgt. Ken's Daily Briefing</strong> is your daily dose of motivation, information, and guidance on
              your journey to becoming a San Francisco Deputy Sheriff.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-[#0A3C1F] dark:text-[#FFD700]">How It Works</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0A3C1F] dark:bg-[#FFD700] text-white dark:text-[#0A3C1F] text-sm font-bold mr-2 flex-shrink-0">
                      1
                    </span>
                    <span>
                      <strong>Attend Daily:</strong> Visit this page each day to receive Sgt. Ken's latest briefing.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0A3C1F] dark:bg-[#FFD700] text-white dark:text-[#0A3C1F] text-sm font-bold mr-2 flex-shrink-0">
                      2
                    </span>
                    <span>
                      <strong>Earn Points:</strong> Get 5 points just for attending the daily briefing.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0A3C1F] dark:bg-[#FFD700] text-white dark:text-[#0A3C1F] text-sm font-bold mr-2 flex-shrink-0">
                      3
                    </span>
                    <span>
                      <strong>Share & Earn More:</strong> Share the briefing on social media to earn additional points.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0A3C1F] dark:bg-[#FFD700] text-white dark:text-[#0A3C1F] text-sm font-bold mr-2 flex-shrink-0">
                      4
                    </span>
                    <span>
                      <strong>Build Your Streak:</strong> Visit daily to build your attendance streak for special
                      rewards!
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-[#0A3C1F] dark:text-[#FFD700]">Points System</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Daily Attendance</span>
                    <span className="font-bold text-[#0A3C1F] dark:text-[#FFD700]">5 points</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Twitter/X Share</span>
                    <span className="font-bold text-[#0A3C1F] dark:text-[#FFD700]">10 points</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Facebook Share</span>
                    <span className="font-bold text-[#0A3C1F] dark:text-[#FFD700]">10 points</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>LinkedIn Share</span>
                    <span className="font-bold text-[#0A3C1F] dark:text-[#FFD700]">15 points</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Instagram Share</span>
                    <span className="font-bold text-[#0A3C1F] dark:text-[#FFD700]">10 points</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Email Share</span>
                    <span className="font-bold text-[#0A3C1F] dark:text-[#FFD700]">5 points</span>
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2 text-[#0A3C1F] dark:text-[#FFD700]">Why Participate?</h3>
            <p>
              Daily briefings keep you informed, motivated, and connected to the San Francisco Deputy Sheriff
              recruitment community. The points you earn contribute to your overall recruitment profile and may help you
              stand out in the application process.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ImprovedHeader showOptInForm={handleShowOptInForm} isScrolled={isScrolled} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">
                Sgt. Ken's Daily Briefing
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Stay informed, earn points, and advance your journey to becoming a San Francisco Deputy Sheriff.
              </p>
            </div>

            {renderContent()}
          </div>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}
