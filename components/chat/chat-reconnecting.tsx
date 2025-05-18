import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function ChatReconnecting() {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      <AlertTitle className="text-blue-800">Reconnecting</AlertTitle>
      <AlertDescription className="text-blue-700">
        Attempting to reconnect to the chat service...
      </AlertDescription>
    </Alert>
  )
} 