"use client"

import { useState, useEffect } from "react"
import { MessageSquare, X } from "lucide-react"
import { useApply } from "@/context/apply-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { openApplyPopup } = useApply()
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

  const handleChatClick = () => {
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
    <div className="fixed z-50 bottom-6 right-6">
      {isOpen ? (
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Need help?</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Chat with Sgt. Ken to get answers about becoming a Deputy Sheriff.
          </p>
          <button
            onClick={handleChatClick}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Start Chat
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-16 h-16 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
          aria-label="Chat with Sgt. Ken"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
