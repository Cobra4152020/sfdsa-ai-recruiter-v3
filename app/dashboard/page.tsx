import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Dashboard - SFDSA Recruiter",
  description: "Your recruitment dashboard for the San Francisco Deputy Sheriff's Association.",
}

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-6">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Welcome to the SFDSA Recruiter Dashboard</h2>
            <p className="text-gray-600 mb-4">
              This dashboard provides access to all the features of the SFDSA Recruiter platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <a
                href="/daily-briefing"
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mr-4 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-calendar-days"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                    <path d="M8 14h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 18h.01" />
                    <path d="M12 18h.01" />
                    <path d="M16 18h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Daily Briefing</h3>
                  <p className="text-sm text-gray-500">Check in with Sgt. Ken's daily briefing</p>
                </div>
              </a>
              <a href="/profile" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mr-4 text-purple-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Profile</h3>
                  <p className="text-sm text-gray-500">Manage your profile information</p>
                </div>
              </a>
              <a
                href="/admin/briefings"
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mr-4 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-settings"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Admin</h3>
                  <p className="text-sm text-gray-500">Manage briefings and other admin tasks</p>
                </div>
              </a>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  )
}
