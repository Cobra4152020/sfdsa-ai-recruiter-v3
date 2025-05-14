"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useApply } from "@/context/apply-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

interface ApplyButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
  userType?: "recruit" | "volunteer" | "admin"
  redirectUrl?: string
  children?: React.ReactNode
}

export default function ApplyButton({
  className,
  variant = "default",
  size = "default",
  userType = "recruit",
  redirectUrl,
  children = "Apply Now",
}: ApplyButtonProps) {
  const { openApplyPopup } = useApply()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()
  }, [supabase])

  const handleClick = () => {
    if (!isAuthenticated) {
      openApplyPopup({
        userType,
        redirectUrl,
        actionName: "apply",
      })
    } else if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }

  return (
    <Button className={className} variant={variant} size={size} onClick={handleClick}>
      {children}
    </Button>
  )
}
