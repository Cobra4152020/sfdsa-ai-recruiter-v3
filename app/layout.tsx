import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import PerformanceMonitor from "@/components/performance-monitor"
import { createPerformanceMetricsTable } from "@/lib/database-setup"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SFDSA AI Recruiter",
  description: "San Francisco Deputy Sheriffs' Association AI Recruiter",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Try to create the performance metrics table, but don't wait for it
  if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true") {
    createPerformanceMetricsTable().catch(console.error)
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <PerformanceMonitor />
        </ThemeProvider>
      </body>
    </html>
  )
}
