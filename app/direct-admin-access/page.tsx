export default function DirectAdminAccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-800">Direct Admin Access</h1>

        <p className="text-red-600 font-bold text-center mb-4">⚠️ Authentication Bypassed ⚠️</p>
        <p className="text-gray-600 text-center mb-6">For development purposes only.</p>

        <div className="space-y-3">
          <a
            href="/admin/dashboard?emergency_bypass=true"
            target="_blank"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-center transition-colors"
            rel="noreferrer"
          >
            Dashboard
          </a>
          <a
            href="/admin/sql-runner?emergency_bypass=true"
            target="_blank"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded text-center transition-colors"
            rel="noreferrer"
          >
            SQL Runner
          </a>
          <a
            href="/admin/database-schema?emergency_bypass=true"
            target="_blank"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded text-center transition-colors"
            rel="noreferrer"
          >
            Database Schema
          </a>
          <a
            href="/admin/fix-login?emergency_bypass=true"
            target="_blank"
            className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded text-center transition-colors"
            rel="noreferrer"
          >
            Fix Login
          </a>
        </div>
      </div>
    </div>
  )
}
