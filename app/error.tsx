"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShieldLogo } from "@/components/shield-logo"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#121212] p-4">
      <div className="text-[#FFD700] mb-6">
        <ShieldLogo className="w-16 h-16" />
      </div>
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          We apologize for the inconvenience. An error occurred while processing your request.
        </p>
        <div className="space-y-4">
          <Button
            onClick={reset}
            className="bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90 dark:bg-[#FFD700] dark:text-[#0A3C1F] dark:hover:bg-[#FFD700]/90"
          >
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="ml-4 border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/10 dark:border-[#FFD700] dark:text-[#FFD700] dark:hover:bg-[#FFD700]/10"
          >
            Return home
          </Button>
        </div>
      </div>
    </div>
  )
} 