"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingLeaderboard } from "@/components/daily-briefing/briefing-leaderboard"

// Static briefing data for demo purposes
const staticBriefing = {
  id: "static-briefing",
  title: "San Francisco Deputy Sheriff's Daily Briefing",
  content: `
    <h3>Today's Focus: Community Safety</h3>
    <p>
      Welcome to today's briefing. We continue our commitment to serving the San Francisco 
      community with dedication and integrity.
    </p>
    
    <h4>Safety Reminders:</h4>
    <ul>
      <li>Always be aware of your surroundings</li>
      <li>Check your equipment before starting your shift</li>
      <li>Report any safety concerns immediately</li>
    </ul>
    
    <h4>Community Engagement:</h4>
    <p>
      Our presence in the community is vital for building trust and ensuring safety. 
      Remember to engage positively with community members and be a visible presence 
      in your assigned areas.
    </p>
    
    <h4>Department Updates:</h4>
    <p>
      Regular training sessions continue next week. Please ensure all required documentation 
      is completed properly and promptly.
    </p>
  `,
  date: new Date().toISOString(),
  location: "Department HQ",
  keyPoints: [
    "Always be aware of your surroundings",
    "Check your equipment before starting your shift",
    "Report any safety concerns immediately",
    "Complete all required documentation promptly",
  ],
}

// Static stats for demo purposes
const staticStats = {
  total_attendees: 42,
  total_shares: 15,
  user_attended: false,
  user_shared: false,
  user_platforms_shared: [],
}

// Main page component
export default function DailyBriefingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Briefing</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ErrorBoundary
            fallback={
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Today's Briefing</h2>
                <p className="text-gray-500">The briefing content is temporarily unavailable.</p>
              </div>
            }
          >
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              <BriefingCard briefing={staticBriefing} />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="space-y-8">
          <ErrorBoundary
            fallback={
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Briefing Statistics</h3>
                <p className="text-gray-500">Statistics temporarily unavailable</p>
              </div>
            }
          >
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              <BriefingStats stats={staticStats} userStreak={0} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Attendance Leaders</h3>
                <p className="text-gray-500">Leaderboard temporarily unavailable</p>
              </div>
            }
          >
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              <BriefingLeaderboard />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
