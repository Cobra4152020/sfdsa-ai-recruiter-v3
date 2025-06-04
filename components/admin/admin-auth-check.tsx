"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientSideSupabase } from "@/lib/supabase";
import { errorTracking } from "@/lib/error-tracking";

interface SessionInfo {
  user: {
    id: string;
    email: string;
    role: string;
  };
  expires_at: number;
}

interface UserInfo {
  id: string;
  email: string;
  role: string;
}

interface RoleCheckInfo {
  success: boolean;
  data: { role: string } | null;
  error: { message: string; code: string; details?: string } | null;
}

interface DebugInfo {
  timestamp: string;
  steps: string[];
  errors: unknown[];
  session?: SessionInfo | null;
  user?: UserInfo | null;
  roleCheck?: RoleCheckInfo | null;
}

export default function AdminAuthCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const router = useRouter();

  // Add test error function
  const triggerTestError = () => {
    try {
      throw new Error("Test LogRocket Error");
    } catch (error) {
      errorTracking.trackError(error as Error, {
        location: "AdminAuthCheck",
        type: "test_error",
        test: true,
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    async function checkAdminStatus() {
      const debugData: DebugInfo = {
        timestamp: new Date().toISOString(),
        steps: [],
        errors: [],
      };

      try {
        const supabase = getClientSideSupabase();
        debugData.steps.push("Supabase client initialized");

        // First check if we have a session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        debugData.steps.push("Session check completed");
        debugData.session = session
          ? {
              user: {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role,
              },
              expires_at: session.expires_at,
            }
          : null;

        if (!mounted) return;

        if (sessionError) {
          console.error("Session error:", sessionError);
          debugData.errors.push({
            type: "session_error",
            message: sessionError.message,
            code: sessionError.code,
          });
          errorTracking.trackError(sessionError, {
            location: "AdminAuthCheck",
            type: "session_error",
            debug: debugData,
          });
          setError("Failed to get session");
          setDebugInfo(debugData);
          return;
        }

        if (!session) {
          console.log("No session found, redirecting to login");
          debugData.steps.push("No session found, redirecting to login");
          router.replace("/admin/login");
          return;
        }

        // Verify the session is still valid
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        debugData.steps.push("User verification completed");
        debugData.user = user
          ? {
              id: user.id,
              email: user.email,
              role: user.role,
            }
          : null;

        if (!mounted) return;

        if (userError || !user) {
          console.error("User verification error:", userError);
          debugData.errors.push({
            type: "user_verification_error",
            message: userError?.message || "No user found",
            code: userError?.code,
          });
          errorTracking.trackError(userError || new Error("No user found"), {
            location: "AdminAuthCheck",
            type: "user_verification_error",
            debug: debugData,
          });
          setError("Session expired");
          setDebugInfo(debugData);
          return;
        }

        // Check if user has admin role
        debugData.steps.push("Checking admin role");
        const { data: userRoles, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        debugData.roleCheck = {
          success: !roleError,
          data: userRoles,
          error: roleError
            ? {
                message: roleError.message,
                code: roleError.code,
                details: roleError.details,
              }
            : null,
        };

        if (!mounted) return;

        if (roleError) {
          console.error("Role check error:", roleError);
          debugData.errors.push({
            type: "role_check_error",
            message: roleError.message,
            code: roleError.code,
            details: roleError.details,
          });
          errorTracking.trackError(roleError, {
            location: "AdminAuthCheck",
            type: "role_check_error",
            userId: user.id,
            debug: debugData,
          });
          setError("Failed to check admin role");
          setDebugInfo(debugData);
          return;
        }

        if (!userRoles || userRoles.role !== "admin") {
          console.log("User is not an admin, redirecting to unauthorized");
          debugData.steps.push(
            "User is not an admin, redirecting to unauthorized",
          );
          router.replace("/admin/unauthorized");
          return;
        }

        console.log("Admin check successful");
        debugData.steps.push("Admin check successful");
        setIsAdmin(true);
        setDebugInfo(debugData);
      } catch (error) {
        console.error("Error checking admin status:", error);
        debugData.errors.push({
          type: "unexpected_error",
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });
        errorTracking.trackError(error as Error, {
          location: "AdminAuthCheck",
          type: "unexpected_error",
          debug: debugData,
        });
        setError("An unexpected error occurred");
        setDebugInfo(debugData);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    checkAdminStatus();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md text-left">
              <h3 className="font-medium mb-2">Debug Information:</h3>
              <pre className="text-xs overflow-auto max-h-60">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
          <button
            onClick={() => {
              errorTracking.trackAction("Admin auth retry clicked", {
                location: "AdminAuthCheck",
                debug: debugInfo,
              });
              router.refresh();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return isAdmin ? (
    <>
      <button
        onClick={triggerTestError}
        className="fixed bottom-4 right-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Test LogRocket
      </button>
      {children}
    </>
  ) : null;
}
