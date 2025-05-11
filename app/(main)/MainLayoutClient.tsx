"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { SkipToContent } from "@/components/skip-to-content"
import { usePathname } from "next/navigation"
import { NotificationToastListener } from "@/components/notification-toast-listener"
import { NotificationPoller } from "@/components/notification-poller"
import { useUser } from "@/context/user-context"
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button"

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useUser()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Check if we're on the homepage
  const isHomePage = pathname === "/"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      <SkipToContent />
      <ImprovedHeader isScrolled={isScrolled} showOptInForm={() => {}} />
      <main id="main-content" className="min-h-screen pt-8">
        {children}
      </main>
      {/* Floating chat bubble positioned on the right side */}
      <div className="fixed bottom-6 right-6 z-50">
        <AskSgtKenButton position="fixed" variant="secondary" />
      </div>
      <ImprovedFooter />
      <NotificationToastListener />
      {/* Add the notification poller if user is logged in */}
      {user && <NotificationPoller userId={user.id} />}
    </>
  )
}
