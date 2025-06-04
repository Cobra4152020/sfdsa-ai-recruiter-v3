"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { setupAdminUser } from "@/lib/actions/setup-admin-user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function SetupAdminUserButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const result = await setupAdminUser({});
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleSetup} disabled={isLoading} className="w-full">
        {isLoading ? "Setting up..." : "Set Up Admin User"}
      </Button>
    </div>
  );
}
