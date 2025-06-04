import { useCallback } from "react";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatWebSocketProps {
  onMessage: (message: Message) => void;
  onError: (error: Error) => void;
  onOpen: () => void;
  onClose: () => void;
}

export function useChatWebSocket({
  onMessage,
  onError,
  onOpen,
  onClose,
}: ChatWebSocketProps) {
  const sendMessage = useCallback(
    async (content: string) => {
      try {
        // Simulate sending message to backend
        // In a real app, this would connect to your WebSocket server
        const userMessage: Message = {
          content,
          role: "user",
          timestamp: new Date().toISOString(),
        };
        onMessage(userMessage);

        // Simulate assistant response
        setTimeout(() => {
          const assistantMessage: Message = {
            content:
              "This is a simulated response. In production, this would come from your chat backend.",
            role: "assistant",
            timestamp: new Date().toISOString(),
          };
          onMessage(assistantMessage);
        }, 1000);
      } catch (error) {
        onError(error as Error);
      }
    },
    [onMessage, onError],
  );

  const closeConnection = useCallback(() => {
    // Simulate closing connection
    onClose();
  }, [onClose]);

  // Simulate connection on mount
  setTimeout(onOpen, 500);

  return {
    sendMessage,
    closeConnection,
  };
}
