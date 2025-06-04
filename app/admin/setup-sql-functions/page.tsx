"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SetupSqlFunctionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const setupFunctions = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/create-table-check-function", {
        method: "POST",
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error setting up SQL functions:", error);
      setResult({ success: false, message: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Setup SQL Functions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create SQL Helper Functions</CardTitle>
          <CardDescription>
            Create utility SQL functions needed by the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            This will create the following SQL functions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-500">
            <li>
              <code>check_table_exists</code> - Checks if a table exists in the
              database
            </li>
            <li>
              <code>exec_sql</code> - Executes arbitrary SQL (for admin use
              only)
            </li>
          </ul>

          {result && (
            <Alert
              variant={result.success ? "success" : "destructive"}
              className="mt-4"
            >
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={setupFunctions} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Setting up..." : "Setup SQL Functions"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
