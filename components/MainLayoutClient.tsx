"use client"

import type React from "react"
import { PageWrapper } from "@/components/page-wrapper"

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper>
      <main id="main-content" className="flex-1 pt-16 pb-12 bg-background dark:bg-[#121212]">
        {children}
      </main>
    </PageWrapper>
  )
} 