import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/user-context";
import { RegistrationProvider } from "@/context/registration-context";
import { AuthModalProvider } from "@/context/auth-modal-context";
import { ImprovedHeader } from "@/components/improved-header";
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer";
import { UnifiedAuthModal } from "@/components/unified-auth-modal";
import AskSgtKenButton from "@/components/ask-sgt-ken-button";
import { FloatingShareWidget } from "@/components/floating-share-widget";
import { WebSocketErrorHandler } from "@/components/websocket-error-handler";
import { ErrorMonitor } from "@/components/error-monitor";
import PerformanceMonitor from "@/components/performance-monitor";
import { ClerkProvider } from "@clerk/nextjs";
import { SupabaseProvider } from "@/context/supabase-context";
import { Toaster } from "@/components/ui/toaster";
import { AuthRecoveryInit } from "@/components/auth-recovery-init";
import { AuthErrorBoundary } from "@/components/auth-error-boundary";

const inter = Inter({ subsets: ["latin"] });

// Define metadata for SEO
export const metadata: Metadata = {
  title: "SF Deputy Sheriff Recruitment",
  description:
    "Join the San Francisco Deputy Sheriff&apos;s Department and make a difference in your community",
  metadataBase: new URL("https://sfdsa-recruitment.org"),
  keywords:
    "deputy sheriff, san francisco sheriff, law enforcement career, sheriff recruitment, police jobs, public safety careers",
  openGraph: {
    title: "SF Deputy Sheriff Recruitment",
    description:
      "Join the San Francisco Deputy Sheriff&apos;s Department and make a difference in your community",
    url: "https://sfdeputysheriff.com",
    siteName: "San Francisco Deputy Sheriff Recruitment",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "San Francisco Deputy Sheriff Recruitment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SF Deputy Sheriff Recruitment",
    description:
      "Join the San Francisco Deputy Sheriff&apos;s Department and make a difference in your community",
    images: ["/images/twitter-image.jpg"],
  },
};

// Separate viewport export (Next.js 15 requirement)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>SFDSA AI Recruiter</title>
          <meta
            name="description"
            content="San Francisco Deputy Sheriffs' Association AI Recruiter"
          />
          <meta name="generator" content="v0.dev" />
        </head>
        <body className={inter.className} suppressHydrationWarning>
          <AuthRecoveryInit />
          <ThemeProvider defaultTheme="light" storageKey="app-theme">
            <SupabaseProvider>
              <UserProvider>
                <RegistrationProvider>
                  <AuthModalProvider>
                    <AuthErrorBoundary>
                      <WebSocketErrorHandler>
                        <ErrorMonitor>
                          <PerformanceMonitor>
                            <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
                              <ImprovedHeader />
                              <main
                                id="main-content"
                                className="flex-1 pt-12 sm:pt-16 md:pt-20 dark:bg-black w-full"
                              >
                                {children}
                              </main>
                              <MobileOptimizedFooter />
                              <div className="hidden md:block fixed right-2 md:right-4 top-[85%] lg:top-[80%] z-50 flex flex-col space-y-4">
                                <AskSgtKenButton 
                                  variant="secondary"
                                />
                              </div>
                              <FloatingShareWidget />
                              <UnifiedAuthModal />
                            </div>
                          </PerformanceMonitor>
                        </ErrorMonitor>
                      </WebSocketErrorHandler>
                    </AuthErrorBoundary>
                  </AuthModalProvider>
                </RegistrationProvider>
              </UserProvider>
            </SupabaseProvider>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
