"use client";

import { useState, useRef, useEffect } from "react";
import { useMessageHistory } from "@/hooks/use-message-history";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import { 
  MessageSquare, 
  Bot, 
  Send, 
  Gamepad2, 
  Trophy, 
  Award, 
  Users, 
  Clock,
  Star,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { useUser } from "@/context/user-context";
import { useAuthModal } from "@/context/auth-modal-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { PageWrapper } from "@/components/page-wrapper";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  pointsAwarded?: number;
  searchUsed?: boolean;
  id?: string;
  isTyping?: boolean;
  displayedContent?: string;
}

export default function ChatWithSgtKenPage() {
  const { currentUser } = useUser();
  const { openModal } = useAuthModal();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { addMessage } = useMessageHistory();
  useScrollToBottom(scrollAreaRef, messages);

  // Typing effect function - slowed down for better readability
  const startTypingEffect = (messageId: string, content: string, delay: number = 90) => {
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

  // Suggested questions for quick start
  const suggestedQuestions = [
    "What are the requirements to become a deputy sheriff?",
    "What is the salary and benefits package?",
    "Tell me about the training academy",
    "What does a typical day look like?",
    "How do I apply for the position?",
    "What career advancement opportunities exist?"
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!currentUser) {
      openModal("signup", "recruit");
      return;
    }

    const messageText = input.trim();

    const userMessage: Message = {
      content: messageText,
      role: "user",
      timestamp: new Date().toISOString(),
      id: `user-${Date.now()}`,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Prepare chat history for context
      const chatHistory = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call the enhanced chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          userId: currentUser?.id,
          chatHistory,
          sessionId: "chat-page-session",
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Unknown error");
      }

      const assistantMessageId = `assistant-${Date.now()}`;
      const botMessage: Message = {
        content: data.message,
        role: "assistant",
        timestamp: new Date().toISOString(),
        pointsAwarded: data.pointsAwarded,
        searchUsed: data.searchUsed,
        id: assistantMessageId,
        isTyping: true,
        displayedContent: "",
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Start typing effect for the response with a small delay
      setTimeout(() => {
        startTypingEffect(assistantMessageId, data.message);
      }, 300);
      setMessageCount(prev => prev + 1);

      // Update points earned
      if (data.pointsAwarded) {
        setTotalPointsEarned(prev => prev + data.pointsAwarded);
        
        // Show points notification
        toast({
          title: "Points Earned! 🎉",
          description: `+${data.pointsAwarded} points for chatting with Sgt. Ken${data.searchUsed ? ' (bonus for current info!)' : ''}`,
          duration: 3000,
        });
      }

      // Show indicator if web search was used
      if (data.searchUsed) {
        console.log("✅ Sgt. Ken used current information for this response");
      }

    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      
      // Add fallback message
      const fallbackMessage: Message = {
        content: "Hey there! I'm having a bit of trouble connecting right now, but I'm still here to help with your questions about the San Francisco Sheriff's Office. The department offers competitive salaries, excellent benefits, and rewarding career opportunities. What would you like to know?",
        role: "assistant",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prevMessages) => [...prevMessages, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <PageWrapper>
      <AuthRequiredWrapper
        requiredFeature="sgt_ken_chat"
        title="Chat with Sgt. Ken"
        description="Get instant answers about recruitment and earn points for every interaction"
      >
        <div className="container mx-auto px-4 py-6 sm:py-8 flex flex-col h-full">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              <span className="bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">💬 Chat with Sgt. Ken</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
              Get instant answers to your questions about the recruitment process, department policies, 
              and career opportunities. Earn points for every interaction!
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 min-h-0 h-full">
            {/* Main Chat Panel */}
            <div className="lg:col-span-3 flex flex-col">
              <Card className="flex-1 flex flex-col shadow-lg overflow-hidden bg-card">
                <CardHeader className="bg-card-foreground/5 dark:bg-card flex-shrink-0 border-b border-border">
                  <CardTitle className="flex items-center justify-between text-lg sm:text-xl text-foreground">
                    <div className="flex items-center">
                      <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mr-3">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      Sgt. Ken - AI Assistant
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI-Powered
                      </Badge>
                      {currentUser && (
                        <Badge variant="secondary" className="bg-green-500/80 text-white border-green-300">
                          <Star className="h-3 w-3 mr-1" />
                          {totalPointsEarned} pts
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4 sm:p-6 min-h-0">
                  <div
                    ref={scrollAreaRef}
                    className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 mb-4 pr-2 -mr-4"
                  >
                    {/* Welcome message */}
                    {messages.length === 0 && !isLoading && !error && (
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Bot className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 bg-muted/50 dark:bg-muted/40 rounded-lg p-4 shadow-sm">
                            <p className="text-sm sm:text-base font-medium text-foreground mb-2">
                              👋 Hello! I'm Sgt. Ken, your AI recruitment assistant.
                            </p>
                            <p className="text-sm sm:text-base text-muted-foreground mb-3">
                              I'm here to help you learn about becoming a San Francisco Deputy Sheriff. 
                              {currentUser ? " You'll earn 5-7 points for each question you ask!" : " Sign in to earn points for every interaction!"}
                            </p>
                            <div className="text-xs text-muted-foreground/80">
                              💡 Try asking about requirements, salary, training, or career opportunities
                            </div>
                          </div>
                        </div>

                        {/* Suggested questions */}
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                          <h3 className="text-sm font-semibold text-primary mb-3 flex items-center">
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Quick Start Questions
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {suggestedQuestions.map((question, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestedQuestion(question)}
                                className="text-left text-xs sm:text-sm text-primary/80 dark:text-primary/90 hover:text-primary dark:hover:text-primary hover:bg-primary/10 p-2 rounded transition-colors"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 sm:space-x-4 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                        )}
                        <div
                          className={`rounded-lg p-3 sm:p-4 shadow-sm break-words ${
                            msg.role === "user" 
                              ? "bg-primary text-primary-foreground text-right max-w-[85%] sm:max-w-[75%]" 
                              : "bg-muted/60 dark:bg-muted/80 text-foreground max-w-[90%] sm:max-w-[80%]"
                          }`}
                        >
                          <p className="text-sm sm:text-base leading-relaxed m-0 whitespace-pre-wrap">
                              {msg.displayedContent || msg.content}
                              {msg.isTyping && typingMessageId === msg.id && (
                                <span className="inline-block w-0.5 h-5 bg-current ml-1 animate-pulse">|</span>
                              )}
                          </p>
                          <div className="flex items-center justify-between mt-2 w-full">
                            <p className="text-xs text-muted-foreground/70 flex-shrink-0">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                            {msg.pointsAwarded && (
                              <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200 flex-shrink-0">
                                +{msg.pointsAwarded} pts {msg.searchUsed && "🔍"}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0 text-sm sm:text-base font-semibold shadow-md">
                            {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center justify-center py-4">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <span className="text-sm sm:text-base ml-2">Sgt. Ken is thinking...</span>
                        </div>
                      </div>
                    )}
                    {error && (
                      <div className="text-center text-red-500 text-sm sm:text-base bg-red-50 border border-red-200 rounded-lg p-3">
                        Error: {error}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 pt-4 border-t border-border flex-shrink-0">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && !isLoading && handleSendMessage()
                      }
                      placeholder="Ask Sgt. Ken anything about becoming a deputy sheriff..."
                      className="flex-1 text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 px-4 sm:px-6 shadow-md hover:shadow-lg transition-all"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Quick Stats Card */}
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-foreground flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-primary" />
                      Your Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Messages</span>
                      <Badge variant="outline" className="text-muted-foreground">
                        {messageCount}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Points Earned</span>
                      <Badge variant="secondary" className="bg-green-500/80 text-white">
                        {totalPointsEarned}
                      </Badge>
                    </div>
                    {!currentUser && (
                      <div className="text-center pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => openModal("signup", "recruit")}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Sign Up to Earn Points
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Tips Card */}
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-foreground flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                      Ask About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-primary/70" />
                        Application requirements
                      </li>
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-primary/70" />
                        Salary and benefits
                      </li>
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-primary/70" />
                        Training academy
                      </li>
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-primary/70" />
                        Career opportunities
                      </li>
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-primary/70" />
                        Daily responsibilities
                      </li>
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-primary/70" />
                        Department culture
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Games Promotion Card */}
                <Card className="bg-gradient-to-br from-yellow-300/20 via-card to-card border-yellow-400/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-foreground flex items-center">
                      <Gamepad2 className="h-5 w-5 mr-2 text-yellow-400" />
                      Earn More Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Want to earn even more points? Try our interactive games!
                    </p>
                    <div className="space-y-2">
                      <Link href="/trivia">
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          SF Trivia (60-120 pts)
                        </Button>
                      </Link>
                      <Link href="/sgt-ken-says">
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Daily Puzzle (100-220 pts)
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AuthRequiredWrapper>
    </PageWrapper>
  );
}
