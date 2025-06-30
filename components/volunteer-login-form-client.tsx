"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock, Eye, EyeOff, AlertCircle, InfoIcon } from "lucide-react";
import { authService } from "@/lib/unified-auth-service-client";

export function VolunteerLoginFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const needsConfirmation = searchParams.get("needsConfirmation") === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.signInWithPassword(email, password);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Verify this is a volunteer account
      if (result.userType !== "volunteer") {
        throw new Error(
          "This account is not registered as a volunteer recruiter. Please use the regular login page.",
        );
      }

      toast({
        title: "Login successful",
        description: `Welcome back${result.name ? ", " + result.name : ""}!`,
      });

      // Redirect to the volunteer dashboard or pending page
      router.push(result.redirectUrl || "/volunteer-dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkLogin = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.signInWithMagicLink(
        email,
        "/volunteer-dashboard",
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      toast({
        title: "Magic link sent",
        description: "Check your email for a link to sign in",
      });
    } catch (error) {
      console.error("Magic link error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to send magic link",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {needsConfirmation && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Please check your email to confirm your account before logging in.
            The confirmation link will expire in 24 hours.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
          />
          <Label htmlFor="remember" className="text-sm">
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⟳</span>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-primary text-primary hover:bg-primary/10"
        onClick={handleMagicLinkLogin}
        disabled={isLoading}
      >
        Sign in with Magic Link
      </Button>

      <div className="text-center space-y-2 mt-4">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/volunteer-register"
            className="text-primary hover:underline font-medium"
          >
            Register as a Volunteer Recruiter
          </Link>
        </p>
        <p className="text-sm text-gray-600">
          <Link
            href="/resend-confirmation"
            className="text-primary hover:underline"
          >
            Resend confirmation email
          </Link>
        </p>
      </div>
    </>
  );
}
