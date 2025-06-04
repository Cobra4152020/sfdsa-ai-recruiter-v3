"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/context/auth-modal-context";
import { useAuth } from "@/hooks/use-auth";

interface UseAuthGuardOptions {
  redirectTo?: string;
  requiredRole?: "recruit" | "volunteer" | "admin";
  requiredPoints?: number;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo, requiredRole, requiredPoints } = options;
  const { user, userRole, userPoints, isLoading } = useAuth();
  const { openModal } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // If user is not authenticated, open the sign-in modal or redirect
    if (!user) {
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        openModal("signin", requiredRole || "recruit");
      }
      return;
    }

    // If a specific role is required, check if the user has that role
    if (requiredRole && userRole !== requiredRole) {
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        // Could show an unauthorized message or redirect to a default page
        router.push("/unauthorized");
      }
      return;
    }

    // If points requirement exists, check if user has enough points
    if (requiredPoints && userPoints < requiredPoints) {
      router.push(`/points-gate?required=${requiredPoints}`);
      return;
    }
  }, [
    user,
    userRole,
    userPoints,
    isLoading,
    redirectTo,
    requiredRole,
    requiredPoints,
    router,
    openModal,
  ]);

  return {
    isAuthenticated: !!user,
    isAuthorized: requiredRole ? userRole === requiredRole : true,
    hasEnoughPoints: requiredPoints ? userPoints >= requiredPoints : true,
    isLoading,
  };
}
