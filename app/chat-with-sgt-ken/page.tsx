"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useApply } from "@/context/apply-context"
import { useRouter } from "next/navigation"

// Import your existing chat components
import EnhancedChatBubble from "@/components/enhanced-chat-bubble"
import TypingIndicator from "@/components/typing-indicator"

export default function ChatWithSgtKenPage() {
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

  // Your existing chat component JSX goes here
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Chat with Sgt. Ken</h1>

      {/* Your existing chat UI components */}
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Chat messages would go here */}
        <div className="space-y-4 mb-4">
          <EnhancedChatBubble
            message="Hi there! I'm Sgt. Ken. How can I help you with your journey to becoming a Deputy Sheriff?"
            isUser={false}
            timestamp={new Date().toLocaleTimeString()}
          />
          <TypingIndicator />
        </div>

        {/* Chat input would go here */}
        <div className="flex mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 text-white bg-blue-600 rounded-r-md hover:bg-blue-700">Send</button>
        </div>
      </div>
    </div>
  )
}
