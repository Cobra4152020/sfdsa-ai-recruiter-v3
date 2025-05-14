"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useApply } from "@/context/apply-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AskSgtKenButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
}

export default function AskSgtKenButton({ className, variant = "default", size = "default" }: AskSgtKenButtonProps) {
  const { openApplyPopup } = useApply()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

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
        actionName: "chat with Sgt. Ken",
        redirectUrl: "/chat-with-sgt-ken",
      })
    } else {
      router.push("/chat-with-sgt-ken")
    }
  }

  return (
    <Button className={className} variant={variant} size={size} onClick={handleClick}>
      <MessageSquare className="w-4 h-4 mr-2" />
      Ask Sgt. Ken
    </Button>
  )
}
