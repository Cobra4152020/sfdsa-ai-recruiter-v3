"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logError } from "@/lib/error-monitoring";

export type MessageType = {
  role: "assistant" | "user";
  content: string | React.ReactNode;
  quickReplies?: string[];
  source?: string;
  id?: string;
};

interface MainContentProps {
  messages: MessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  displayedResponse: string;
}

export default function MainContent({
  messages,
  onSendMessage,
  isLoading,
  displayedResponse,
}: MainContentProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedResponse]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      try {
        onSendMessage(input.trim());
        setInput("");
      } catch (error) {
        console.error("Error sending message:", error);
        logError(
          "Failed to send message",
          error instanceof Error ? error : new Error(String(error)),
          "MainContent",
        );
      }
    }
  };

  const handleQuickReply = (reply: string) => {
    if (!isLoading) {
      try {
        // Special handling for trivia game link
        if (
          reply.toLowerCase().includes("trivia") ||
          reply.toLowerCase().includes("play sf trivia")
        ) {
          router.push("/trivia");
          return;
        }

        onSendMessage(reply);
      } catch (error) {
        console.error("Error handling quick reply:", error);
        logError(
          "Failed to handle quick reply",
          error instanceof Error ? error : new Error(String(error)),
          "MainContent",
        );
      }
    }
  };

  return (
    <>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Trivia game banner at the top */}
          <div className="bg-[#FFD700]/20 p-3 rounded-lg border border-[#FFD700] mb-4">
            <Link
              href="/trivia"
              className="flex items-center justify-between text-primary hover:underline"
            >
              <span className="font-medium">Play SF Trivia with Sgt. Ken!</span>
              <span className="flex items-center">
                <Gamepad2 className="h-4 w-4 mr-1" />
                Play Now
              </span>
            </Link>
          </div>

          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-3 ${
                  message.role === "assistant"
                    ? "bg-[#F0F0F0] dark:bg-[#2A2A2A] text-black dark:text-white"
                    : "bg-primary text-white"
                }`}
              >
                {message.role === "assistant" && index === messages.length - 1
                  ? displayedResponse
                  : message.content}
                {message.quickReplies && message.quickReplies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1 rounded-full bg-[#FFD700] text-primary font-medium hover:bg-[#FFD700]/80 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-xl p-4 bg-[#F0F0F0] dark:bg-[#2A2A2A] text-black dark:text-white">
                <div className="flex items-center">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-[#2A2A2A] dark:text-white dark:border-gray-600"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </>
  );
}
