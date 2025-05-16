"use client"

import type { ReactNode } from "react"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { AuthTriggerButton } from "@/components/auth-trigger-button"

interface PointsGateProps {
  children: ReactNode
  requiredPoints: number
  fallbackMessage?: string
}

export function PointsGate({
  children,
  requiredPoints,
  fallbackMessage = "You need more points to access this content",
}: PointsGateProps) {
  const { isAuthenticated, userPoints } = useAuthGuard()

  if (isAuthenticated === null) {
    // Loading state
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-md"></div>
  }

  if (!isAuthenticated) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-6 text-center">
        <p className="mb-4">{fallbackMessage}</p>
        <AuthTriggerButton mode="register" role="recruit" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
          Sign Up to Access
        </AuthTriggerButton>
      </div>
    )
  }

  if (userPoints < requiredPoints) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-6 text-center">
        <p className="mb-2">You need {requiredPoints} points to access this content.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You currently have {userPoints} points. Earn more by participating in activities.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
