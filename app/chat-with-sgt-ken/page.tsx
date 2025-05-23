"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import {
  ChatMessage,
  ChatInput,
  ChatSuggestions,
  ChatTypingIndicator,
  ChatWelcomeMessage,
  ChatError,
  ChatRateLimit,
  ChatUnavailable,
  ChatReconnecting
} from "@/components/chat"
import { useChatWebSocket } from "@/hooks/use-chat-websocket"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { useTypingIndicator } from "@/hooks/use-typing-indicator"
import { useMessageHistory } from "@/hooks/use-message-history"
import { useRateLimit } from "@/hooks/use-rate-limit"
import { useErrorHandling } from "@/hooks/use-error-handling"
import { useReconnection } from "@/hooks/use-reconnection"
import { PageWrapper } from "@/components/page-wrapper"
import { MessageSquare, Bot, User, Send } from "lucide-react"

interface Message {
  content: string
  role: "user" | "assistant"
  timestamp: string
}

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
    onMessage: (message: Message) => {
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
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">Chat with Sgt. Ken</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get answers to your questions about the recruitment process, department policies, and career opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="bg-[#0A3C1F] text-white">
                  <CardTitle className="flex items-center">
                    <Bot className="h-5 w-5 mr-2" />
                    Sgt. Ken
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-6 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-[#0A3C1F] flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-lg p-4">
                        <p className="text-sm">
                          Hello! I'm Sgt. Ken, your AI assistant. How can I help you today?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="bg-[#0A3C1F] text-white">
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li>
                      <a href="/requirements" className="text-[#0A3C1F] hover:underline">
                        Application Requirements
                      </a>
                    </li>
                    <li>
                      <a href="/application-process" className="text-[#0A3C1F] hover:underline">
                        Application Process
                      </a>
                    </li>
                    <li>
                      <a href="/training" className="text-[#0A3C1F] hover:underline">
                        Training Information
                      </a>
                    </li>
                    <li>
                      <a href="/benefits" className="text-[#0A3C1F] hover:underline">
                        Benefits & Compensation
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-[#0A3C1F] text-white">
                  <CardTitle>Earn Points</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Earn points for meaningful interactions with Sgt. Ken:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-[#0A3C1F] mr-2" />
                      <span>5 points per meaningful interaction</span>
                    </li>
                    <li className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-[#0A3C1F] mr-2" />
                      <span>10 points for completing a conversation</span>
                    </li>
                    <li className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-[#0A3C1F] mr-2" />
                      <span>15 points for asking about specific topics</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
