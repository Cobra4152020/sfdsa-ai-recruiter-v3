"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Send, RefreshCw } from "lucide-react";

interface AuthStep {
  name: string;
  message?: string;
  success: boolean;
  details?: Record<string, unknown>;
}

interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  details?: Record<string, unknown>;
  steps?: AuthStep[];
}

type TestResults = {
  config?: TestResult;
  delivery?: TestResult;
  volunteer?: TestResult;
  auth?: TestResult;
};

export default function EmailDiagnosticsPage() {
  const [email, setEmail] = useState("");
  const [testResults, setTestResults] = useState<TestResults>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("configuration");

  const runConfigTest = async () => {
    setIsLoading({ ...isLoading, config: true });
    try {
      const res = await fetch("/api/admin/email-diagnostics/config");
      const data = await res.json();
      setTestResults({ ...testResults, config: data });
    } catch (error) {
      console.error("Configuration test failed:", error);
      setTestResults({
        ...testResults,
        config: { success: false, error: "Failed to run configuration test" },
      });
    } finally {
      setIsLoading({ ...isLoading, config: false });
    }
  };

  const testEmailDelivery = async () => {
    if (!email) return;
    setIsLoading({ ...isLoading, delivery: true });
    try {
      const res = await fetch("/api/admin/email-diagnostics/test-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setTestResults({ ...testResults, delivery: data });
    } catch (error) {
      console.error("Email delivery test failed:", error);
      setTestResults({
        ...testResults,
        delivery: { success: false, error: "Failed to test email delivery" },
      });
    } finally {
      setIsLoading({ ...isLoading, delivery: false });
    }
  };

  const testVolunteerConfirmation = async () => {
    if (!email) return;
    setIsLoading({ ...isLoading, volunteer: true });
    try {
      const res = await fetch(
        "/api/admin/email-diagnostics/test-volunteer-confirmation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      setTestResults({ ...testResults, volunteer: data });
    } catch (error) {
      console.error("Volunteer confirmation test failed:", error);
      setTestResults({
        ...testResults,
        volunteer: {
          success: false,
          error: "Failed to test volunteer confirmation",
        },
      });
    } finally {
      setIsLoading({ ...isLoading, volunteer: false });
    }
  };

  const testAuthFlow = async () => {
    setIsLoading({ ...isLoading, auth: true });
    try {
      const res = await fetch("/api/admin/email-diagnostics/test-auth-flow");
      const data = await res.json();
      setTestResults({ ...testResults, auth: data });
    } catch (error) {
      console.error("Auth flow test failed:", error);
      setTestResults({
        ...testResults,
        auth: { success: false, error: "Failed to test auth flow" },
      });
    } finally {
      setIsLoading({ ...isLoading, auth: false });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Email Diagnostics</h1>
      <p className="text-gray-600 mb-8">
        Use this tool to diagnose issues with email sending, particularly for
        volunteer recruiter confirmation emails.
      </p>

      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Test Email Address
        </label>
        <div className="flex gap-4">
          <Input
            id="email"
            type="email"
            placeholder="Enter email for testing"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="delivery">Email Delivery</TabsTrigger>
          <TabsTrigger value="volunteer">Volunteer Confirmation</TabsTrigger>
          <TabsTrigger value="auth">Auth Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration Test</CardTitle>
              <CardDescription>
                Verify that all required environment variables and
                configurations are set correctly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.config ? (
                <div className="space-y-4">
                  <Alert
                    variant={
                      testResults.config.success ? "default" : "destructive"
                    }
                  >
                    <div className="flex items-center gap-2">
                      {testResults.config.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <AlertTitle>
                        {testResults.config.success
                          ? "Configuration Valid"
                          : "Configuration Error"}
                      </AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {testResults.config.message}
                    </AlertDescription>
                  </Alert>

                  {testResults.config.details && (
                    <div className="mt-4 border rounded-md p-4 bg-gray-50">
                      <h4 className="font-medium mb-2">
                        Configuration Details:
                      </h4>
                      <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                        {JSON.stringify(testResults.config.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Run the test to see configuration status.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={runConfigTest} disabled={isLoading.config}>
                {isLoading.config ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Run Configuration Test"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Email Delivery Test</CardTitle>
              <CardDescription>
                Send a test email to verify that the email delivery system is
                working correctly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.delivery ? (
                <div className="space-y-4">
                  <Alert
                    variant={
                      testResults.delivery.success ? "default" : "destructive"
                    }
                  >
                    <div className="flex items-center gap-2">
                      {testResults.delivery.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <AlertTitle>
                        {testResults.delivery.success
                          ? "Email Sent Successfully"
                          : "Email Delivery Failed"}
                      </AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {testResults.delivery.message}
                    </AlertDescription>
                  </Alert>

                  {testResults.delivery.details && (
                    <div className="mt-4 border rounded-md p-4 bg-gray-50">
                      <h4 className="font-medium mb-2">Delivery Details:</h4>
                      <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                        {JSON.stringify(testResults.delivery.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Enter an email address and run the test to check delivery.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={testEmailDelivery}
                disabled={isLoading.delivery || !email}
              >
                {isLoading.delivery ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="volunteer">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Confirmation Test</CardTitle>
              <CardDescription>
                Test the volunteer recruiter confirmation email flow
                specifically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.volunteer ? (
                <div className="space-y-4">
                  <Alert
                    variant={
                      testResults.volunteer.success ? "default" : "destructive"
                    }
                  >
                    <div className="flex items-center gap-2">
                      {testResults.volunteer.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <AlertTitle>
                        {testResults.volunteer.success
                          ? "Volunteer Confirmation Email Sent"
                          : "Volunteer Confirmation Failed"}
                      </AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {testResults.volunteer.message}
                    </AlertDescription>
                  </Alert>

                  {testResults.volunteer.details && (
                    <div className="mt-4 border rounded-md p-4 bg-gray-50">
                      <h4 className="font-medium mb-2">Details:</h4>
                      <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                        {JSON.stringify(testResults.volunteer.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Enter an email address and run the test to check volunteer
                  confirmation.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={testVolunteerConfirmation}
                disabled={isLoading.volunteer || !email}
              >
                {isLoading.volunteer ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Volunteer Confirmation"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>Auth Flow Test</CardTitle>
              <CardDescription>
                Test the complete authentication flow including registration,
                confirmation, and access control.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.auth ? (
                <div className="space-y-4">
                  <Alert
                    variant={
                      testResults.auth.success ? "default" : "destructive"
                    }
                  >
                    <div className="flex items-center gap-2">
                      {testResults.auth.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <AlertTitle>
                        {testResults.auth.success
                          ? "Auth Flow Valid"
                          : "Auth Flow Issues Detected"}
                      </AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {testResults.auth.message}
                    </AlertDescription>
                  </Alert>

                  {testResults.auth.steps && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Auth Flow Steps:</h4>
                      <div className="space-y-2">
                        {testResults.auth.steps.map(
                          (step: AuthStep, index: number) => (
                            <div
                              key={index}
                              className={`p-3 rounded-md flex items-start gap-2 ${
                                step.success ? "bg-green-50" : "bg-red-50"
                              }`}
                            >
                              {step.success ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                              )}
                              <div>
                                <p className="font-medium">{step.name}</p>
                                <p className="text-sm text-gray-600">
                                  {step.message}
                                </p>
                                {step.details && (
                                  <pre className="text-xs mt-2 overflow-auto p-2 bg-white bg-opacity-50 rounded">
                                    {JSON.stringify(step.details, null, 2)}
                                  </pre>
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Run the test to verify the complete auth flow.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={testAuthFlow} disabled={isLoading.auth}>
                {isLoading.auth ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Auth Flow"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
