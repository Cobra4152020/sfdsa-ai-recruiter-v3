import Link from "next/link"

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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Shortcuts</h1>

        <div className="text-center mb-6">
          <p className="text-red-600 font-bold">⚠️ Development Mode: Authentication Bypassed ⚠️</p>
          <p className="text-gray-600">For testing purposes only. Do not use in production.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="block bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md p-4 text-center transition-colors"
            >
              {route.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <Link href="/admin-login" className="text-blue-600 hover:text-blue-800">
              Admin Login
            </Link>
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              User Login
            </Link>
            <Link href="/volunteer-login" className="text-blue-600 hover:text-blue-800">
              Volunteer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
