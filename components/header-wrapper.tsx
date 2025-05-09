"use client"

import { useState } from "react"
import { ImprovedHeader } from "./improved-header"
import { OptInForm } from "./opt-in-form"

export function HeaderWrapper() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const showOptInForm = (applying = false) => {
    setIsApplying(applying)
    setIsOptInFormOpen(true)
  }

  return (
    <>
      <ImprovedHeader showOptInForm={showOptInForm} />
      {isOptInFormOpen && (
        <OptInForm isOpen={isOptInFormOpen} onClose={() => setIsOptInFormOpen(false)} isApplying={isApplying} />
      )}
    </>
  )
}
