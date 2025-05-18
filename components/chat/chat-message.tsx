import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Check, CheckCheck } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

export interface Message {
  content: string
  role: "user" | "assistant"
  timestamp: string
  status?: "sent" | "delivered" | "read"
  attachments?: Array<{
    type: "image" | "file"
    url: string
    name: string
  }>
}

interface ChatMessageProps {
  message: Message
}

const StatusIndicator = ({ status }: { status?: string }) => {
  if (!status) return null
  return (
    <span className="ml-2">
      {status === "delivered" && <Check className="h-4 w-4 text-gray-400" />}
      {status === "read" && <CheckCheck className="h-4 w-4 text-blue-500" />}
    </span>
  )
}

const Attachment = ({ attachment }: { attachment: Message["attachments"][0] }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (attachment.type === "image") {
    return (
      <div 
        className="relative mt-2 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.div
          animate={{ height: isExpanded ? "auto" : "200px" }}
          className="relative overflow-hidden rounded-lg"
        >
          <Image
            src={attachment.url}
            alt={attachment.name}
            width={400}
            height={300}
            className="object-cover"
          />
        </motion.div>
      </div>
    )
  }

  return (
    <a 
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex items-center gap-2 text-blue-500 hover:underline"
    >
      📎 {attachment.name}
    </a>
  )
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
        <div className="prose prose-sm dark:prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        
        {message.attachments?.map((attachment, index) => (
          <Attachment key={index} attachment={attachment} />
        ))}

        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
          {isUser && <StatusIndicator status={message.status} />}
        </div>
      </div>
    </div>
  )
} 