"use client";

import type React from "react";

import { AuthModalProvider } from "@/context/auth-modal-context";
import { UnifiedRegistrationPopup } from "@/components/unified-registration-popup";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthModalProvider>
      {children}
      <UnifiedRegistrationPopup />
    </AuthModalProvider>
  );
}
