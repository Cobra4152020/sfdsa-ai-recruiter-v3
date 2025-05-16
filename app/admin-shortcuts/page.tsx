import Link from "next/link"
import { PageWrapper } from "@/components/page-wrapper"

export default function AdminShortcuts() {
  // List of common admin routes
  const adminRoutes = [
    { path: "/admin/dashboard", name: "Admin Dashboard" },
    { path: "/admin/users", name: "User Management" },
    { path: "/admin/analytics", name: "Analytics" },
    { path: "/admin/performance-dashboard", name: "Performance Dashboard" },
    { path: "/admin/applicants", name: "Applicant Management" },
    { path: "/admin/donation-analytics", name: "Donation Analytics" },
    { path: "/admin/setup", name: "Admin Setup" },
    { path: "/admin/sql-runner", name: "SQL Runner" },
    { path: "/admin/database-schema", name: "Database Schema" },
    { path: "/admin/email-diagnostics", name: "Email Diagnostics" },
    { path: "/admin/volunteers", name: "Volunteer Management" },
    { path: "/admin/tiktok-challenges", name: "TikTok Challenges" },
    { path: "/admin/login-audit", name: "Login Audit" },
    { path: "/admin/health", name: "System Health" },
    { path: "/admin/deployment", name: "Deployment Status" },
  ]

  return (
    <PageWrapper>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Quick Links</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              {route.name}
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
