import { useState, useCallback } from "react";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export function useMessageHistory() {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    clearMessages,
  };
}
