"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DataFetchErrorProps {
  message?: string
  onRetry?: () => void
}

export function DataFetchError({
  message = "Failed to load data. Please try again later.",
  onRetry,
}: DataFetchErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Data Loading Error</h3>
      <p className="text-gray-600 text-center mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  )
}
