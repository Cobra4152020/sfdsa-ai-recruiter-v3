"use client";

import { useState, useCallback } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/user-context";
import { RegistrationProvider } from "@/context/registration-context";
import { AuthModalProvider } from "@/context/auth-modal-context";
import { ImprovedHeader } from "@/components/improved-header";
import { ImprovedFooter } from "@/components/improved-footer";
import { UnifiedAuthModal } from "@/components/unified-auth-modal";
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button";
import { WebSocketErrorHandler } from "@/components/websocket-error-handler";
import { ErrorMonitor } from "@/components/error-monitor";
import PerformanceMonitor from "@/components/performance-monitor";
import { useClientOnly } from "@/hooks/use-client-only";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const memoizedCallback = useCallback(() => {
    return true;
  }, []);

  const isMounted = useClientOnly(memoizedCallback, false);

  const content = (
    <div className="min-h-screen flex flex-col">
      <ImprovedHeader />
      <main
        id="main-content"
        className="flex-1 pt-16 pb-12 bg-background dark:bg-[#121212]"
      >
        <WebSocketErrorHandler />
        <ErrorMonitor />
        <PerformanceMonitor />
        {children}
      </main>
      <ImprovedFooter />

      <div className="fixed bottom-6 right-6 z-50">
        <AskSgtKenButton position="fixed" variant="secondary" />
      </div>
      <UnifiedAuthModal />
    </div>
  );

  // Return a placeholder during server-side rendering
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="h-16 bg-white dark:bg-[#121212] animate-pulse" />
        <main className="flex-1 pt-16 pb-12 bg-background dark:bg-[#121212]">
          <div className="container mx-auto px-4">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          </div>
        </main>
        <div className="h-64 bg-white dark:bg-[#121212] animate-pulse" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <UserProvider>
        <RegistrationProvider>
          <AuthModalProvider>
            {content}
          </AuthModalProvider>
        </RegistrationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
