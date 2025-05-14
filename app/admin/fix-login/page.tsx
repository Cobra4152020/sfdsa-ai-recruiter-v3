import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { FixLoginButton } from "@/components/admin/fix-login-button"

export default function FixLoginPage() {
  return (
    <>
      <ImprovedHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Login System Repair</h1>

          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              This utility will fix common issues with the login system, including database constraints, user role
              assignments, and table synchronization problems.
            </p>

            <p className="text-gray-600 mb-4">
              If you're experiencing login issues, click the button below to attempt an automatic repair.
            </p>
          </div>

          <FixLoginButton />

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h2 className="font-semibold text-yellow-800 mb-2">Important Note</h2>
            <p className="text-yellow-700 text-sm">
              If you continue to experience login issues after running this repair, please contact the system
              administrator or check the server logs for more detailed error information.
            </p>
          </div>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}
