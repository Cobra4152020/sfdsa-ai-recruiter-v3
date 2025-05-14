import type { Metadata } from "next"
import PointsSummary from "@/components/user-dashboard/points-summary"
import Leaderboard from "@/components/user-dashboard/leaderboard"
import ActiveChallenges from "@/components/user-dashboard/active-challenges"
import ImprovedHeader from "@/components/improved-header"

export const metadata: Metadata = {
  title: "User Dashboard | SF Deputy Sheriff's Association",
  description: "View your points, badges, and active challenges",
}

export default function UserDashboardPage() {
  return (
    <>
      <ImprovedHeader />
      <main className="container px-4 py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Your Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-1">
            <PointsSummary />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <Leaderboard />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <ActiveChallenges />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Your Progress</h2>
          {/* Additional dashboard components can be added here */}
        </div>
      </main>
    </>
  )
}
