"use client"

import type { ReactNode } from "react"
import { usePointsGate } from "@/hooks/use-points-gate"
import { Button } from "@/components/ui/button"
import { useApply } from "@/context/apply-context"

interface PointsGateProps {
  children: ReactNode
  requiredPoints: number
  actionName: string
  fallbackMessage?: string
  redirectUrl?: string
}

export default function PointsGate({
  children,
  requiredPoints,
  actionName,
  fallbackMessage,
  redirectUrl,
}: PointsGateProps) {
  const { userPoints, isLoading, isAuthenticated, checkAccess } = usePointsGate()
  const { openApplyPopup } = useApply()

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 mx-auto border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Checking access...</p>
      </div>
    )
  }

  const hasAccess = checkAccess(requiredPoints, actionName, redirectUrl)

  if (!hasAccess) {
    return (
      <div className="p-8 text-center border rounded-lg shadow-sm bg-gray-50">
        <h3 className="mb-2 text-xl font-bold">Access Required</h3>
        <p className="mb-6 text-gray-600">{fallbackMessage || `You need ${requiredPoints} points to ${actionName}.`}</p>

        {!isAuthenticated ? (
          <Button
            onClick={() => openApplyPopup({ requiredPoints, actionName, redirectUrl })}
            className="px-6 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign In or Create Account
          </Button>
        ) : (
          <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-md">
            You currently have {userPoints} points. You need {requiredPoints - (userPoints || 0)} more points to{" "}
            {actionName}.
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}
