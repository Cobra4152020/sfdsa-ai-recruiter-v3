"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { HeaderWrapper } from "@/components/header-wrapper"
import { ImprovedFooter } from "@/components/improved-footer"
import { ThemeProvider } from "@/components/theme-provider"
import { UserContextProvider } from "@/context/user-context"
import { SkipToContent } from "@/components/skip-to-content"
import { EnhancedChatBubble } from "@/components/enhanced-chat-bubble"
import { NotificationToastListener } from "@/components/notification-toast"
import { trackPageView } from "@/lib/analytics"

export default function MainLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // Track page views
  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return (
    <ThemeProvider>
      <UserContextProvider>
        <SkipToContent />
        <div className="flex flex-col min-h-screen">
          <HeaderWrapper />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <ImprovedFooter />
        </div>
        <EnhancedChatBubble />
        <NotificationToastListener />
      </UserContextProvider>
    </ThemeProvider>
  )
}
