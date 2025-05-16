import Link from "next/link"

export default function EmergencyAccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-800">Emergency Admin Options</h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            ⚠️ This page provides several options to access admin functionality without normal authentication.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <Link
            href="/direct-admin-access"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-center transition-colors"
          >
            Simple Admin Links
          </Link>

          <Link
            href="/direct-admin-dashboard"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded text-center transition-colors"
          >
            Static Admin Dashboard
          </Link>

          <a
            href="/emergency-admin.html"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded text-center transition-colors"
          >
            Pure HTML Admin Page
          </a>
        </div>

        <p className="text-gray-600 text-sm text-center">
          If one method doesn't work, try another option. The Pure HTML option should work even if there are server-side
          rendering issues.
        </p>
      </div>
    </div>
  )
}
