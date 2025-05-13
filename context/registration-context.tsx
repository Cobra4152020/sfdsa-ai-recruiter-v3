"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useRegistrationPopup } from "@/hooks/use-registration-popup"
import { UnifiedRegistrationPopup } from "@/components/unified-registration-popup"

interface RegistrationContextType {
  openRegistrationPopup: (options?: {
    points?: number
    action?: string
    referral?: string
    applying?: boolean
  }) => boolean
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const {
    isOpen,
    requiredPoints,
    actionName,
    referralCode,
    isApplying,
    openRegistrationPopup,
    closeRegistrationPopup,
  } = useRegistrationPopup()

  return (
    <RegistrationContext.Provider value={{ openRegistrationPopup }}>
      {children}
      <UnifiedRegistrationPopup
        isOpen={isOpen}
        onClose={closeRegistrationPopup}
        requiredPoints={requiredPoints}
        actionName={actionName}
        referralCode={referralCode}
        isApplying={isApplying}
      />
    </RegistrationContext.Provider>
  )
}

export function useRegistration() {
  const context = useContext(RegistrationContext)
  if (context === undefined) {
    throw new Error("useRegistration must be used within a RegistrationProvider")
  }
  return context
}
