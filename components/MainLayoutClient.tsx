"use client"

import type React from "react"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ImprovedHeader />
      <main id="main-content" className="flex-1 bg-white dark:bg-gray-900">
        {children}
      </main>
      <ImprovedFooter />
    </div>
  )
} 