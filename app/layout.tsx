import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import PerformanceMonitor from "@/components/performance-monitor"
import { ErrorMonitor } from "@/components/error-monitor"
import { WebSocketErrorHandler } from "@/components/websocket-error-handler"
import { RegistrationProvider } from "@/context/registration-context"
import { AuthModalProvider } from "@/context/auth-modal-context"
import Head from 'next/head'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>SFDSA AI Recruiter</title>
        <meta name="description" content="San Francisco Deputy Sheriffs' Association AI Recruiter" />
        <meta name="generator" content="v0.dev" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <RegistrationProvider>
            <AuthModalProvider>
              <WebSocketErrorHandler />
              <ErrorMonitor />
              <PerformanceMonitor />
              {children}
            </AuthModalProvider>
          </RegistrationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
