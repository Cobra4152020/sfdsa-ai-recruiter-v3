import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { BriefingCard } from "@/components/daily-briefing/briefing-card"
import { BriefingStats } from "@/components/daily-briefing/briefing-stats"
import { BriefingLeaderboard } from "@/components/daily-briefing/briefing-leaderboard"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

// Static fallback content component - this is a Server Component
function FallbackBriefingUI() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Briefing</h1>

      <Alert variant="warning" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Temporary Service Interruption</AlertTitle>
        <AlertDescription>
          We're currently experiencing issues loading the daily briefing. Our team has been notified and is working on a
          fix. Please try again later.
        </AlertDescription>
      </Alert>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Today's Briefing Highlights</h2>
        <p className="mb-4">While we're resolving the technical difficulties, here are some important reminders:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Remember to check your equipment at the beginning of each shift</li>
          <li>Community engagement remains a top priority for the department</li>
          <li>Report any safety concerns through the appropriate channels</li>
          <li>Upcoming training sessions are posted on the internal bulletin board</li>
        </ul>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-xl font-medium mb-3">Contact Information</h3>
          <p>If you need immediate assistance, please contact the department at the non-emergency line.</p>
        </div>
      </div>
    </div>
  )
}

// Fallback briefing data - static data that doesn't require API calls
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

// Main page component
export default function DailyBriefingPage() {
  // Render the fallback UI directly instead of passing it as a prop
  const fallbackUI = <FallbackBriefingUI />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Briefing</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ErrorBoundary fallback={fallbackUI}>
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              {/* Use the static fallback briefing data directly */}
              <BriefingCard briefing={fallbackBriefing} />
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
              <BriefingStats />
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
