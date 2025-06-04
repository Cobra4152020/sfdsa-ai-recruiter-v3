"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Add type assertion to handle Next.js route types
const asRoute = (path: string) => path as unknown as string;

export function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams?.get("code") || null;
      const userType = searchParams?.get("userType") || "recruit";
      const callbackUrl = searchParams?.get("callbackUrl") || null;

      try {
        const response = await fetch("/api/auth/callback-handler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, userType, callbackUrl }),
        });
        const data = await response.json();
        router.replace(asRoute(data.redirectTo || "/"));
      } catch (error) {
        console.error("Auth callback error:", error);
        router.replace(asRoute("/"));
      }
    };
    handleAuthCallback();
  }, [router, searchParams]);

  return null;
}
