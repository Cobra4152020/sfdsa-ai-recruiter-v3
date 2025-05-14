import { cn } from "@/lib/utils"

interface EnhancedChatBubbleProps {
  message: string
  isUser: boolean
  timestamp?: string
}

export default function EnhancedChatBubble({ message, isUser, timestamp }: EnhancedChatBubbleProps) {
  return (
    <div className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isUser ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none",
        )}
      >
        <p className="whitespace-pre-wrap">{message}</p>
        {timestamp && <div className={cn("text-xs mt-1", isUser ? "text-blue-100" : "text-gray-500")}>{timestamp}</div>}
      </div>
    </div>
  )
}
