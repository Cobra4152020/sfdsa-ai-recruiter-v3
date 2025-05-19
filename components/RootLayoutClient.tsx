"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/user-context"
import { RegistrationProvider } from "@/context/registration-context"
import { AuthModalProvider } from "@/context/auth-modal-context"
import PerformanceMonitor from "@/components/performance-monitor"
import { ErrorMonitor } from "@/components/error-monitor"
import { WebSocketErrorHandler } from "@/components/websocket-error-handler"
import MainLayoutClient from "@/components/MainLayoutClient"
import { getClientSideSupabase } from '@/lib/supabase/index'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <UserProvider>
        <RegistrationProvider>
          <AuthModalProvider>
            <WebSocketErrorHandler />
            <ErrorMonitor />
            <PerformanceMonitor />
            <MainLayoutClient>{children}</MainLayoutClient>
          </AuthModalProvider>
        </RegistrationProvider>
      </UserProvider>
    </ThemeProvider>
  )
} 