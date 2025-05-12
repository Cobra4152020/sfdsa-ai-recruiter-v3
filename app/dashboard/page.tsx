import { Suspense } from "react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardActions } from "@/components/dashboard/dashboard-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Dashboard - SFDSA Recruiter",
  description: "Your recruitment dashboard for the San Francisco Deputy Sheriff's Association.",
}

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Suspense fallback={<Skeleton className="h-[180px] w-full" />}>
          <DashboardStats />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <RecentActivity />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <DashboardActions />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
