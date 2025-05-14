"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Send, PaperclipIcon, SmilePlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  is_user: boolean
  created_at: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  // Fetch user and initial messages
  useEffect(() => {
    async function initialize() {
      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setUserId(session.user.id)

        // Load previous messages
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: true })

        if (!error && data) {
          setMessages(data)
        }

        // If no previous messages, send welcome message
        if (!error && (!data || data.length === 0)) {
          const welcomeMessage = {
            id: "welcome",
            content:
              "Hi there! I'm Sgt. Ken, your AI recruiter assistant. How can I help you with your journey to becoming a Deputy Sheriff?",
            is_user: false,
            created_at: new Date().toISOString(),
          }
          setMessages([welcomeMessage])
        }
      }
    }

    initialize()
  }, [supabase])

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `user_id=eq.${userId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
          if (!(payload.new as Message).is_user) {
            setIsTyping(false)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !userId) return

    const userMessage = {
      content: inputValue,
      is_user: true,
      user_id: userId,
      created_at: new Date().toISOString(),
    }

    // Optimistically add user message to UI
    setMessages((prev) => [...prev, userMessage as Message])
    setInputValue("")
    setIsTyping(true)

    try {
      // Save user message to database
      const { error: insertError } = await supabase.from("chat_messages").insert(userMessage)

      if (insertError) throw insertError

      // Call AI endpoint to get response
      const response = await fetch("/api/chat-with-sgt-ken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          userId,
          messageHistory: messages.slice(-10), // Send last 10 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from Sgt. Ken")
      }

      // Response is handled by the real-time subscription
    } catch (error) {
      console.error("Error in chat:", error)
      setIsTyping(false)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Award points for chat engagement
  const awardChatEngagementPoints = async () => {
    if (!userId) return

    // Only award points after 5 messages from user
    const userMessageCount = messages.filter((m) => m.is_user).length
    if (userMessageCount === 5) {
      try {
        await supabase.from("user_points").insert({
          user_id: userId,
          points: 10,
          reason: "Chat engagement with Sgt. Ken",
          created_at: new Date().toISOString(),
        })

        toast({
          title: "Points Awarded!",
          description: "You earned 10 points for engaging with Sgt. Ken.",
        })
      } catch (error) {
        console.error("Error awarding points:", error)
      }
    }
  }

  useEffect(() => {
    awardChatEngagementPoints()
  }, [messages])

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b">
        <div className="w-10 h-10 mr-3 overflow-hidden rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          SK
        </div>
        <div>
          <h3 className="font-medium">Sgt. Ken</h3>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={msg.id || index} className={`flex ${msg.is_user ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.is_user ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div className={`text-xs mt-1 ${msg.is_user ? "text-blue-100" : "text-gray-500"}`}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex">
              <div className="flex items-center space-x-1 max-w-[80%] rounded-lg p-4 bg-gray-100 text-gray-800 rounded-bl-none">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <PaperclipIcon className="w-5 h-5" />
          </Button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />
          <Button variant="ghost" size="icon" className="text-gray-500">
            <SmilePlus className="w-5 h-5" />
          </Button>
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
