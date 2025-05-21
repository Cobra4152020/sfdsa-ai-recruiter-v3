"use client"

import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/user-context"
import { RegistrationProvider } from "@/context/registration-context"
import { AuthModalProvider } from "@/context/auth-modal-context"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { OptInForm } from "@/components/opt-in-form"
import { UnifiedAuthModal } from "@/components/unified-auth-modal"
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button"
import { WebSocketErrorHandler } from "@/components/websocket-error-handler"
import { ErrorMonitor } from "@/components/error-monitor"
import PerformanceMonitor from "@/components/performance-monitor"

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
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
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <UserProvider>
        <RegistrationProvider>
          <AuthModalProvider>
            <div className="min-h-screen flex flex-col">
              <ImprovedHeader showOptInForm={showOptInForm} />
              <main id="main-content" className="flex-1 pt-16 pb-12 bg-background dark:bg-[#121212]">
                <WebSocketErrorHandler />
                <ErrorMonitor />
                <PerformanceMonitor />
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
        </RegistrationProvider>
      </UserProvider>
    </ThemeProvider>
  )
} 