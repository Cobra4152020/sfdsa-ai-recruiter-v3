"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { logError } from "@/lib/error-monitoring";

interface FormTestResult {
  success: boolean;
  message: string;
  data?: {
    message?: string;
    error?: string;
    [key: string]: unknown;
  };
  timestamp: string;
}

interface TestData {
  name: string;
  email: string;
  password: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export function FormTest() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FormTestResult[]>([]);
  const { toast } = useToast();

  const testEndpoint = useCallback(
    async (
      endpoint: string,
      data: TestData,
      method = "POST",
    ): Promise<FormTestResult> => {
      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const responseData = (await response.json()) as ApiResponse;

        return {
          success: response.ok,
          message: response.ok
            ? `${endpoint} - Success (${response.status})`
            : `${endpoint} - Failed (${response.status}): ${responseData.message || "Unknown error"}`,
          data: responseData,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        logError(
          `Error testing endpoint ${endpoint}`,
          error instanceof Error ? error : new Error(String(error)),
          "FormTest",
        );
        return {
          success: false,
          message: `${endpoint} - Error: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date().toISOString(),
        };
      }
    },
    [],
  );

  const handleTestAuth = useCallback(async () => {
    if (!email || !name) {
      toast({
        title: "Missing fields",
        description: "Please fill in both name and email fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      // Test registration endpoint
      const testData: TestData = {
        name,
        email: `test_${Date.now()}@example.com`,
        password: "Test123!@#",
      };

      const registerResult = await testEndpoint("/api/auth/register", testData);
      setResults((prev) => [...prev, registerResult]);

      // Test other endpoints as needed
      // ...

      const successCount = results.filter((r) => r.success).length;
      const totalCount = results.length;

      toast({
        title: "Tests completed",
        description: `${successCount} of ${totalCount} tests passed`,
        variant: successCount === totalCount ? "default" : "destructive",
      });
    } catch (error) {
      logError(
        "Error running form tests",
        error instanceof Error ? error : new Error(String(error)),
        "FormTest",
      );
      toast({
        title: "Test error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, name, results, testEndpoint, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Submission Test</CardTitle>
        <CardDescription>
          Test form submissions and API endpoints
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Test User"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="test-mode" defaultChecked />
            <Label htmlFor="test-mode">
              Use test mode (no permanent changes)
            </Label>
          </div>

          <Button
            onClick={handleTestAuth}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              "Run Form Tests"
            )}
          </Button>

          {results.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Test Results:</h3>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border flex items-start ${
                    result.success
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="mr-3 mt-0.5">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{result.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                    {result.data && (
                      <pre className="text-xs mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
