"use client"

import { Suspense, useEffect, useState } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingLeaderboard } from "@/components/daily-briefing/briefing-leaderboard"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

// Fallback briefing data - used when database fetch fails
const fallbackBriefing = {
  id: "fallback-briefing",
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

// Function to check if a table exists in the database
async function checkTableExists(tableName: string) {
  try {
    const supabase = createClientComponentClient()

    // Try to query the information_schema to check if the table exists
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .maybeSingle()

    if (error) {
      console.warn(`Error checking if ${tableName} table exists:`, error)
      return false
    }

    return !!data
  } catch (error) {
    console.error(`Exception in checkTableExists for ${tableName}:`, error)
    return false
  }
}

// Function to fetch today's briefing from the database
async function getTodaysBriefing() {
  try {
    // First check if the daily_briefings table exists
    const tableExists = await checkTableExists("daily_briefings")

    if (!tableExists) {
      console.warn("daily_briefings table does not exist")
      return {
        briefing: fallbackBriefing,
        error: "The daily briefings system is not yet set up. Please contact an administrator.",
      }
    }

    const supabase = createClientComponentClient()

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Query the daily_briefings table for today's briefing
    const { data, error } = await supabase.from("daily_briefings").select("*").eq("date", today).limit(1).single()

    if (error) {
      console.warn("Error fetching today's briefing:", error)

      // If no briefing for today, get the most recent one
      const { data: recentData, error: recentError } = await supabase
        .from("daily_briefings")
        .select("*")
        .order("date", { ascending: false })
        .limit(1)
        .single()

      if (recentError) {
        console.warn("Error fetching recent briefing:", recentError)
        return { briefing: fallbackBriefing, error: "Failed to load briefing from database" }
      }

      return { briefing: recentData, error: null }
    }

    return { briefing: data, error: null }
  } catch (error) {
    console.error("Exception in getTodaysBriefing:", error)
    return { briefing: fallbackBriefing, error: "An unexpected error occurred" }
  }
}

// Main page component
export default function DailyBriefingPage() {
  const [briefing, setBriefing] = useState(fallbackBriefing)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total_attendees: 0,
    total_shares: 0,
    user_attended: false,
    user_shared: false,
    user_platforms_shared: [],
  })

  useEffect(() => {
    const fetchBriefing = async () => {
      const { briefing: fetchedBriefing, error: fetchError } = await getTodaysBriefing()
      setBriefing(fetchedBriefing)
      setError(fetchError)
    }

    fetchBriefing()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Briefing</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
              <BriefingCard briefing={briefing} />
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
              <BriefingStats stats={stats} userStreak={0} />
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
