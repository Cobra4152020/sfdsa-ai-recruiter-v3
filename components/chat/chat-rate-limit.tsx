import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock } from "lucide-react";

export function ChatRateLimit() {
  return (
    <Alert className="bg-yellow-50 border-yellow-200">
      <Clock className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Rate Limited</AlertTitle>
      <AlertDescription className="text-yellow-700">
        You&apos;re sending messages too quickly. Please wait a moment before
        sending another message.
      </AlertDescription>
    </Alert>
  );
}
