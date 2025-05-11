import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VolunteerPendingPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-[#0A3C1F] mb-4">Account Verification Pending</h1>

        <div className="mb-6">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <p className="text-gray-600 mb-4">
            Your volunteer recruiter account is pending verification. Our team will review your application and activate
            your account soon.
          </p>

          <p className="text-gray-600 mb-6">
            You'll receive an email notification once your account has been verified. This process typically takes 1-2
            business days.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>

          <Button asChild className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/80">
            <Link href="/resend-confirmation">Resend Verification Email</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
