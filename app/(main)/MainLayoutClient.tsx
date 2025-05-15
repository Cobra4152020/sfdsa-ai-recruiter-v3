"use client"

import type React from "react"
import { ImprovedFooter } from "@/components/improved-footer"
import { OptInForm } from "@/components/opt-in-form"
import { useState } from "react"
import { UserProvider } from "@/context/user-context"
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button"
import { UnifiedAuthModal } from "@/components/unified-auth-modal"
import { AuthModalProvider } from "@/context/auth-modal-context"
import { ExactHeaderMatch } from "@/components/exact-header-match"

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const showOptInForm = (applying = false) => {
    setIsApplying(applying)
    setIsOptInFormOpen(true)
  }

  const handleCloseOptInForm = () => {
    setIsOptInFormOpen(false)
  }

  return (
    <UserProvider>
      <AuthModalProvider>
        <div className="min-h-screen flex flex-col">
          <ExactHeaderMatch />
          <main id="main-content" className="flex-1 pt-16 pb-12 bg-background dark:bg-[#121212]">
            {children}
          </main>
          <ImprovedFooter />

          {isOptInFormOpen && (
            <OptInForm onClose={handleCloseOptInForm} isApplying={isApplying} isOpen={isOptInFormOpen} />
          )}
          <div className="fixed bottom-6 right-6 z-50">
            <AskSgtKenButton position="fixed" variant="secondary" />
          </div>
          <UnifiedAuthModal />
        </div>
      </AuthModalProvider>
    </UserProvider>
  )
}
