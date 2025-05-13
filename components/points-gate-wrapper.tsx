"use client"

import type { ReactNode } from "react"
import { useUser } from "@/context/user-context"
import { useRegistration } from "@/context/registration-context"

interface PointsGateWrapperProps {
  children: ReactNode
  requiredPoints: number
  actionName?: string
  fallback?: ReactNode
}

export function PointsGateWrapper({ children, requiredPoints, actionName, fallback }: PointsGateWrapperProps) {
  const { currentUser } = useUser()
  const { openRegistrationPopup } = useRegistration()

  const handleAction = () => {
    if (!currentUser) {
      openRegistrationPopup({ points: requiredPoints, action: actionName })
      return
    }

    // If user doesn't have enough points, show fallback or message
    if (currentUser.participation_count < requiredPoints) {
      return (
        fallback || (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md text-center">
            <p className="text-amber-800 dark:text-amber-300">
              You need {requiredPoints} points to access this feature. You currently have{" "}
              {currentUser.participation_count} points.
            </p>
          </div>
        )
      )
    }

    // User has enough points, show the children
    return children
  }

  return handleAction()
}
