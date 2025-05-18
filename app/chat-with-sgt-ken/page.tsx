"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { ChatSuggestions } from "@/components/chat-suggestions"
import { ChatTypingIndicator } from "@/components/chat-typing-indicator"
import { ChatWelcomeMessage } from "@/components/chat-welcome-message"
import { ChatError } from "@/components/chat-error"
import { ChatRateLimit } from "@/components/chat-rate-limit"
import { ChatUnavailable } from "@/components/chat-unavailable"
import { ChatReconnecting } from "@/components/chat-reconnecting"
import { useChatWebSocket } from "@/hooks/use-chat-websocket"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { useTypingIndicator } from "@/hooks/use-typing-indicator"
import { useMessageHistory } from "@/hooks/use-message-history"
import { useRateLimit } from "@/hooks/use-rate-limit"
import { useErrorHandling } from "@/hooks/use-error-handling"
import { useReconnection } from "@/hooks/use-reconnection"

export default function ChatWithSgtKenPage() {
  const { currentUser } = useUser()
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)

  // Custom hooks for chat functionality
  const { messages, addMessage, clearMessages } = useMessageHistory()
  const { startTyping, stopTyping } = useTypingIndicator(setIsTyping)
  const { checkRateLimit } = useRateLimit(setIsRateLimited)
  const { handleError } = useErrorHandling(setError)
  const { reconnect } = useReconnection(setIsReconnecting)

  // WebSocket connection
  const { sendMessage, closeConnection } = useChatWebSocket({
    onMessage: (message) => {
      addMessage(message)
      stopTyping()
    },
    onError: handleError,
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
  })

  // Scroll to bottom when new messages arrive
  useScrollToBottom(scrollAreaRef, messages)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeConnection()
    }
  }, [closeConnection])

  const handleSendMessage = async (content: string) => {
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "Please wait while we reconnect...",
        variant: "destructive",
      })
      return
    }

    if (!checkRateLimit()) {
      return
    }

    try {
      startTyping()
      await sendMessage(content)
    } catch (error) {
      handleError(error)
      stopTyping()
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-t-4 border-t-[#0A3C1F]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#0A3C1F]">
              Chat with Sgt. Ken
            </CardTitle>
            <CardDescription className="text-center">
              Ask questions about becoming a San Francisco Deputy Sheriff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] flex flex-col">
              <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
                <div className="space-y-4">
                  <ChatWelcomeMessage />
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  {isTyping && <ChatTypingIndicator />}
                </div>
              </ScrollArea>

              <div className="mt-4 space-y-4">
                {error && <ChatError error={error} onRetry={reconnect} />}
                {isReconnecting && <ChatReconnecting />}
                {isRateLimited && <ChatRateLimit />}
                {!isConnected && !isReconnecting && <ChatUnavailable onRetry={reconnect} />}

                <ChatSuggestions onSelect={handleSendMessage} />
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={!isConnected || isRateLimited}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
