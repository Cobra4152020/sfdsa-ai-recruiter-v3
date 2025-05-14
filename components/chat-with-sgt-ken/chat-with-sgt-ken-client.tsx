"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useApply } from "@/context/apply-context"
import { useRouter } from "next/navigation"
import ChatInterface from "@/components/chat-with-sgt-ken/chat-interface"
import ImprovedHeader from "@/components/improved-header"

export default function ChatWithSgtKenClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { openApplyPopup } = useApply()
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setIsLoading(false)

      if (!session) {
        openApplyPopup({
          actionName: "chat with Sgt. Ken",
          redirectUrl: "/chat-with-sgt-ken",
        })

        // Redirect to home after a short delay
        const timeout = setTimeout(() => {
          router.push("/")
        }, 100)

        return () => clearTimeout(timeout)
      }
    }

    checkAuth()
  }, [supabase, openApplyPopup, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  return (
    <>
      <ImprovedHeader />
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Chat with Sgt. Ken</h1>
        <p className="mb-6 text-gray-600">
          Have questions about becoming a Deputy Sheriff? Sgt. Ken is here to help! Ask about the application process,
          requirements, training, or anything else you'd like to know.
        </p>

        <ChatInterface />
      </div>
    </>
  )
}
