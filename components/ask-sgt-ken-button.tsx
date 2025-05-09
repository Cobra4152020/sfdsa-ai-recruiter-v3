"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Send, MessageSquare, Gamepad2, Coffee } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import { generateResponse } from "@/lib/sgt-ken-knowledge-base"

interface AskSgtKenButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  fullWidth?: boolean
  position?: "fixed" | "static"
}

type MessageType = {
  role: "assistant" | "user"
  content: string
  quickReplies?: string[]
  id?: string
  timestamp: Date
  feedbackGiven?: "positive" | "negative"
  showDonation?: boolean
}

// Fallback responses when API fails
const FALLBACK_RESPONSES = [
  "I'm currently experiencing some technical difficulties, but I'd be happy to help you learn more about becoming a San Francisco Deputy Sheriff. Please try again in a moment, or visit our official website at sfsheriff.com for more information.",
  "Thanks for your interest in the San Francisco Sheriff's Department! I'm having trouble connecting to our knowledge base right now. You can call our recruitment office directly at (415) 554-7225 for immediate assistance.",
  "I apologize for the inconvenience. Our systems are currently undergoing maintenance. The San Francisco Sheriff's Department offers competitive salaries starting around $116,428 to $184,362 with excellent benefits. Please check back soon for more detailed information.",
  "It seems I'm having trouble accessing my full knowledge base at the moment. The basic requirements for becoming a Deputy Sheriff include being at least 21 years old, having a high school diploma or equivalent, and having no felony convictions. Please try again later for more comprehensive information.",
]

export function AskSgtKenButton({
  variant = "default",
  size = "default",
  className = "",
  fullWidth = false,
  position = "static",
}: AskSgtKenButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant",
      content:
        "Hey there! I'm Sergeant Ken. How can I help you with your journey to becoming a San Francisco Deputy Sheriff?",
      quickReplies: ["Tell me about requirements", "What's the application process?", "How's the salary?"],
      id: "welcome-message",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(uuidv4())
  const [offlineMode, setOfflineMode] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [messageCount, setMessageCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { incrementParticipation = () => Promise.resolve(), currentUser } = useUser()
  const { toast } = useToast()

  // Add custom animation for the blinking effect
  useEffect(() => {
    // Add the animation to the stylesheet
    const style = document.createElement("style")
    style.innerHTML = `
    @keyframes pulseYellow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .animate-pulse-yellow {
      animation: pulseYellow 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes subtleGlow {
      0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
      50% { box-shadow: 0 0 12px rgba(255, 215, 0, 0.6); }
    }
    .subtle-glow {
      animation: subtleGlow 2s ease-in-out infinite;
    }
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }
    .wiggle-icon {
      animation: wiggle 3s ease-in-out infinite;
      display: inline-block;
    }
    .sgt-ken-button-hover:hover {
      background-color: rgba(255, 215, 0, 0.2) !important;
      transition: all 0.3s ease;
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Function to generate quick replies based on the message content
  const getContextualQuickReplies = (message: string): string[] => {
    const lowerMessage = message.toLowerCase()

    // Always include trivia game as an option
    const triviaOption = "Play SF Trivia with Sgt. Ken"

    // Requirements-related quick replies
    if (
      lowerMessage.includes("requirements") ||
      lowerMessage.includes("qualify") ||
      lowerMessage.includes("eligible")
    ) {
      return [
        "What education is required?",
        "Are there age requirements?",
        "What about criminal history?",
        triviaOption,
      ]
    }

    // Application-related quick replies
    if (lowerMessage.includes("apply") || lowerMessage.includes("application") || lowerMessage.includes("process")) {
      return ["How long is the process?", "What tests are involved?", "Tell me about the academy", triviaOption]
    }

    // Salary-related quick replies
    if (lowerMessage.includes("salary") || lowerMessage.includes("pay") || lowerMessage.includes("money")) {
      return ["What about overtime?", "Are there pay increases?", "What benefits come with the job?", triviaOption]
    }

    // Training-related quick replies
    if (lowerMessage.includes("training") || lowerMessage.includes("academy") || lowerMessage.includes("learn")) {
      return ["How long is the academy?", "What will I learn?", "Is it physically demanding?", triviaOption]
    }

    // Career-related quick replies
    if (lowerMessage.includes("career") || lowerMessage.includes("advancement") || lowerMessage.includes("promotion")) {
      return [
        "How fast can I get promoted?",
        "What specialized units exist?",
        "What's the retirement plan?",
        triviaOption,
      ]
    }

    // Default quick replies for general questions
    return ["What are the requirements?", "Tell me about the salary", "How's the work schedule?", triviaOption]
  }

  // Determine if we should show a donation prompt
  const shouldShowDonationPrompt = () => {
    // Show donation prompt after every 4-6 messages
    return messageCount > 0 && messageCount % (Math.floor(Math.random() * 3) + 4) === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      const userMessage = input.trim()
      setInput("")
      setIsLoading(true)

      // Increment message count
      setMessageCount((prev) => prev + 1)

      // Add user message
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage, id: `user-${Date.now()}`, timestamp: new Date() },
      ])

      // Track participation if message is sent
      if (typeof incrementParticipation === "function") {
        try {
          await incrementParticipation()
        } catch (err) {
          console.error("Error incrementing participation:", err)
        }
      }

      try {
        let response: string

        // If we're already in offline mode or have retried multiple times, use local response generation
        if (offlineMode || retryCount > 1) {
          // Generate response locally using our knowledge base
          response = generateResponse(userMessage)
        } else {
          // Try the API first
          try {
            // Call the API endpoint with timeout
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

            const apiResponse = await fetch("/api/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: userMessage,
                userId: currentUser?.id,
                sessionId,
              }),
              signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (!apiResponse.ok) {
              // If API fails with 500, increment retry count and throw error
              if (apiResponse.status === 500) {
                setRetryCount((prev) => prev + 1)
                throw new Error(`API responded with status: ${apiResponse.status}`)
              }

              // For other errors, also throw but with specific message
              throw new Error(`API responded with status: ${apiResponse.status}`)
            }

            const data = await apiResponse.json()

            if (!data || !data.message) {
              throw new Error("Invalid response format from API")
            }

            response = data.message

            // Replace salary information with the updated range
            response = response.replace(
              /\$\d{2,3}(,\d{3})?(\s*-\s*|\s*to\s*)\$\d{2,3}(,\d{3})?/g,
              "$116,428 to $184,362",
            )
            response = response.replace(
              /salary (of|around|about|approximately) \$\d{2,3}(,\d{3})?/g,
              "salary of $116,428 to $184,362",
            )
            response = response.replace(
              /salary (ranges?|starting) (from )?\$\d{2,3}(,\d{3})?/g,
              "salary ranges from $116,428 to $184,362",
            )
            response = response.replace(
              /pay (of|around|about|approximately) \$\d{2,3}(,\d{3})?/g,
              "pay of $116,428 to $184,362",
            )

            // Reset retry count on success
            if (retryCount > 0) {
              setRetryCount(0)
            }
          } catch (apiError) {
            console.error("API error, falling back to local response:", apiError)

            // If API call fails, generate response locally
            response = generateResponse(userMessage)

            // Set offline mode if this is a repeated failure
            if (retryCount > 0) {
              setOfflineMode(true)
              toast({
                title: "Switching to offline mode",
                description: "Using local responses due to connection issues.",
                variant: "destructive",
                duration: 5000,
              })
            }
          }
        }

        // Replace any salary mentions with the updated range
        response = response.replace(/\$\d{2,3}(,\d{3})?(\s*-\s*|\s*to\s*)\$\d{2,3}(,\d{3})?/g, "$116,428 to $184,362")
        response = response.replace(
          /salary (of|around|about|approximately) \$\d{2,3}(,\d{3})?/g,
          "salary of $116,428 to $184,362",
        )
        response = response.replace(
          /salary (ranges?|starting) (from )?\$\d{2,3}(,\d{3})?/g,
          "salary ranges from $116,428 to $184,362",
        )
        response = response.replace(
          /pay (of|around|about|approximately) \$\d{2,3}(,\d{3})?/g,
          "pay of $116,428 to $184,362",
        )

        // Generate contextual quick replies based on the user's message and the response
        const quickReplies = getContextualQuickReplies(userMessage + " " + response)

        // Check if we should show a donation prompt
        const showDonation = shouldShowDonationPrompt()

        // Add assistant response
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response,
            quickReplies: quickReplies,
            id: `assistant-${Date.now()}`,
            timestamp: new Date(),
            showDonation,
          },
        ])
      } catch (error) {
        console.error("Error in chat flow:", error)

        // Generate a response using our knowledge base as fallback
        const fallbackResponse = generateResponse(userMessage)

        // Replace any salary mentions with the updated range
        const updatedResponse = fallbackResponse
          .replace(/\$\d{2,3}(,\d{3})?(\s*-\s*|\s*to\s*)\$\d{2,3}(,\d{3})?/g, "$116,428 to $184,362")
          .replace(/salary (of|around|about|approximately) \$\d{2,3}(,\d{3})?/g, "salary of $116,428 to $184,362")
          .replace(/salary (ranges?|starting) (from )?\$\d{2,3}(,\d{3})?/g, "salary ranges from $116,428 to $184,362")
          .replace(/pay (of|around|about|approximately) \$\d{2,3}(,\d{3})?/g, "pay of $116,428 to $184,362")

        // Add fallback response
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: updatedResponse,
            quickReplies: getContextualQuickReplies(userMessage + " " + updatedResponse),
            id: `error-${Date.now()}`,
            timestamp: new Date(),
          },
        ])

        // Show toast notification only if not already in offline mode
        if (!offlineMode) {
          toast({
            title: "Connection issue",
            description: "Using offline response mode. Some features may be limited.",
            variant: "destructive",
            duration: 5000,
          })

          setOfflineMode(true)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleQuickReply = (reply: string) => {
    if (!isLoading) {
      // Special handling for trivia game link
      if (reply.toLowerCase().includes("trivia") || reply.toLowerCase().includes("play sf trivia")) {
        window.location.href = "/trivia"
        return
      }

      setInput(reply)
      handleSubmit(new Event("submit") as unknown as React.FormEvent)
    }
  }

  // Determine button styling based on variant
  const getButtonStyle = () => {
    let buttonStyle = className + " "

    if (variant === "default") {
      buttonStyle += "bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white "
    } else if (variant === "outline") {
      buttonStyle += "border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/10 "
    } else if (variant === "secondary") {
      buttonStyle += "bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-medium "
    } else if (variant === "ghost") {
      // Don't add additional styles for ghost variant as it's handled by className
    }

    if (fullWidth) {
      buttonStyle += "w-full "
    }

    if (position === "fixed") {
      buttonStyle += "fixed bottom-6 right-6 z-40 shadow-lg "
    }

    return buttonStyle
  }

  // For ghost variant in the header, we want to render just text with an icon
  if (variant === "ghost" && className?.includes("text-white")) {
    return (
      <button
        onClick={() => setIsDialogOpen(true)}
        className={`${className} rounded-md px-3 py-1 sgt-ken-button-hover subtle-glow relative`}
        aria-label="Chat with Sergeant Ken"
      >
        <span className="flex items-center relative">
          <span className="wiggle-icon">
            <MessageSquare className="mr-1 h-4 w-4" />
          </span>
          Ask Sgt. Ken
          <span className="absolute -right-4 -top-1 h-2 w-2 rounded-full bg-[#FFD700] animate-pulse-yellow"></span>
          <span className="absolute -right-10 top-0 text-xs bg-[#FFD700] text-[#0A3C1F] px-1.5 py-0.5 rounded-full font-bold animate-pulse-yellow">
            Ask!
          </span>
        </span>
      </button>
    )
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${getButtonStyle()} subtle-glow relative`}
        onClick={() => setIsDialogOpen(true)}
      >
        <span className="wiggle-icon">
          <MessageSquare className="mr-2 h-5 w-5" />
        </span>
        Ask Sgt. Ken
        <span className="absolute -right-2 -top-1 h-2 w-2 rounded-full bg-[#FFD700] animate-pulse-yellow"></span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-[#0A3C1F]">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-[#0A3C1F]" />
                Chat with Sgt. Ken
                {offlineMode && (
                  <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                    Offline Mode
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link href="/donate" className="flex items-center text-sm text-[#0A3C1F] hover:underline">
                  <Coffee className="mr-1 h-4 w-4" />
                  Donate
                </Link>
                <Link
                  href="/trivia"
                  className="flex items-center text-sm bg-[#FFD700] text-[#0A3C1F] px-3 py-1 rounded-full hover:bg-[#FFD700]/80 transition-colors"
                >
                  <Gamepad2 className="mr-1 h-4 w-4" />
                  Play SF Trivia
                </Link>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="h-[400px] flex flex-col border rounded-md overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={message.id || index}>
                    <div className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "assistant"
                            ? "bg-[#F0F0F0] dark:bg-[#2A2A2A] text-black dark:text-white"
                            : "bg-[#0A3C1F] text-white"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>

                        {message.quickReplies && message.quickReplies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.quickReplies.map((reply, i) => (
                              <button
                                key={i}
                                onClick={() => handleQuickReply(reply)}
                                disabled={isLoading}
                                className="text-xs px-3 py-1 rounded-full bg-[#FFD700] text-[#0A3C1F] font-medium hover:bg-[#FFD700]/80 transition-colors"
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Show donation prompt if this message is flagged to show it */}
                    {message.role === "assistant" && message.showDonation && (
                      <div className="mt-3">
                        <div className="max-w-[80%] rounded-lg p-3 bg-[#F0F0F0] dark:bg-[#2A2A2A] text-black dark:text-white">
                          <p>If you appreciate this site and my assistance, consider buying me a coffee!</p>
                          <div className="mt-2 flex space-x-2">
                            <Link href="/donate?amount=10">
                              <Button size="sm" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F]">
                                <Coffee className="mr-1 h-4 w-4" />
                                $10
                              </Button>
                            </Link>
                            <Link href="/donate?amount=25">
                              <Button size="sm" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F]">
                                <Coffee className="mr-1 h-4 w-4" />
                                $25
                              </Button>
                            </Link>
                            <Link href="/donate">
                              <Button size="sm" variant="outline" className="border-[#FFD700] text-[#0A3C1F]">
                                Other Amount
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-[#F0F0F0] dark:bg-[#2A2A2A] text-black dark:text-white">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-[#0A3C1F]/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#0A3C1F]/60 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#0A3C1F]/60 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t dark:border-gray-700 p-3">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C1F] dark:bg-[#2A2A2A] dark:text-white dark:border-gray-600"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white p-2 rounded-lg"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
