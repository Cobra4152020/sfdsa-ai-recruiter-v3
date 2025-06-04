"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertCircle } from "lucide-react";
import { getClientSideSupabase } from "@/lib/supabase";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = getClientSideSupabase();

      // Sign in with email and password
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user) {
        setError("No user returned from authentication");
        return;
      }

      // Check if user has admin role
      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", data.user.id)
        .single();

      if (userTypeError) {
        setError("Failed to verify admin status");
        return;
      }

      if (!userTypeData || userTypeData.user_type !== "admin") {
        setError("You do not have admin privileges");
        await supabase.auth.signOut();
        return;
      }

      // Log the successful login
      await supabase.from("login_audit_logs").insert({
        user_id: data.user.id,
        event_type: "admin_login",
        details: {
          email: data.user.email,
          method: "password",
        },
      });

      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-[#0A3C1F]">
          Admin Access
        </CardTitle>
        <CardDescription className="text-center">
          Secure access for authorized administrators only
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="bg-[#0A3C1F]/10 p-6 rounded-full">
            <Shield className="h-12 w-12 text-[#0A3C1F]" />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Login to Admin Dashboard"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>This access is for authorized administrators only.</p>
          <p>
            If you need assistance, please contact the system administrator.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
