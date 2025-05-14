"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import UnifiedApplyPopup from "@/components/unified-apply-popup"

interface ApplyContextType {
  openApplyPopup: (options?: {
    requiredPoints?: number
    actionName?: string
    redirectUrl?: string
    userType?: "recruit" | "volunteer" | "admin"
  }) => void
  closeApplyPopup: () => void
  isApplyPopupOpen: boolean
}

const ApplyContext = createContext<ApplyContextType | undefined>(undefined)

export function ApplyProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [requiredPoints, setRequiredPoints] = useState(0)
  const [actionName, setActionName] = useState("continue")
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined)
  const [userType, setUserType] = useState<"recruit" | "volunteer" | "admin">("recruit")

  const openApplyPopup = (options?: {
    requiredPoints?: number
    actionName?: string
    redirectUrl?: string
    userType?: "recruit" | "volunteer" | "admin"
  }) => {
    setRequiredPoints(options?.requiredPoints || 0)
    setActionName(options?.actionName || "continue")
    setRedirectUrl(options?.redirectUrl)
    setUserType(options?.userType || "recruit")
    setIsOpen(true)
  }

  const closeApplyPopup = () => {
    setIsOpen(false)
  }

  return (
    <ApplyContext.Provider
      value={{
        openApplyPopup,
        closeApplyPopup,
        isApplyPopupOpen: isOpen,
      }}
    >
      {children}
      <UnifiedApplyPopup
        isOpen={isOpen}
        onClose={closeApplyPopup}
        requiredPoints={requiredPoints}
        actionName={actionName}
        redirectUrl={redirectUrl}
        userType={userType}
      />
    </ApplyContext.Provider>
  )
}

export function useApply() {
  const context = useContext(ApplyContext)
  if (context === undefined) {
    throw new Error("useApply must be used within an ApplyProvider")
  }
  return context
}
