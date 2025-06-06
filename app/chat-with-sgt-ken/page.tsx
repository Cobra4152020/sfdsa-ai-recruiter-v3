"use client";

import { useState, useRef, useEffect } from "react";
import { useMessageHistory } from "@/hooks/use-message-history";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { PageWrapper } from "@/components/page-wrapper";
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

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  pointsAwarded?: number;
  searchUsed?: boolean;
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

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { addMessage } = useMessageHistory();
  useScrollToBottom(scrollAreaRef, messages);

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
      openModal("signin", "recruit");
      return;
    }

    const messageText = input.trim();

    const userMessage: Message = {
      content: messageText,
      role: "user",
      timestamp: new Date().toISOString(),
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

      const botMessage: Message = {
        content: data.message,
        role: "assistant",
        timestamp: new Date().toISOString(),
        pointsAwarded: data.pointsAwarded,
        searchUsed: data.searchUsed,
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
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
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 bg-clip-text text-transparent mb-6">
              💬 Chat with Sgt. Ken
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Get instant answers to your questions about the recruitment process, department policies, 
              and career opportunities. Earn points for every interaction!
            </p>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent border border-[#0A3C1F]/20 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">{messageCount}</div>
                  <div className="text-sm text-gray-600 font-medium">Messages Sent</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">{totalPointsEarned}</div>
                  <div className="text-sm text-gray-600 font-medium">Points Earned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">5-7</div>
                  <div className="text-sm text-gray-600 font-medium">Points Per Message</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">Always Available</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="lg:col-span-3">
              <Card className="h-[70vh] sm:h-[600px] flex flex-col shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/90 text-white p-4 sm:p-6">
                  <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                    <div className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-full mr-3">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      Sgt. Ken - AI Assistant
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI-Powered
                      </Badge>
                      {currentUser && (
                        <Badge variant="secondary" className="bg-green-500/20 text-white border-green-300">
                          <Star className="h-3 w-3 mr-1" />
                          {totalPointsEarned} pts
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 sm:p-6 flex flex-col">
                  <div
                    ref={scrollAreaRef}
                    className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-4"
                  >
                    {/* Welcome message */}
                    {messages.length === 0 && !isLoading && !error && (
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/80 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 shadow-sm">
                            <p className="text-sm sm:text-base font-medium text-[#0A3C1F] mb-2">
                              👋 Hello! I'm Sgt. Ken, your AI recruitment assistant.
                            </p>
                            <p className="text-sm sm:text-base text-gray-700 mb-3">
                              I'm here to help you learn about becoming a San Francisco Deputy Sheriff. 
                              {currentUser ? " You'll earn 5-7 points for each question you ask!" : " Sign in to earn points for every interaction!"}
                            </p>
                            <div className="text-xs text-gray-500">
                              💡 Try asking about requirements, salary, training, or career opportunities
                            </div>
                          </div>
                        </div>

                        {/* Suggested questions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Quick Start Questions
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {suggestedQuestions.map((question, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestedQuestion(question)}
                                className="text-left text-xs sm:text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-2 rounded transition-colors"
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
                        className={`flex items-start space-x-3 sm:space-x-4 ${msg.role === "user" ? "justify-end" : ""}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/80 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                        )}
                        <div
                          className={`flex-1 rounded-lg p-3 sm:p-4 max-w-[85%] sm:max-w-[70%] shadow-sm ${
                            msg.role === "user" 
                              ? "bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/90 text-white text-right" 
                              : "bg-gradient-to-r from-gray-50 to-gray-100"
                          }`}
                        >
                          <p className="text-sm sm:text-base">{msg.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                            {msg.pointsAwarded && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                +{msg.pointsAwarded} pts {msg.searchUsed && "🔍"}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white flex-shrink-0 text-sm sm:text-base font-semibold shadow-md">
                            {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center justify-center py-4">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <div className="w-2 h-2 bg-[#0A3C1F] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#0A3C1F] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-[#0A3C1F] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
                  <div className="flex space-x-2">
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
                      className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white flex-shrink-0 px-4 sm:px-6 shadow-md hover:shadow-lg transition-all"
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
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-900 flex items-center">
                      <Trophy className="h-5 w-5 mr-2" />
                      Your Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Messages</span>
                      <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                        {messageCount}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Points Earned</span>
                      <Badge variant="secondary" className="bg-green-200 text-green-800">
                        {totalPointsEarned}
                      </Badge>
                    </div>
                    {!currentUser && (
                      <div className="text-center pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => openModal("signin", "recruit")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Sign In to Earn Points
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Tips Card */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-900 flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2" />
                      Ask About
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="text-sm space-y-2 text-green-800">
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-green-600" />
                        Application requirements
                      </li>
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-green-600" />
                        Salary and benefits
                      </li>
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-green-600" />
                        Training academy
                      </li>
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-green-600" />
                        Career opportunities
                      </li>
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-green-600" />
                        Daily responsibilities
                      </li>
                      <li className="flex items-center">
                        <Star className="h-3 w-3 mr-2 text-green-600" />
                        Department culture
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Games Promotion Card */}
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-yellow-900 flex items-center">
                      <Gamepad2 className="h-5 w-5 mr-2" />
                      Earn More Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-yellow-800">
                      Want to earn even more points? Try our interactive games!
                    </p>
                    <div className="space-y-2">
                      <Link href="/trivia">
                        <Button size="sm" variant="outline" className="w-full text-xs border-yellow-300 text-yellow-800 hover:bg-yellow-200">
                          <Trophy className="h-3 w-3 mr-1" />
                          SF Trivia (60-120 pts)
                        </Button>
                      </Link>
                      <Link href="/sgt-ken-says">
                        <Button size="sm" variant="outline" className="w-full text-xs border-yellow-300 text-yellow-800 hover:bg-yellow-200">
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
      </div>
    </PageWrapper>
  );
}
