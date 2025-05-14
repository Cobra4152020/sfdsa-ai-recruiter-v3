"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { useApply } from "@/context/apply-context"

interface AskSgtKenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function AskSgtKenButton({
  className,
  variant = "default",
  size = "default",
  ...props
}: AskSgtKenButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { openApplyPopup } = useApply()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()
  }, [supabase])

  const handleClick = async () => {
    if (isAuthenticated === null) {
      // Still loading auth state
      return
    }

    if (isAuthenticated) {
      router.push("/chat-with-sgt-ken")
    } else {
      openApplyPopup({
        actionName: "chat with Sgt. Ken",
        redirectUrl: "/chat-with-sgt-ken",
      })
    }
  }

  return (
    <Button variant={variant} size={size} className={cn("font-medium", className)} onClick={handleClick} {...props}>
      <MessageSquare className="w-4 h-4 mr-2" />
      {props.children || "Ask Sgt. Ken"}
    </Button>
  )
}
