"use client"

import { Suspense, useEffect, useState } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingLeaderboard } from "@/components/daily-briefing/briefing-leaderboard"
import { useToast } from "@/components/ui/use-toast"
import type { DailyBriefing, BriefingStats as BriefingStatsType } from "@/lib/daily-briefing-service"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

// Main page component
export default function DailyBriefingPage() {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null)
  const [stats, setStats] = useState<BriefingStatsType>({
    total_attendees: 0,
    total_shares: 0,
    user_attended: false,
    user_shared: false,
    user_platforms_shared: [],
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBriefingData = async () => {
      try {
        setLoading(true)
        // Fetch today's briefing
        const response = await fetch('/api/daily-briefing/today')
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setBriefing(data.briefing)
        setStats(data.stats)
      } catch (error) {
        console.error('Error fetching briefing:', error)
        toast({
          title: "Error",
          description: "Failed to load today's briefing. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBriefingData()
  }, [toast])

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0A3C1F] mb-4">
              Sgt. Ken's Daily Briefing
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay informed, earn points, and advance your journey to becoming a San Francisco Deputy Sheriff.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-[#0A3C1F] text-white">
              <div className="flex justify-between items-center">
                <CardTitle>Today's Briefing</CardTitle>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <h2>Welcome to Today's Briefing</h2>
                <p>
                  This is your daily update on important information, training opportunities, and department news.
                  Check back daily to stay informed and earn participation points.
                </p>
                
                <h3>Today's Focus</h3>
                <ul>
                  <li>Department Updates</li>
                  <li>Training Opportunities</li>
                  <li>Community Engagement</li>
                  <li>Recruitment News</li>
                </ul>

                <h3>Earn Points</h3>
                <p>
                  Participate in daily briefings to earn points towards your recruitment journey:
                </p>
                <ul>
                  <li>Read the full briefing: 5 points</li>
                  <li>Complete daily quiz: 10 points</li>
                  <li>Share on social media: 15 points</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
