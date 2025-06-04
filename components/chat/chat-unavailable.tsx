import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";

interface ChatUnavailableProps {
  onRetry: () => void;
}

export function ChatUnavailable({ onRetry }: ChatUnavailableProps) {
  return (
    <Alert className="bg-gray-50 border-gray-200">
      <WifiOff className="h-4 w-4 text-gray-600" />
      <AlertTitle className="text-gray-800">Connection Lost</AlertTitle>
      <AlertDescription className="flex items-center justify-between text-gray-700">
        <span>
          Unable to connect to chat service. Please check your connection.
        </span>
        <Button variant="outline" size="sm" onClick={onRetry} className="ml-2">
          <RefreshCw className="h-4 w-4 mr-1" />
          Reconnect
        </Button>
      </AlertDescription>
    </Alert>
  );
}
