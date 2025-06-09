"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getClientSideSupabase } from "@/lib/supabase";

export default function BypassPage() {
  const [status, setStatus] = useState("Checking authentication...");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getClientSideSupabase();
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setStatus(`Auth error: ${error.message}`);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          setStatus(`Authenticated as: ${session.user.email}`);
        } else {
          setStatus("Not authenticated");
        }
      } catch (error) {
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    checkAuth();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Authentication Bypass</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>{status}</span>
          </div>

          {user && (
            <div className="bg-green-50 p-4 rounded border">
              <p className="text-sm text-green-700">
                <strong>User ID:</strong> {user.id}
              </p>
              <p className="text-sm text-green-700">
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Button 
              onClick={() => router.push("/dashboard")} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
            
            <Button 
              onClick={() => router.push("/profile/edit")} 
              variant="outline"
              className="w-full"
            >
              Go to Profile Edit
            </Button>

            <Button 
              onClick={() => router.push("/")} 
              variant="ghost"
              className="w-full"
            >
              Go to Home
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Use this page to bypass authentication issues
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 