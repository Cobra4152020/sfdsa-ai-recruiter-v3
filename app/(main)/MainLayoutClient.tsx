"use client"

import type React from "react"

import { useState } from "react"
import { ImprovedHeader } from "../../components/improved-header"
import { ImprovedFooter } from "../../components/improved-footer"
import { SkipToContent } from "../../components/skip-to-content"
import { NotificationToastListener } from "../../components/notification-toast-listener"
import { NotificationPoller } from "../../components/notification-poller"
import { useUser } from "@/context/user-context"

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [showOptInForm, setShowOptInForm] = useState(false)
  const { currentUser } = useUser()

  return (
    <>
      <SkipToContent />
      <ImprovedHeader showOptInForm={(isApplying) => setShowOptInForm(isApplying || true)} />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <ImprovedFooter />
      <NotificationToastListener />
      {currentUser && <NotificationPoller userId={currentUser.id} />}
    </>
  )
}
