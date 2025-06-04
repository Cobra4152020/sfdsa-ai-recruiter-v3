"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { setupLoggingSystem } from "@/lib/actions/setup-logging-system";
import { AlertCircle, CheckCircle, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function SetupLoggingButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    created?: boolean;
  } | null>(null);

  const { toast } = useToast();

  const handleSetup = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const setupResult = await setupLoggingSystem({});
      setResult(setupResult);

      toast({
        title: setupResult.success ? "Setup Successful" : "Setup Failed",
        description: setupResult.message,
        variant: setupResult.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error setting up logging system:", error);
      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });

      toast({
        title: "Setup Failed",
        description: "An unexpected error occurred during setup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleSetup} disabled={isLoading} className="mb-4">
        <Database className="h-4 w-4 mr-2" />
        {isLoading ? "Setting Up..." : "Setup Logging System"}
      </Button>

      {result && (
        <div
          className={`p-4 rounded-md ${
            result.success
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {result.success ? (
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">{result.message}</p>
                {result.created ? (
                  <p className="text-sm text-green-600 mt-1">
                    Logging system tables were created successfully.
                  </p>
                ) : (
                  <p className="text-sm text-green-600 mt-1">
                    Logging system tables already exist.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Setup Failed</p>
                <p className="text-sm text-red-600 mt-1">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
