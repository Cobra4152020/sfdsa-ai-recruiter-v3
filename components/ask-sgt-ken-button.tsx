"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Gamepad2, Coffee } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import { generateResponse } from "@/lib/sgt-ken-knowledge-base";

interface AskSgtKenButtonProps {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  fullWidth?: boolean;
  position?: "fixed" | "static";
}

type MessageType = {
  role: "assistant" | "user";
  content: string;
  quickReplies?: string[];
  id?: string;
  timestamp: Date;
  feedbackGiven?: "positive" | "negative";
  showDonation?: boolean;
  isTyping?: boolean;
  displayedContent?: string;
};

// interface Faq { // Commented out unused interface
//   question: string;
//   answer: string;
//   keywords?: string[];
// }

// const faqs: Faq[] = [
//   {
//     question: "What are the basic requirements to become a deputy sheriff?",
//     answer:
//       "Basic requirements include being a US citizen, at least 20.5 years old at application (21 at appointment), a high school diploma or GED, and a valid driver\'s license. You\'ll also need to pass a background check, physical ability test, and psychological evaluation.",
//   },
//   {
//     question: "How long is the academy training?",
//     answer:
//       "The academy training is approximately 6 months long and is quite rigorous, covering academics, physical fitness, and practical skills.",
//   },
//   {
//     question: "What kind of benefits do deputy sheriffs receive?",
//     answer:
//       "We offer a comprehensive benefits package including competitive salary, health, dental, and vision insurance, retirement plans, paid leave, and opportunities for specialized training and career advancement.",
//   },
//   {
//     question: "Can I apply if I have a criminal record?",
//     answer:
//       "It depends on the nature and severity of the offense. Felony convictions are generally disqualifying. Minor offenses will be reviewed on a case-by-case basis during the background check.",
//   },
// ];

export function AskSgtKenButton({
  variant = "default",
  size = "default",
  className = "",
  fullWidth = false,
  position = "static",
}: AskSgtKenButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant",
      content:
        "Hey there! I'm Sergeant Ken. How can I help you with your journey to becoming a San Francisco Deputy Sheriff?",
      quickReplies: [
        "Tell me about requirements",
        "What's the application process?",
        "How's the salary?",
      ],
      id: "welcome-message",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(uuidv4());
  const [offlineMode, setOfflineMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser, incrementParticipation } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (isDialogOpen && currentUser) {
      incrementParticipation();
    }
  }, [isDialogOpen, currentUser, incrementParticipation]);

  // Add custom animation for the blinking effect
  useEffect(() => {
    // Add the animation to the stylesheet
    const style = document.createElement("style");
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
    @keyframes bounceSlight {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .animate-bounce-subtle {
      animation: bounceSlight 2s ease-in-out infinite;
    }
    
    /* Enhanced hover effects */
    .floating-btn {
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .floating-btn:hover {
      transform: scale(1.1) translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(10, 60, 31, 0.3), 0 8px 10px -6px rgba(10, 60, 31, 0.2);
    }
    .floating-btn:active {
      transform: scale(0.95);
      box-shadow: 0 5px 15px -3px rgba(10, 60, 31, 0.3), 0 4px 6px -4px rgba(10, 60, 31, 0.2);
    }
    
    .floating-btn .hover-ring {
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      border-radius: 50%;
      border: 2px solid #FFD700;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.3s ease;
    }
    .floating-btn:hover .hover-ring {
      opacity: 0.5;
      transform: scale(1);
    }
    
    .floating-btn .hover-text {
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      background-color: #0A3C1F;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 14px;
      opacity: 0;
      transition: all 0.3s ease;
      white-space: nowrap;
      pointer-events: none;
    }
    .floating-btn:hover .hover-text {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .floating-btn .hover-text:after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #0A3C1F transparent transparent transparent;
    }
    
    @keyframes pulse-ring {
      0% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      70% {
        transform: scale(1.2);
        opacity: 0;
      }
      100% {
        transform: scale(1.2);
        opacity: 0;
      }
    }
    .pulse-ring {
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      border-radius: 50%;
      border: 2px solid #FFD700;
      animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
    }
    
    /* Icon hover effect */
    .icon-container {
      transition: transform 0.3s ease;
    }
    .floating-btn:hover .icon-container {
      transform: rotate(15deg);
    }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing effect function
  const startTypingEffect = (messageId: string, content: string, delay: number = 30) => {
    setTypingMessageId(messageId);
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= content.length) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, displayedContent: content.substring(0, currentIndex) }
              : msg
          )
        );
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTypingMessageId(null);
        // Mark typing as complete
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, isTyping: false, displayedContent: content }
              : msg
          )
        );
      }
    }, delay);
  };

  // Function to generate quick replies based on the message content
  const getContextualQuickReplies = (message: string): string[] => {
    const lowerMessage = message.toLowerCase();

    // Always include daily briefing as an option
    const briefingOption = "Attend Sgt. Ken's Daily Briefing";

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
        briefingOption,
      ];
    }

    // Application-related quick replies
    if (
      lowerMessage.includes("apply") ||
      lowerMessage.includes("application") ||
      lowerMessage.includes("process")
    ) {
      return [
        "How long is the process?",
        "What tests are involved?",
        "Tell me about the academy",
        briefingOption,
      ];
    }

    // Salary-related quick replies
    if (
      lowerMessage.includes("salary") ||
      lowerMessage.includes("pay") ||
      lowerMessage.includes("money")
    ) {
      return [
        "What about overtime?",
        "Are there pay increases?",
        "What benefits come with the job?",
        briefingOption,
      ];
    }

    // Training-related quick replies
    if (
      lowerMessage.includes("training") ||
      lowerMessage.includes("academy") ||
      lowerMessage.includes("learn")
    ) {
      return [
        "How long is the academy?",
        "What will I learn?",
        "Is it physically demanding?",
        briefingOption,
      ];
    }

    // Career-related quick replies
    if (
      lowerMessage.includes("career") ||
      lowerMessage.includes("advancement") ||
      lowerMessage.includes("promotion")
    ) {
      return [
        "How fast can I get promoted?",
        "What specialized units exist?",
        "What's the retirement plan?",
        briefingOption,
      ];
    }

    // Default quick replies for general questions
    return [
      "What are the requirements?",
      "Tell me about the salary",
      "How's the work schedule?",
      briefingOption,
    ];
  };

  // Determine if we should show a donation prompt
  const shouldShowDonationPrompt = () => {
    // Show donation prompt after every 4-6 messages
    return (
      messageCount > 0 &&
      messageCount % (Math.floor(Math.random() * 3) + 4) === 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setInput("");
      setIsLoading(true);

      // Increment message count
      setMessageCount((prev) => prev + 1);

      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: userMessage,
          id: `user-${Date.now()}`,
          timestamp: new Date(),
        },
      ]);

      try {
        // Prepare chat history for the AI service
        const chatHistory = messages.slice(-5).map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Use the enhanced chat API endpoint
        const apiResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            chatHistory: chatHistory,
            userId: currentUser?.id,
            sessionId,
          }),
        });

        if (!apiResponse.ok) {
          throw new Error(`API error: ${apiResponse.status}`);
        }

        const result = await apiResponse.json();
        
        if (!result.success) {
          throw new Error(result.error || "API request failed");
        }

        let response = result.message;

        // Update salary information to latest figures
        response = response.replace(
          /\$\d{2,3}(,\d{3})?(\s*-\s*|\s*to\s*)\$\d{2,3}(,\d{3})?/g,
          "$116,428 to $184,362",
        );
        response = response.replace(
          /salary (of|around|about|approximately) \$\d{2,3}(,\d{3})?/g,
          "salary of $116,428 to $184,362",
        );
        response = response.replace(
          /salary (ranges?|starting) (from )?\$\d{2,3}(,\d{3})?/g,
          "salary ranges from $116,428 to $184,362",
        );

        // Generate contextual quick replies based on the conversation
        const quickReplies = getContextualQuickReplies(userMessage + " " + response);

        // Check if we should show a donation prompt
        const showDonation = shouldShowDonationPrompt();

        // Add assistant response with enhanced metadata
        const assistantMessageId = `assistant-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response,
            quickReplies: quickReplies,
            id: assistantMessageId,
            timestamp: new Date(),
            showDonation,
            isTyping: true,
            displayedContent: "",
          },
        ]);

        // Start typing effect for the response
        setTimeout(() => {
          startTypingEffect(assistantMessageId, response);
        }, 500); // Small delay before starting to type

        // Show success indicator if web search was used
        if (result.searchUsed) {
          toast({
            title: "Current Information Retrieved",
            description: "Sgt. Ken found the latest information for you!",
            duration: 3000,
          });
        }

        // Note: Database logging is now handled by the API endpoint

      } catch (error) {
        console.error("Error in enhanced chat flow:", error);

        // Fallback to local knowledge base
        const fallbackResponse = generateResponse(userMessage);
        
        // Update salary information
        const updatedResponse = fallbackResponse
          .replace(/\$\d{2,3}(,\d{3})?(\s*-\s*|\s*to\s*)\$\d{2,3}(,\d{3})?/g, "$116,428 to $184,362")
          .replace(/salary (of|around|about|approximately) \$\d{2,3}(,\d{3})?/g, "salary of $116,428 to $184,362")
          .replace(/salary (ranges?|starting) (from )?\$\d{2,3}(,\d{3})?/g, "salary ranges from $116,428 to $184,362");

        // Add fallback response
        const fallbackMessageId = `fallback-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Hey there! ${updatedResponse}`,
            quickReplies: getContextualQuickReplies(userMessage + " " + updatedResponse),
            id: fallbackMessageId,
            timestamp: new Date(),
            isTyping: true,
            displayedContent: "",
          },
        ]);

        // Start typing effect for fallback response
        setTimeout(() => {
          startTypingEffect(fallbackMessageId, `Hey there! ${updatedResponse}`);
        }, 500);

        // Show user-friendly error message
        toast({
          title: "Using offline responses",
          description: "Sgt. Ken is temporarily using stored knowledge. Responses are still accurate!",
          variant: "default",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickReply = (reply: string) => {
    if (!isLoading) {
      // Special handling for daily briefing link
      if (
        reply.toLowerCase().includes("briefing") ||
        reply.toLowerCase().includes("attend briefing")
      ) {
        window.location.href = "/daily-briefing";
        return;
      }

      setInput(reply);
      handleSubmit(new Event("submit") as unknown as React.FormEvent);
    }
  };

  // Determine button styling based on variant
  const getButtonStyle = () => {
    let buttonStyle = className + " ";

    if (variant === "default") {
      buttonStyle += "bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white ";
    } else if (variant === "outline") {
      buttonStyle += "border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/10 ";
    } else if (variant === "secondary") {
      buttonStyle +=
        "bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-medium ";
    } else if (variant === "ghost") {
      // Don't add additional styles for ghost variant as it's handled by className
    }

    if (fullWidth) {
      buttonStyle += "w-full ";
    }

    if (position === "fixed") {
      buttonStyle += "fixed bottom-6 right-6 z-40 shadow-lg floating-btn ";
    }

    return buttonStyle;
  };

  // For ghost variant in the header, we want to render just text with an icon
  if (variant === "ghost" && (className?.includes("bg-[#0A3C1F]") || className?.includes("text-white"))) {
    return (
      <button
        onClick={() => setIsDialogOpen(true)}
        className={`${className} sgt-ken-button-hover subtle-glow relative`}
        aria-label="Chat with Sergeant Ken"
        type="button"
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
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${getButtonStyle()} subtle-glow relative`}
        onClick={() => setIsDialogOpen(true)}
        aria-label="Chat with Sergeant Ken"
      >
        {position === "fixed" && (
          <>
            <div className="pulse-ring"></div>
            <div className="hover-ring"></div>
            <div className="hover-text">Chat with Sgt. Ken</div>
          </>
        )}
        <span
          className={`${position === "fixed" ? "icon-container" : "wiggle-icon"}`}
        >
          <MessageSquare className="mr-2 h-5 w-5" />
        </span>
        Ask Sgt. Ken
        <span className="absolute -right-2 -top-1 h-2 w-2 rounded-full bg-[#FFD700] animate-pulse-yellow"></span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[85vh] sm:max-h-[80vh] w-full mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-[#0A3C1F] flex-wrap gap-2">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-[#0A3C1F]" />
                <span className="text-base sm:text-lg">Chat with Sgt. Ken</span>
                {offlineMode && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300 text-xs"
                  >
                    Offline Mode
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/donate"
                  className="flex items-center text-xs sm:text-sm text-[#0A3C1F] hover:underline"
                >
                  <Coffee className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Donate
                </Link>
                <Link
                  href="/daily-briefing"
                  className="flex items-center text-xs sm:text-sm bg-[#FFD700] text-[#0A3C1F] px-2 py-1 sm:px-3 sm:py-1 rounded-full hover:bg-[#FFD700]/80 transition-colors"
                >
                  <Gamepad2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Attend Briefing</span>
                  <span className="sm:hidden">Briefing</span>
                </Link>
              </div>
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Chat with Sgt. Ken, your AI assistant for San Francisco Deputy Sheriff recruitment questions.
            </DialogDescription>
          </DialogHeader>

          <div className="h-[60vh] sm:h-[400px] flex flex-col border rounded-md overflow-hidden">
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message, _index) => (
                  <div key={message.id || _index}>
                    <div
                      className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                          message.role === "assistant"
                            ? "bg-[#F0F0F0] dark:bg-[#2A2A2A] text-black dark:text-white"
                            : "bg-[#0A3C1F] text-white"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm sm:text-base">
                          {message.displayedContent || message.content}
                          {message.isTyping && typingMessageId === message.id && (
                            <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse">|</span>
                          )}
                        </div>

                        {message.quickReplies &&
                          message.quickReplies.length > 0 && 
                          !message.isTyping && (
                            <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                              {message.quickReplies.map((reply, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleQuickReply(reply)}
                                  disabled={isLoading || typingMessageId !== null}
                                  className="text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-[#FFD700] text-[#0A3C1F] font-medium hover:bg-[#FFD700]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <div className="mt-2 sm:mt-3">
                        <div className="max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 bg-[#F0F0F0] dark:bg-[#2A2A2A] text-black dark:text-white">
                          <p className="text-sm sm:text-base">
                            If you appreciate this site and my assistance,
                            consider buying me a coffee!
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                            <Link href="/donate?amount=10">
                              <Button
                                size="sm"
                                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                              >
                                <Coffee className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                $10
                              </Button>
                            </Link>
                            <Link href="/donate?amount=25">
                              <Button
                                size="sm"
                                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                              >
                                <Coffee className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                $25
                              </Button>
                            </Link>
                            <Link href="/donate">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#FFD700] text-[#0A3C1F] text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                              >
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
                    <div className="max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 bg-[#F0F0F0] dark:bg-[#2A2A2A] text-black dark:text-white">
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

            <div className="border-t dark:border-gray-700 p-2 sm:p-3">
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-2 py-2 sm:px-3 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3C1F] dark:bg-[#2A2A2A] dark:text-white dark:border-gray-600 text-sm sm:text-base"
                  disabled={isLoading || typingMessageId !== null}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim() || typingMessageId !== null}
                  className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white p-2 rounded-lg flex-shrink-0 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
