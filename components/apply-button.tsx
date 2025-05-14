"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useApply } from "@/context/apply-context"
import { cn } from "@/lib/utils"

interface ApplyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  requiredPoints?: number
  actionName?: string
  redirectUrl?: string
  userType?: "recruit" | "volunteer" | "admin"
}

export default function ApplyButton({
  className,
  variant = "default",
  size = "default",
  requiredPoints,
  actionName = "apply now",
  redirectUrl,
  userType = "recruit",
  ...props
}: ApplyButtonProps) {
  const { openApplyPopup } = useApply()

  const handleClick = () => {
    openApplyPopup({
      requiredPoints,
      actionName,
      redirectUrl,
      userType,
    })
  }

  return (
    <Button variant={variant} size={size} className={cn("font-medium", className)} onClick={handleClick} {...props}>
      {props.children || "Apply Now"}
    </Button>
  )
}
