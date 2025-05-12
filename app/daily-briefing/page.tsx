import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Static, guaranteed to render content
const FallbackBriefingUI = () => (
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

// Simplified BriefingCard component with minimal dependencies
function StaticBriefingCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">San Francisco Deputy Sheriff's Daily Briefing</h2>
        <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString()} • Department HQ</p>
      </div>

      <div className="prose max-w-none">
        <h3>Today's Focus: Community Safety</h3>
        <p>
          Welcome to today's briefing. We continue our commitment to serving the San Francisco community with dedication
          and integrity.
        </p>

        <h4>Safety Reminders:</h4>
        <ul>
          <li>Always be aware of your surroundings</li>
          <li>Check your equipment before starting your shift</li>
          <li>Report any safety concerns immediately</li>
        </ul>

        <h4>Community Engagement:</h4>
        <p>
          Our presence in the community is vital for building trust and ensuring safety. Remember to engage positively
          with community members and be a visible presence in your assigned areas.
        </p>

        <h4>Department Updates:</h4>
        <p>
          Regular training sessions continue next week. Please ensure all required documentation is completed properly
          and promptly.
        </p>
      </div>

      <div className="mt-6 pt-4 border-t flex justify-between">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Mark as Attended</button>
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Share Briefing</button>
      </div>
    </div>
  )
}

// Main component with multiple fallback strategies
export default function DailyBriefingPage() {
  return (
    <ErrorBoundary fallback={<FallbackBriefingUI />}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Daily Briefing</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              <ErrorBoundary fallback={<StaticBriefingCard />}>
                {/* Use static content directly instead of iframe with error handling */}
                <div id="static-content">
                  <StaticBriefingCard />
                </div>
              </ErrorBoundary>
            </Suspense>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Briefing Statistics</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Attendance Today:</span>
                  <span className="float-right font-medium">25 Deputies</span>
                </div>
                <div>
                  <span className="text-gray-600">Your Attendance Streak:</span>
                  <span className="float-right font-medium">5 days</span>
                </div>
                <div>
                  <span className="text-gray-600">Department Engagement:</span>
                  <span className="float-right font-medium">87%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Attendance Leaders</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span>Michael Chen</span>
                  <span className="font-medium">21 days</span>
                </li>
                <li className="flex justify-between">
                  <span>Sarah Johnson</span>
                  <span className="font-medium">19 days</span>
                </li>
                <li className="flex justify-between">
                  <span>David Rodriguez</span>
                  <span className="font-medium">18 days</span>
                </li>
                <li className="flex justify-between">
                  <span>Jessica Williams</span>
                  <span className="font-medium">16 days</span>
                </li>
                <li className="flex justify-between">
                  <span>Robert Kim</span>
                  <span className="font-medium">15 days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
