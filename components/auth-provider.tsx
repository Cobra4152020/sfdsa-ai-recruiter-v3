"use client";

import type React from "react";

import { AuthModalProvider } from "@/context/auth-modal-context";
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthModalProvider>
      {children}
    </AuthModalProvider>
  );
}
