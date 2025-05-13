import Link from "next/link"

export default function AdminLoginBypass() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>

        <div className="text-center mb-6">
          <p className="text-red-600 font-bold text-lg mb-2">⚠️ Authentication Bypassed ⚠️</p>
          <p className="text-gray-600 mb-4">For development purposes only. Do not use in production.</p>
        </div>

        <Link
          href="/admin/dashboard"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-center transition-colors"
        >
          Access Admin Dashboard
        </Link>
      </div>
    </div>
  )
}
