"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { simpleLoginFix } from "@/lib/actions/simple-login-fix";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface Result {
  success: boolean;
  message: string;
  error?: string;
}

export function SimpleFixLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleFix = async () => {
    setIsLoading(true);
    try {
      const result = await simpleLoginFix({});
      setResult(result);
    } catch (error) {
      console.error("Error fixing login issues:", error);
      setResult({
        success: false,
        message: "An unexpected error occurred in the client",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Simple Login Fix</CardTitle>
        <CardDescription>
          This will directly fix login issues by correcting database constraints
          and user roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <Alert
            className={
              result.success
                ? "bg-green-50 border-green-200 mb-4"
                : "bg-red-50 border-red-200 mb-4"
            }
          >
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              <div>{result.message}</div>
              {!result.success && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? "Hide Details" : "Show Details"}
                  </Button>

                  {showDetails && (
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <p className="text-sm">This simplified fix will:</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Remove and recreate the role constraint</li>
            <li>Ensure at least one admin user exists</li>
            <li>Sync user_roles with user_types table</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleFix} disabled={isLoading} className="w-full">
          {isLoading ? "Fixing..." : "Apply Simple Fix"}
        </Button>
      </CardFooter>
    </Card>
  );
}
