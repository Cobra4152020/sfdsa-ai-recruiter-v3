import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ApplyProvider } from "@/context/apply-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ApplyProvider>{children}</ApplyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
