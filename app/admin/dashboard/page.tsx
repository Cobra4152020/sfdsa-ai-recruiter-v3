import { PerformanceWidget } from "@/components/performance-widget"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/applicants"
          className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Applicant Management</h2>
          <p className="text-gray-600">View and manage applicant data and track recruitment progress</p>
        </Link>

        <PerformanceWidget />
        {/* Other dashboard widgets would go here */}
      </div>

      <div className="mt-6">
        <a href="/admin/performance" className="text-blue-600 hover:text-blue-800 hover:underline">
          View detailed performance metrics →
        </a>
      </div>
    </div>
  )
}
