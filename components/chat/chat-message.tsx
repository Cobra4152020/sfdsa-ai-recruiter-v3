import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  content: string
  role: "user" | "assistant"
  timestamp: string
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn(
      "flex gap-3 items-start",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="w-8 h-8">
        {isUser ? (
          <>
            <AvatarImage src="/images/default-user.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/images/sgt-ken.png" alt="Sgt. Ken" />
            <AvatarFallback>SK</AvatarFallback>
          </>
        )}
      </Avatar>
      <div className={cn(
        "rounded-lg px-4 py-2 max-w-[80%]",
        isUser ? "bg-[#0A3C1F] text-white" : "bg-gray-100 text-gray-900"
      )}>
        <p className="text-sm">{message.content}</p>
        <span className="text-xs text-gray-500 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
} 