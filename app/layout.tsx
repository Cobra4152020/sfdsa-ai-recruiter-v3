import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/user-context"
import { Toaster } from "@/components/ui/toaster"
import { EnhancedChatBubble } from "@/components/enhanced-chat-bubble"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "San Francisco Sheriff's Department Recruitment",
  description: "Join the San Francisco Sheriff's Department and make a difference in your community.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <UserProvider>
            {children}
            <Toaster />
            <EnhancedChatBubble />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
