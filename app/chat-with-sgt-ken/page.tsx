"use client";

import { useState, useRef } from "react";
import { useMessageHistory } from "@/hooks/use-message-history";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { PageWrapper } from "@/components/page-wrapper";
import { MessageSquare, Bot, Send } from "lucide-react";
import { useUser } from "@/context/user-context";
import { useAuthModal } from "@/context/auth-modal-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export default function ChatWithSgtKenPage() {
  const { currentUser } = useUser();
  const { openModal } = useAuthModal();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { addMessage } = useMessageHistory();
  useScrollToBottom(scrollAreaRef, messages);

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
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);

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

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A3C1F] mb-4">
              Chat with Sgt. Ken
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Get answers to your questions about the recruitment process,
              department policies, and career opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <Card className="h-[70vh] sm:h-[600px] flex flex-col">
                <CardHeader className="bg-[#0A3C1F] text-white p-4 sm:p-6">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Bot className="h-5 w-5 mr-2" />
                    Sgt. Ken
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 sm:p-6 flex flex-col">
                  <div
                    ref={scrollAreaRef}
                    className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-4"
                  >
                    {messages.length === 0 && !isLoading && !error && (
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-8 h-8 rounded-full bg-[#0A3C1F] flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-lg p-3 sm:p-4">
                          <p className="text-sm sm:text-base">
                            Hello! I&apos;m Sgt. Ken, your AI assistant. How can
                            I help you today?
                          </p>
                        </div>
                      </div>
                    )}
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 sm:space-x-4 ${msg.role === "user" ? "justify-end" : ""}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-[#0A3C1F] flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                        )}
                        <div
                          className={`flex-1 rounded-lg p-3 sm:p-4 max-w-[85%] sm:max-w-[70%] ${msg.role === "user" ? "bg-[#0A3C1F]/10 text-right" : "bg-gray-100"}`}
                        >
                          <p className="text-sm sm:text-base">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white flex-shrink-0 text-sm sm:text-base">
                            {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <p className="text-center text-gray-500 text-sm sm:text-base">
                        Sgt. Ken is typing...
                      </p>
                    )}
                    {error && (
                      <p className="text-center text-red-500 text-sm sm:text-base">Error: {error}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && !isLoading && handleSendMessage()
                      }
                      placeholder="Type your message..."
                      className="flex-1 text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white flex-shrink-0 px-3 sm:px-4"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:block">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Ask about:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Application requirements</li>
                      <li>• Salary and benefits</li>
                      <li>• Training process</li>
                      <li>• Career opportunities</li>
                      <li>• Department culture</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Need Help?</h4>
                    <p className="text-sm text-gray-600">
                      Sgt. Ken is here 24/7 to answer your questions about joining 
                      the San Francisco Sheriff&apos;s Office.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Quick Tips - Only shown on mobile */}
          <div className="lg:hidden mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Ask about:</h4>
                    <ul className="space-y-1 text-gray-600 text-xs">
                      <li>• Requirements</li>
                      <li>• Salary & benefits</li>
                      <li>• Training process</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Available 24/7</h4>
                    <p className="text-xs text-gray-600">
                      Get instant answers about the SFSO recruitment process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
