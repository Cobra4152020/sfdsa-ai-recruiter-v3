"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  // Check if the error is a redirect error, which we can safely ignore
  if (error.message === "NEXT_REDIRECT" || error.message.includes("Redirect")) {
    return null // Don't show an error for redirects
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
      <p className="text-gray-600 max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" asChild className="flex items-center gap-2">
          <a href="/">
            <Home className="h-4 w-4" />
            Go Home
          </a>
        </Button>
      </div>
    </div>
  )
}
