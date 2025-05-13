"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { UnifiedRegistrationPopup } from "@/components/unified-registration-popup"
import { useUser } from "@/context/user-context"

interface RegistrationContextType {
  openRegistrationPopup: (options?: {
    points?: number
    action?: string
    referral?: string
    applying?: boolean
    userType?: "recruit" | "volunteer" | "admin"
    callbackUrl?: string
    initialTab?: "signin" | "signup" | "optin"
    title?: string
    description?: string
  }) => boolean
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [requiredPoints, setRequiredPoints] = useState<number | undefined>(undefined)
  const [actionName, setActionName] = useState<string | undefined>(undefined)
  const [referralCode, setReferralCode] = useState<string | undefined>(undefined)
  const [isApplying, setIsApplying] = useState(false)
  const [userType, setUserType] = useState<"recruit" | "volunteer" | "admin">("recruit")
  const [callbackUrl, setCallbackUrl] = useState<string | undefined>(undefined)
  const [initialTab, setInitialTab] = useState<"signin" | "signup" | "optin">("signin")
  const [title, setTitle] = useState<string | undefined>(undefined)
  const [description, setDescription] = useState<string | undefined>(undefined)

  const { currentUser } = useUser()

  const openRegistrationPopup = (options = {}) => {
    if (currentUser) {
      // User is already logged in
      return false
    }

    setRequiredPoints(options.points)
    setActionName(options.action)
    setReferralCode(options.referral)
    setIsApplying(!!options.applying)
    setUserType(options.userType || "recruit")
    setCallbackUrl(options.callbackUrl)
    setInitialTab(options.initialTab || "signin")
    setTitle(options.title)
    setDescription(options.description)
    setIsOpen(true)
    return true
  }

  const closeRegistrationPopup = () => {
    setIsOpen(false)
  }

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
        userType={userType}
        callbackUrl={callbackUrl}
        initialTab={initialTab}
        title={title}
        description={description}
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
