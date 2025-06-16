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
import { Send, MessageSquare, Gamepad2, Coffee, UserPlus, Zap, Shield } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import { useAuthModal } from "@/context/auth-modal-context";
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
  const [hasAskedFirstQuestion, setHasAskedFirstQuestion] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(uuidv4());
  const [offlineMode, setOfflineMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser, incrementParticipation, isLoggedIn } = useUser();
  const { openModal } = useAuthModal();
  const { toast } = useToast();

  // Initialize chat with first mandatory question when dialog opens
  useEffect(() => {
    if (isDialogOpen && messages.length === 0) {
      const welcomeMessage: MessageType = {
        role: "assistant",
        content: "👋 Hey there! I'm Sergeant Ken, your guide to becoming a San Francisco Deputy Sheriff.\n\nBefore we dive in, let me help you understand how this platform works and what you can access.",
        quickReplies: ["How does this page work?"],
        id: "welcome-message",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isDialogOpen, messages.length]);

  useEffect(() => {
    if (isDialogOpen && currentUser) {
      incrementParticipation();
    }
  }, [isDialogOpen, currentUser, incrementParticipation]);

  // Enhanced animations and styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes pulseGlow {
      0%, 100% { 
        box-shadow: 0 0 5px rgba(255, 215, 0, 0.4), 0 0 10px rgba(10, 60, 31, 0.2); 
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.7), 0 0 20px rgba(10, 60, 31, 0.4);
        transform: scale(1.02);
      }
    }
    .enhanced-glow {
      animation: pulseGlow 2.5s ease-in-out infinite;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .slide-in {
      animation: slideIn 0.3s ease-out;
    }
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .fade-in-scale {
      animation: fadeInScale 0.4s ease-out;
    }
    .gradient-bg {
      background: linear-gradient(135deg, #0A3C1F 0%, #1a5a30 100%);
    }
    .gradient-text {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .message-bubble {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    .message-bubble:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }
    .quick-reply-btn {
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
    }
    .quick-reply-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(255, 215, 0, 0.4);
    }
    .registration-prompt {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      border: 2px solid #0A3C1F;
      animation: fadeInScale 0.5s ease-out;
    }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startTypingEffect = (messageId: string, content: string, delay: number = 50) => {
    setTypingMessageId(messageId);
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < content.length) {
        setMessages(prev => prev.map(msg => 
            msg.id === messageId
            ? { ...msg, displayedContent: content.substring(0, currentIndex + 1) }
              : msg
        ));
        currentIndex++;
        setTimeout(typeNextChar, delay);
      } else {
        setMessages(prev => prev.map(msg => 
            msg.id === messageId
              ? { ...msg, isTyping: false, displayedContent: content }
              : msg
        ));
        setTypingMessageId(null);
      }
    };
    
    setTimeout(typeNextChar, 300);
  };

  const handleFirstQuestion = () => {
    if (hasAskedFirstQuestion) return;

    const userMessage: MessageType = {
      role: "user",
      content: "How does this page work?",
      id: `user-${Date.now()}`,
      timestamp: new Date(),
    };

    const responseContent = `Great question! Let me explain how this platform works:

🎯 **FREE ACCESS:**
• Browse all pages and information
• Read about requirements, salary, and benefits
• Download basic resources
• Take practice quizzes
• View the application process overview

🔐 **REGISTRATION REQUIRED:**
• Personalized guidance and coaching
• Advanced practice tests with detailed feedback
• Badge earning system and progress tracking
• Leaderboard participation and points
• Background preparation assistance
• One-on-one chat sessions with me
• Exclusive recruitment tips and strategies

Registration is FREE and gives you access to tools that have helped hundreds of recruits successfully get hired as San Francisco Deputy Sheriffs!

Ready to unlock your full potential? Register now to access everything this platform offers.`;

    const assistantMessage: MessageType = {
      role: "assistant",
      content: responseContent,
      quickReplies: isLoggedIn ? [
        "Tell me about requirements",
        "What's the application process?", 
        "How's the salary?"
      ] : [
        "🚀 Register Now - It's Free!",
        "Tell me more about benefits",
        "What else can I ask?"
      ],
      id: `assistant-${Date.now()}`,
      timestamp: new Date(),
      isTyping: true,
      displayedContent: "",
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setHasAskedFirstQuestion(true);
    
    setTimeout(() => {
      startTypingEffect(assistantMessage.id!, responseContent);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || typingMessageId !== null) return;

    // Check if this is not the first question and user is not logged in
    if (hasAskedFirstQuestion && !isLoggedIn) {
      toast({
        title: "Registration Required",
        description: "Please register to continue chatting with Sgt. Ken and access advanced features!",
        variant: "destructive",
        duration: 5000,
      });
      openModal("signup", "recruit", "");
      return;
    }

    // If first question hasn't been asked, force it
    if (!hasAskedFirstQuestion) {
      handleFirstQuestion();
      setInput("");
      return;
    }

    setIsLoading(true);
    const userMessage: MessageType = {
      role: "user",
      content: input,
      id: `user-${Date.now()}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setMessageCount(prev => prev + 1);

    try {
      const response = generateResponse(input);
      const assistantMessage: MessageType = {
            role: "assistant",
            content: response,
        quickReplies: getContextualQuickReplies(response),
        id: `assistant-${Date.now()}`,
            timestamp: new Date(),
            isTyping: true,
            displayedContent: "",
        showDonation: shouldShowDonationPrompt(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
        setTimeout(() => {
        startTypingEffect(assistantMessage.id!, response);
      }, 500);

      } catch (error) {
      console.error("Error generating response:", error);
      
      const fallbackResponse = "I'm having a bit of trouble right now, but I'm still here to help! You can ask me about the application process, requirements, benefits, or what it's like to work as a Deputy Sheriff in San Francisco.";
      
      const fallbackMessage: MessageType = {
            role: "assistant",
        content: fallbackResponse,
        quickReplies: ["Tell me about requirements", "Application process", "Benefits"],
        id: `fallback-${Date.now()}`,
            timestamp: new Date(),
            isTyping: true,
            displayedContent: "",
      };

      setMessages(prev => [...prev, fallbackMessage]);
      
        setTimeout(() => {
        startTypingEffect(fallbackMessage.id!, fallbackResponse);
        }, 500);

        toast({
        title: "Connection Issue",
        description: "Using backup knowledge - I'm still here to help!",
          variant: "default",
        duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
  };

  const getContextualQuickReplies = (message: string): string[] => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("salary") || lowerMessage.includes("pay")) {
      return ["What about benefits?", "Career advancement?", "Work schedule?"];
    }
    if (lowerMessage.includes("requirement")) {
      return ["Application process?", "Physical test?", "Background check?"];
    }
    if (lowerMessage.includes("academy") || lowerMessage.includes("training")) {
      return ["What's the schedule?", "Benefits package?", "Career growth?"];
    }
    if (lowerMessage.includes("san francisco") || lowerMessage.includes("city")) {
      return ["Cost of living?", "Neighborhoods?", "Transportation?"];
    }
    
    return ["Tell me more", "Application process?", "Benefits?"];
  };

  const shouldShowDonationPrompt = (): boolean => {
    return messageCount > 0 && messageCount % 4 === 0;
  };

  const handleQuickReply = (reply: string) => {
    if (isLoading || typingMessageId !== null) return;

    // Handle registration button
    if (reply.includes("Register Now")) {
      openModal("signup", "recruit", "");
      return;
    }

    // Handle first question
    if (reply === "How does this page work?") {
      handleFirstQuestion();
      return;
    }

    // Handle daily briefing link
    if (reply.toLowerCase().includes("briefing") || reply.toLowerCase().includes("attend briefing")) {
        window.location.href = "/daily-briefing";
        return;
      }

    // Check registration requirement for subsequent questions
    if (hasAskedFirstQuestion && !isLoggedIn) {
      toast({
        title: "Registration Required",
        description: "Please register to continue chatting and access all features!",
        variant: "destructive",
        duration: 5000,
      });
      openModal("signup", "recruit", "");
      return;
    }

      setInput(reply);
    setTimeout(() => {
      handleSubmit(new Event("submit") as unknown as React.FormEvent);
    }, 100);
  };

  const getButtonStyle = () => {
    let buttonStyle = className + " ";

    if (variant === "default") {
      buttonStyle += "bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white ";
    } else if (variant === "outline") {
      buttonStyle += "border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/10 ";
    } else if (variant === "secondary") {
      buttonStyle += "bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-medium ";
    }

    if (fullWidth) {
      buttonStyle += "w-full ";
    }

    if (position === "fixed") {
      buttonStyle += "fixed bottom-6 right-6 z-40 shadow-lg enhanced-glow ";
    }

    return buttonStyle;
  };

  // Enhanced ghost variant for header
  if (variant === "ghost" && (className?.includes("bg-[#0A3C1F]") || className?.includes("text-white"))) {
    return (
      <>
        <button
          onClick={() => setIsDialogOpen(true)}
          className={`${className} enhanced-glow relative group transition-all duration-300`}
          aria-label="Chat with Sergeant Ken"
          type="button"
        >
          <span className="flex items-center relative">
            <MessageSquare className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="gradient-text font-semibold">Ask Sgt. Ken</span>
            <Zap className="ml-1 h-3 w-3 text-[#FFD700] animate-pulse" />
          </span>
        </button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] w-full mx-auto fade-in-scale border-2 border-[#FFD700]">
            <DialogHeader className="gradient-bg text-white rounded-t-lg -mx-6 -mt-6 px-6 py-4">
              <DialogTitle className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center">
                  <Shield className="mr-2 h-6 w-6 text-[#FFD700]" />
                  <span className="text-lg font-bold gradient-text">Chat with Sgt. Ken</span>
                  {!isLoggedIn && (
                    <Badge className="ml-2 bg-[#FFD700] text-[#0A3C1F] font-semibold">
                      Registration Gets Full Access
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href="/donate"
                    className="flex items-center text-sm text-[#FFD700] hover:text-white transition-colors"
                  >
                    <Coffee className="mr-1 h-4 w-4" />
                    Support Us
                  </Link>
                  <Link
                    href="/daily-briefing"
                    className="flex items-center text-sm bg-[#FFD700] text-[#0A3C1F] px-3 py-1 rounded-full hover:bg-white transition-colors font-semibold"
                  >
                    <Gamepad2 className="mr-1 h-4 w-4" />
                    Daily Briefing
                  </Link>
                </div>
              </DialogTitle>
              <DialogDescription className="text-[#FFD700]/90 font-medium">
                Your AI guide to becoming a San Francisco Deputy Sheriff. Get personalized guidance!
              </DialogDescription>
            </DialogHeader>

            <div className="h-[75vh] sm:h-[550px] w-full flex flex-col border-2 border-[#0A3C1F]/20 rounded-lg overflow-hidden bg-gradient-to-b from-white to-gray-50">
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={message.id || index} className="slide-in">
                      <div className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[85%] rounded-xl p-4 message-bubble ${
                            message.role === "assistant"
                            ? "bg-gradient-to-br from-[#0A3C1F] to-[#1a5a30] text-white"
                            : "bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-[#0A3C1F] font-semibold"
                        }`}>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.role === "assistant" && (
                              <div className="flex items-center mb-2">
                                <Shield className="h-4 w-4 text-[#FFD700] mr-2" />
                                <span className="text-[#FFD700] font-semibold text-xs">SGT. KEN</span>
                              </div>
                            )}
                            {message.displayedContent || message.content}
                            {message.isTyping && typingMessageId === message.id && (
                              <span className="inline-block w-2 h-4 bg-[#FFD700] ml-1 animate-pulse">|</span>
                            )}
                          </div>

                          {message.quickReplies && message.quickReplies.length > 0 && !message.isTyping && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {message.quickReplies.map((reply, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleQuickReply(reply)}
                                    disabled={isLoading || typingMessageId !== null}
                                  className={`text-xs px-3 py-2 rounded-full font-semibold transition-all quick-reply-btn ${
                                    reply.includes("Register Now") 
                                      ? "registration-prompt text-[#0A3C1F] hover:scale-105" 
                                      : "bg-[#FFD700] text-[#0A3C1F] hover:bg-white"
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {reply.includes("Register Now") && <UserPlus className="h-3 w-3 mr-1 inline" />}
                                    {reply}
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Enhanced donation prompt */}
                      {message.role === "assistant" && message.showDonation && (
                        <div className="mt-3 slide-in">
                          <div className="max-w-[85%] rounded-xl p-4 bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 border-2 border-[#FFD700]/30">
                            <div className="flex items-center mb-2">
                              <Coffee className="h-4 w-4 text-[#0A3C1F] mr-2" />
                              <span className="text-[#0A3C1F] font-semibold">Support Our Mission</span>
                            </div>
                            <p className="text-sm text-[#0A3C1F] mb-3">
                              Help keep this platform free and accessible for all future deputies!
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Link href="/donate?amount=10">
                                <Button size="sm" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                                  <Coffee className="mr-1 h-3 w-3" />$10
                                </Button>
                              </Link>
                              <Link href="/donate?amount=25">
                                <Button size="sm" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                                  <Coffee className="mr-1 h-3 w-3" />$25
                                </Button>
                              </Link>
                              <Link href="/donate">
                                <Button size="sm" variant="outline" className="border-[#0A3C1F] text-[#0A3C1F]">
                                  Custom Amount
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start slide-in">
                      <div className="max-w-[85%] rounded-xl p-4 bg-gradient-to-br from-[#0A3C1F] to-[#1a5a30] text-white">
                        <div className="flex items-center mb-2">
                          <Shield className="h-4 w-4 text-[#FFD700] mr-2" />
                          <span className="text-[#FFD700] font-semibold text-xs">SGT. KEN</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registration prompt for non-logged in users after first question */}
                  {hasAskedFirstQuestion && !isLoggedIn && (
                    <div className="registration-prompt rounded-xl p-4 text-center">
                      <UserPlus className="h-8 w-8 text-[#0A3C1F] mx-auto mb-2" />
                      <h3 className="font-bold text-[#0A3C1F] mb-2">Ready to Unlock Everything?</h3>
                      <p className="text-[#0A3C1F] text-sm mb-3">
                        Register for FREE to continue chatting and access advanced features!
                      </p>
                      <Button 
                        onClick={() => openModal("signup", "recruit", "")}
                        className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white font-semibold"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register Now - It's Free!
                      </Button>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t-2 border-[#0A3C1F]/20 p-4 bg-white">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      !hasAskedFirstQuestion 
                        ? "Ask me how this page works first!" 
                        : hasAskedFirstQuestion && !isLoggedIn
                        ? "Register to continue chatting..."
                        : "Type your message..."
                    }
                    className="flex-1 px-4 py-3 border-2 border-[#0A3C1F]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all text-sm font-medium"
                    disabled={isLoading || typingMessageId !== null || (!hasAskedFirstQuestion && input !== "How does this page work?") || (hasAskedFirstQuestion && !isLoggedIn)}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim() || typingMessageId !== null || (hasAskedFirstQuestion && !isLoggedIn)}
                    className="bg-gradient-to-r from-[#0A3C1F] to-[#1a5a30] hover:from-[#0A3C1F]/90 hover:to-[#1a5a30]/90 text-white p-3 rounded-xl flex-shrink-0 disabled:opacity-50 transition-all"
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
    );
  }

  // Regular button for other variants
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${getButtonStyle()} enhanced-glow relative group`}
        onClick={() => setIsDialogOpen(true)}
        aria-label="Chat with Sergeant Ken"
      >
        <MessageSquare className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
        <span className="font-semibold">Ask Sgt. Ken</span>
        <Zap className="ml-1 h-3 w-3 text-[#FFD700] animate-pulse" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] w-full mx-auto fade-in-scale border-2 border-[#FFD700]">
          {/* Same enhanced dialog content as above */}
          <DialogHeader className="gradient-bg text-white rounded-t-lg -mx-6 -mt-6 px-6 py-4">
            <DialogTitle className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center">
                <Shield className="mr-2 h-6 w-6 text-[#FFD700]" />
                <span className="text-lg font-bold gradient-text">Chat with Sgt. Ken</span>
                {!isLoggedIn && (
                  <Badge className="ml-2 bg-[#FFD700] text-[#0A3C1F] font-semibold">
                    Registration Gets Full Access
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/donate"
                  className="flex items-center text-sm text-[#FFD700] hover:text-white transition-colors"
                >
                  <Coffee className="mr-1 h-4 w-4" />
                  Support Us
                </Link>
                <Link
                  href="/daily-briefing"
                  className="flex items-center text-sm bg-[#FFD700] text-[#0A3C1F] px-3 py-1 rounded-full hover:bg-white transition-colors font-semibold"
                >
                  <Gamepad2 className="mr-1 h-4 w-4" />
                  Daily Briefing
                </Link>
              </div>
            </DialogTitle>
            <DialogDescription className="text-[#FFD700]/90 font-medium">
              Your AI guide to becoming a San Francisco Deputy Sheriff. Get personalized guidance!
            </DialogDescription>
          </DialogHeader>

          <div className="h-[75vh] sm:h-[550px] w-full flex flex-col border-2 border-[#0A3C1F]/20 rounded-lg overflow-hidden bg-gradient-to-b from-white to-gray-50">
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={message.id || index} className="slide-in">
                    <div className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-xl p-4 message-bubble ${
                          message.role === "assistant"
                          ? "bg-gradient-to-br from-[#0A3C1F] to-[#1a5a30] text-white"
                          : "bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-[#0A3C1F] font-semibold"
                      }`}>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.role === "assistant" && (
                            <div className="flex items-center mb-2">
                              <Shield className="h-4 w-4 text-[#FFD700] mr-2" />
                              <span className="text-[#FFD700] font-semibold text-xs">SGT. KEN</span>
                            </div>
                          )}
                          {message.displayedContent || message.content}
                          {message.isTyping && typingMessageId === message.id && (
                            <span className="inline-block w-2 h-4 bg-[#FFD700] ml-1 animate-pulse">|</span>
                          )}
                        </div>

                        {message.quickReplies && message.quickReplies.length > 0 && !message.isTyping && (
                          <div className="mt-3 flex flex-wrap gap-2">
                              {message.quickReplies.map((reply, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleQuickReply(reply)}
                                  disabled={isLoading || typingMessageId !== null}
                                className={`text-xs px-3 py-2 rounded-full font-semibold transition-all quick-reply-btn ${
                                  reply.includes("Register Now") 
                                    ? "registration-prompt text-[#0A3C1F] hover:scale-105" 
                                    : "bg-[#FFD700] text-[#0A3C1F] hover:bg-white"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {reply.includes("Register Now") && <UserPlus className="h-3 w-3 mr-1 inline" />}
                                  {reply}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Enhanced donation prompt */}
                    {message.role === "assistant" && message.showDonation && (
                      <div className="mt-3 slide-in">
                        <div className="max-w-[85%] rounded-xl p-4 bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 border-2 border-[#FFD700]/30">
                          <div className="flex items-center mb-2">
                            <Coffee className="h-4 w-4 text-[#0A3C1F] mr-2" />
                            <span className="text-[#0A3C1F] font-semibold">Support Our Mission</span>
                          </div>
                          <p className="text-sm text-[#0A3C1F] mb-3">
                            Help keep this platform free and accessible for all future deputies!
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Link href="/donate?amount=10">
                              <Button size="sm" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                                <Coffee className="mr-1 h-3 w-3" />$10
                              </Button>
                            </Link>
                            <Link href="/donate?amount=25">
                              <Button size="sm" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                                <Coffee className="mr-1 h-3 w-3" />$25
                              </Button>
                            </Link>
                            <Link href="/donate">
                              <Button size="sm" variant="outline" className="border-[#0A3C1F] text-[#0A3C1F]">
                                Custom Amount
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start slide-in">
                    <div className="max-w-[85%] rounded-xl p-4 bg-gradient-to-br from-[#0A3C1F] to-[#1a5a30] text-white">
                      <div className="flex items-center mb-2">
                        <Shield className="h-4 w-4 text-[#FFD700] mr-2" />
                        <span className="text-[#FFD700] font-semibold text-xs">SGT. KEN</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registration prompt for non-logged in users after first question */}
                {hasAskedFirstQuestion && !isLoggedIn && (
                  <div className="registration-prompt rounded-xl p-4 text-center">
                    <UserPlus className="h-8 w-8 text-[#0A3C1F] mx-auto mb-2" />
                    <h3 className="font-bold text-[#0A3C1F] mb-2">Ready to Unlock Everything?</h3>
                    <p className="text-[#0A3C1F] text-sm mb-3">
                      Register for FREE to continue chatting and access advanced features!
                    </p>
                    <Button 
                      onClick={() => openModal("signup", "recruit", "")}
                      className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white font-semibold"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register Now - It's Free!
                    </Button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t-2 border-[#0A3C1F]/20 p-4 bg-white">
              <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    !hasAskedFirstQuestion 
                      ? "Ask me how this page works first!" 
                      : hasAskedFirstQuestion && !isLoggedIn
                      ? "Register to continue chatting..."
                      : "Type your message..."
                  }
                  className="flex-1 px-4 py-3 border-2 border-[#0A3C1F]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all text-sm font-medium"
                  disabled={isLoading || typingMessageId !== null || (!hasAskedFirstQuestion && input !== "How does this page work?") || (hasAskedFirstQuestion && !isLoggedIn)}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim() || typingMessageId !== null || (hasAskedFirstQuestion && !isLoggedIn)}
                  className="bg-gradient-to-r from-[#0A3C1F] to-[#1a5a30] hover:from-[#0A3C1F]/90 hover:to-[#1a5a30]/90 text-white p-3 rounded-xl flex-shrink-0 disabled:opacity-50 transition-all"
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
  );
}
