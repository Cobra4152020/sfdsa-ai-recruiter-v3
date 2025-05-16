"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, User, Bot } from "lucide-react"
import { TypingIndicator } from "@/components/typing-indicator"
import { PageWrapper } from "@/components/page-wrapper"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button"

export default function ChatWithSgtKen() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content:
        "Hi, I'm Sergeant Ken! How can I help you with your questions about becoming a San Francisco Deputy Sheriff?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)

  const showOptInForm = (applying = false) => {
    setIsOptInFormOpen(true)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call your chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ImprovedHeader showOptInForm={showOptInForm} />
      <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-300px)] flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#0A3C1F]">Chat with Sergeant Ken</h1>
          <p className="text-center mb-8 text-gray-600">
            Ask Sergeant Ken any questions about becoming a San Francisco Deputy Sheriff.
          </p>
          <div className="flex justify-center">
            <AskSgtKenButton variant="secondary" size="lg" />
          </div>
        </div>
        <PageWrapper>
          <div className="container max-w-4xl mx-auto py-8 px-4">
            <Card className="w-full">
              <CardHeader className="bg-[#0A3C1F] text-white">
                <CardTitle className="text-xl flex items-center">
                  <Bot className="mr-2 h-6 w-6" />
                  Chat with Sergeant Ken
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-[#0A3C1F] text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        <div className="flex items-start mb-1">
                          {message.role === "user" ? (
                            <User className="h-5 w-5 mr-2 text-white" />
                          ) : (
                            <Bot className="h-5 w-5 mr-2 text-[#FFD700]" />
                          )}
                          <span className="font-semibold">{message.role === "user" ? "You" : "Sgt. Ken"}</span>
                        </div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800">
                        <div className="flex items-start mb-1">
                          <Bot className="h-5 w-5 mr-2 text-[#FFD700]" />
                          <span className="font-semibold">Sgt. Ken</span>
                        </div>
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
        </PageWrapper>
      </main>
      <ImprovedFooter />
    </>
  )
}
