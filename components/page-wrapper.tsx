"use client"

import type React from "react"

import { useState } from "react"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { OptInForm } from "@/components/opt-in-form"
import { UserProvider } from "@/context/user-context"

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
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
      <div className="min-h-screen flex flex-col">
        <ImprovedHeader showOptInForm={showOptInForm} />
        <main id="main-content" className="flex-1 pt-40 pb-12 bg-[#F8F5EE] dark:bg-[#121212]">
          {children}
        </main>
        <ImprovedFooter />

        {isOptInFormOpen && <OptInForm onClose={handleCloseOptInForm} />}
      </div>
    </UserProvider>
  )
}
