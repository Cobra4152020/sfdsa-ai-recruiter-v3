"use client"

import { useState, useCallback } from "react"
import { useUser } from "@/context/user-context"

export function useRegistrationPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [requiredPoints, setRequiredPoints] = useState<number | undefined>(undefined)
  const [actionName, setActionName] = useState<string | undefined>(undefined)
  const [referralCode, setReferralCode] = useState<string | undefined>(undefined)
  const [isApplying, setIsApplying] = useState(false)

  const { currentUser } = useUser()

  const openRegistrationPopup = useCallback(
    ({
      points,
      action,
      referral,
      applying,
    }: {
      points?: number
      action?: string
      referral?: string
      applying?: boolean
    } = {}) => {
      if (currentUser) {
        // User is already logged in
        return false
      }

      setRequiredPoints(points)
      setActionName(action)
      setReferralCode(referral)
      setIsApplying(!!applying)
      setIsOpen(true)
      return true
    },
    [currentUser],
  )

  const closeRegistrationPopup = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    requiredPoints,
    actionName,
    referralCode,
    isApplying,
    openRegistrationPopup,
    closeRegistrationPopup,
  }
}
