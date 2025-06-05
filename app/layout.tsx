import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>SFDSA AI Recruiter</title>
        <meta
          name="description"
          content="San Francisco Deputy Sheriffs' Association AI Recruiter"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="generator" content="v0.dev" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <UserProvider>
            <RegistrationProvider>
              <AuthModalProvider>
                <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
                  <ImprovedHeader />
                  <main
                    id="main-content"
                    className="flex-1 pt-16 pb-12 bg-background dark:bg-black w-full"
                  >
                    <WebSocketErrorHandler />
                    <ErrorMonitor />
                    <PerformanceMonitor />
                    {children}
                  </main>
                  <ImprovedFooter />
                  <div className="fixed-mobile-safe z-50">
                    <AskSgtKenButton position="fixed" variant="secondary" />
                  </div>
                  <UnifiedAuthModal />
                </div>
              </AuthModalProvider>
            </RegistrationProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
