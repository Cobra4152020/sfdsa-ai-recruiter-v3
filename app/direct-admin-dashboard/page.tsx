// This is a static admin dashboard with no authentication or database dependencies
export default function DirectAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-800">
          Admin Dashboard (No Auth)
        </h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            ⚠️ This is a static version of the admin dashboard with no
            authentication or database dependencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Static Cards */}
          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
            <h2 className="font-bold text-xl mb-2">Database Access</h2>
            <p className="text-gray-600 mb-4">
              Test and fix database connections
            </p>
            <a
              href="/admin/sql-runner?emergency_bypass=true"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 font-semibold"
              rel="noreferrer"
            >
              Open SQL Runner →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-green-500">
            <h2 className="font-bold text-xl mb-2">Schema Verification</h2>
            <p className="text-gray-600 mb-4">Check database table structure</p>
            <a
              href="/admin/database-schema?emergency_bypass=true"
              target="_blank"
              className="text-green-600 hover:text-green-800 font-semibold"
              rel="noreferrer"
            >
              Verify Schema →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-t-4 border-red-500">
            <h2 className="font-bold text-xl mb-2">Login System</h2>
            <p className="text-gray-600 mb-4">Fix authentication issues</p>
            <a
              href="/admin/fix-login?emergency_bypass=true"
              target="_blank"
              className="text-red-600 hover:text-red-800 font-semibold"
              rel="noreferrer"
            >
              Repair Login →
            </a>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a
              href="/admin/deployment?emergency_bypass=true"
              target="_blank"
              className="block p-3 bg-gray-100 hover:bg-gray-200 rounded-md"
              rel="noreferrer"
            >
              Check Deployment Status
            </a>
            <a
              href="/admin/health?emergency_bypass=true"
              target="_blank"
              className="block p-3 bg-gray-100 hover:bg-gray-200 rounded-md"
              rel="noreferrer"
            >
              System Health Check
            </a>
            <a
              href="/admin/email-diagnostics?emergency_bypass=true"
              target="_blank"
              className="block p-3 bg-gray-100 hover:bg-gray-200 rounded-md"
              rel="noreferrer"
            >
              Email System Diagnostics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
