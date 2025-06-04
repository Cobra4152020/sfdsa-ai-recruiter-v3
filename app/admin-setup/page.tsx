"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Database } from "lucide-react";
import { setupAdminRpc } from "@/lib/actions/setup-admin-rpc";

export default function AdminSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSetup = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await setupAdminRpc({ email: "", setupCode: "" });

      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Database className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-center">Admin Database Setup</CardTitle>
          <CardDescription className="text-center">
            Set up required SQL functions for the admin system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <p>
            This will create the necessary SQL functions in your database to
            support admin operations. This is required before you can use the
            emergency admin fix.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetup} disabled={isLoading} className="w-full">
            {isLoading ? "Setting up..." : "Set Up Database Functions"}
          </Button>
        </CardFooter>
      </Card>

      {success && (
        <div className="mt-4 text-center">
          <p className="text-green-600 font-medium mb-2">
            Setup completed successfully!
          </p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/emergency-admin-fix")}
            className="mr-2"
          >
            Go to Emergency Admin Fix
          </Button>
        </div>
      )}
    </div>
  );
}
