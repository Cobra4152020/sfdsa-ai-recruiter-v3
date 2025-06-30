"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getClientSideSupabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

export function AuthTestClient() {
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      setLoading(true);
      setError(null);

      const supabase = getClientSideSupabase();
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      setSessionData(data.session);

      if (data.session?.user) {
        setUserInfo(data.session.user);
      }
    } catch (err) {
      console.error("Session check error:", err);
      setError(err instanceof Error ? err.message : "Failed to check session");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      setLoading(true);
      const supabase = getClientSideSupabase();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSessionData(null);
      setUserInfo(null);
    } catch (err) {
      console.error("Sign out error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign out");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <div className="text-center py-4">
          <div
            className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full"
            aria-hidden="true"
          ></div>
          <p className="mt-2">Checking authentication status...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              <h3 className="font-medium">Error</h3>
              <p>{error}</p>
            </div>
          )}

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Session Status</h3>
            <p className="mb-2">
              {sessionData ? (
                <span className="text-green-600 font-medium">
                  ✓ Authenticated
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ✗ Not authenticated
                </span>
              )}
            </p>

            {sessionData && sessionData.expires_at && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Session expires at:{" "}
                  {new Date(sessionData.expires_at * 1000).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {userInfo && (
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-mono text-xs break-all">{userInfo.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{userInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Verified</p>
                  <p>{userInfo.email_confirmed_at ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Sign In</p>
                  <p>
                    {userInfo.last_sign_in_at
                      ? new Date(userInfo.last_sign_in_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button onClick={checkSession} variant="outline">
              Refresh Status
            </Button>

            {sessionData && (
              <Button onClick={handleSignOut} variant="destructive">
                Sign Out
              </Button>
            )}

            {!sessionData && (
              <Button
                onClick={() => (window.location.href = "/login")}
                className="bg-primary hover:bg-primary/90"
              >
                Go to Login
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
}
