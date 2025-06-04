"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SetupAdminUserButton } from "@/components/admin/setup-admin-user-button";
import { getClientSideSupabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AdminSetupPage() {
  const supabase = getClientSideSupabase();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data.session) {
          setIsAuthenticated(true);
          setUserId(data.session.user.id);
          setEmail(data.session.user.email || "");
          setName(data.session.user.user_metadata?.name || "Admin User");
        } else {
          setError("You must be logged in to access this page");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to check authentication",
        );
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [supabase.auth]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3C1F]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-[#0A3C1F] mb-6">Admin Setup</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isAuthenticated && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Setup Admin User</CardTitle>
            <CardDescription>
              This will set up your account as an admin user in the database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Important</AlertTitle>
              <AlertDescription className="text-amber-700">
                This will create necessary database structures and set up your
                account as an admin. Make sure you&apos;re logged in with the
                account you want to make an admin.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <SetupAdminUserButton />
          </CardFooter>
        </Card>
      )}

      {!isAuthenticated && (
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to set up an admin user. Please log in
            first.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
