import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"

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
  // Note: We're removing the direct call to createPerformanceMetricsTable here
  // It will be handled in a client component instead

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary fallback={<div className="p-4">Something went wrong. Please try refreshing the page.</div>}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            {/* Performance monitoring will be loaded in a client component */}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
