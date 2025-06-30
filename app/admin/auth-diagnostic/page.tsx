"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Search } from "lucide-react";
import type { UserDiagnosticResult } from "@/lib/auth-diagnostic";

export default function AuthDiagnosticPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UserDiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth-diagnostic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to run diagnostic");
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFix = async () => {
    if (!result) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth-fix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: result.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fix auth issues");
      }

      // Re-run diagnostic to see the changes
      await runDiagnostic();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        Authentication Diagnostic Tool
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Authentication Diagnostic</CardTitle>
          <CardDescription>
            Check user authentication status across different systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={runDiagnostic}
              disabled={isLoading || !email}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⟳</span>
                  Checking...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  Check User
                </span>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Auth System</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      {result.authUserExists ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>User in auth.users</span>
                    </div>
                    {result.authUserExists && (
                      <div className="text-sm text-gray-500 ml-7">
                        ID: {result.authUserId}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">User Profile</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      {result.userProfileExists ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>User in user_profiles</span>
                    </div>
                    {result.userProfileExists && (
                      <>
                        <div className="text-sm text-gray-500 ml-7">
                          ID: {result.userProfileId}
                        </div>
                        <div className="flex items-center ml-7">
                          {result.isVolunteerRecruiter ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span className="text-sm">
                            Is Volunteer Recruiter
                          </span>
                        </div>
                        <div className="flex items-center ml-7">
                          {result.isEmailConfirmed ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span className="text-sm">Email Confirmed</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">User Role</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      {result.hasUserRole ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>Has Volunteer Recruiter Role</span>
                    </div>
                    {result.hasUserRole && (
                      <div className="flex items-center ml-7">
                        {result.roleActive ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span className="text-sm">Role Active</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Confirmation Token</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      {result.hasConfirmationToken ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>Has Confirmation Token</span>
                    </div>
                    {result.hasConfirmationToken && (
                      <>
                        <div className="flex items-center ml-7">
                          {!result.tokenExpired ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span className="text-sm">Token Valid</span>
                        </div>
                        <div className="flex items-center ml-7">
                          {result.tokenUsed ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span className="text-sm">Token Used</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {result.discrepancies.length > 0 && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">
                    Discrepancies Found
                  </AlertTitle>
                  <AlertDescription className="text-amber-700">
                    <ul className="list-disc pl-5 mt-2">
                      {result.discrepancies.map((discrepancy, index) => (
                        <li key={index}>{discrepancy}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {result.discrepancies.length > 0 && (
                <Button
                  onClick={handleFix}
                  disabled={isLoading}
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-primary"
                >
                  {isLoading ? "Fixing..." : "Fix Issues"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
