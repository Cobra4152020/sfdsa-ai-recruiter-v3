import { FixLoginButton } from "@/components/admin/fix-login-button"

export default function EmergencyLoginFixPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-red-600">Emergency Login Fix</h1>
          <p className="text-gray-600">
            This is a minimal page for fixing login issues when the main site is inaccessible.
          </p>
        </div>

        <FixLoginButton />

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>After fixing, try logging in again at:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <a href="/login" className="text-blue-600 hover:underline">
                /login
              </a>{" "}
              - Regular users
            </li>
            <li>
              <a href="/admin-login" className="text-blue-600 hover:underline">
                /admin-login
              </a>{" "}
              - Administrators
            </li>
            <li>
              <a href="/volunteer-login" className="text-blue-600 hover:underline">
                /volunteer-login
              </a>{" "}
              - Volunteers
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
