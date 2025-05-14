import ChatWithSgtKenClient from "@/components/chat-with-sgt-ken/chat-with-sgt-ken-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chat with Sgt. Ken | SF Deputy Sheriff's Association",
  description: "Get answers to your questions about becoming a Deputy Sheriff",
}

export default function ChatWithSgtKenPage() {
  return <ChatWithSgtKenClient />
}
