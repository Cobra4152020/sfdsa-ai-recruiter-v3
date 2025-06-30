"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

export function AuthDebug() {
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const loadClientModules = async () => {
      const { getClientSideSupabase } = await import("@/lib/supabase");
      const supabaseInstance = getClientSideSupabase();
      setSupabase(supabaseInstance);
    };
    loadClientModules();
  }, []);

  async function checkSession() {
    if (!supabase) return;
    try {
      setLoading(true);
      setError(null);

      // Get session
      const { data: sessionDataResult, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      setSessionData(sessionDataResult.session);

      // If we have a session, check roles
      if (sessionDataResult.session) {
        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", sessionDataResult.session.user.id);

        if (rolesError) {
          throw rolesError;
        }

        setUserRoles(rolesData);
      }
    } catch (err) {
      console.error("Auth debug error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (supabase) {
      checkSession();
    }
  }, [supabase]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
        <CardDescription>
          Check your authentication status and roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Session Status:</h3>
              <div className="bg-muted p-3 rounded-md overflow-auto max-h-40">
                <pre className="text-xs">
                  {JSON.stringify(sessionData, null, 2)}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">User Roles:</h3>
              <div className="bg-muted p-3 rounded-md overflow-auto max-h-40">
                <pre className="text-xs">
                  {JSON.stringify(userRoles, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={checkSession} variant="outline" size="sm">
                Refresh Data
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
