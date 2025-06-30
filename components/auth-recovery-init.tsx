"use client";

import { useEffect } from "react";
import { authRecovery } from "@/lib/auth-recovery";

export function AuthRecoveryInit() {
  useEffect(() => {
    authRecovery.initializeGlobalErrorHandlers();
  }, []);

  return null; // This component doesn't render anything
} 