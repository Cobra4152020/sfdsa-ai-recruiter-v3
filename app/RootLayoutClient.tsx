"use client";

import { useEffect, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthModalProvider } from "@/context/auth-modal-context";
import { UserProvider, useUser } from "@/context/user-context";
import { getClientSideSupabase } from "@/lib/supabase";
// import { Analytics } from "@vercel/analytics/react"; // Commented out for now
// import { SpeedInsights } from "@vercel/speed-insights/next"; // Commented out for now
import { ErrorMonitor } from "@/components/error-monitor";
import PerformanceMonitor from "@/components/performance-monitor";
import { WebSocketErrorHandler } from "@/components/websocket-error-handler";
import { ImprovedHeader } from "@/components/improved-header";
import { ImprovedFooter } from "@/components/improved-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { RegistrationProvider } from "@/context/registration-context";

interface RootLayoutClientProps {
  children: ReactNode;
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const { setCurrentUser } = useUser();

  useEffect(() => {
    const supabase = getClientSideSupabase();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { user } = session;
          setCurrentUser({
            ...user,
            email: user.email ?? "",
          });
        } else {
          setCurrentUser(null);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setCurrentUser]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserProvider>
        <RegistrationProvider>
          <AuthModalProvider>
            <TooltipProvider>
              <ErrorMonitor>
                <PerformanceMonitor>
                  <WebSocketErrorHandler>
                    <ImprovedHeader />
                    {children}
                    <ImprovedFooter />
                    <Toaster />
                  </WebSocketErrorHandler>
                </PerformanceMonitor>
              </ErrorMonitor>
            </TooltipProvider>
          </AuthModalProvider>
        </RegistrationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
