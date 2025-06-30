"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VolunteerConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No confirmation token provided");
      return;
    }

    const confirmEmail = async () => {
      try {
        const response = await fetch(`/api/volunteer-confirm?token=${token}`, {
          method: "GET",
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message);
          setEmail(data.email || "");
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to confirm your email");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred");
        console.error("Error confirming email:", error);
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Email Confirmation</CardTitle>
            <CardDescription>Volunteer Recruiter Account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-center text-gray-600">
                  Confirming your email address...
                </p>
              </div>
            )}

            {status === "success" && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">
                  Email Confirmed
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-5 w-5" />
                <AlertTitle>Confirmation Failed</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center pt-4">
              {status === "success" ? (
                <Button
                  onClick={() => router.push("/volunteer-login")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Log In to Your Account
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/volunteer-register")}
                  variant="outline"
                  className="border-primary text-primary"
                >
                  Back to Registration
                </Button>
              )}
            </div>

            {status === "success" && email && (
              <p className="text-center text-sm text-gray-500 mt-4">
                You can now log in with your email address:{" "}
                <strong>{email}</strong>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
