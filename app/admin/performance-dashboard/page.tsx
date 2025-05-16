import { PerformanceDashboard } from "@/components/performance-dashboard"
import { PageWrapper } from "@/components/page-wrapper"

export const metadata = {
  title: "Performance Dashboard | SFDSA AI Recruiter",
  description: "Monitor and analyze application performance metrics",
}

export default function PerformanceDashboardPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Performance Dashboard</h1>
        <PerformanceDashboard />
      </div>
    </PageWrapper>
  )
}
