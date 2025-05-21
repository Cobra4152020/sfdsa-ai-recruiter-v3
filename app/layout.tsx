import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import RootLayoutClient from "@/components/RootLayoutClient"

const inter = Inter({ subsets: ["latin"] })

// Define metadata for SEO
export const metadata: Metadata = {
  title: "SF Deputy Sheriff Recruitment",
  description: "Join the San Francisco Deputy Sheriff's Department and make a difference in your community",
  metadataBase: new URL('https://sfdsa-recruitment.org'),
  keywords:
    "deputy sheriff, san francisco sheriff, law enforcement career, sheriff recruitment, police jobs, public safety careers",
  openGraph: {
    title: "SF Deputy Sheriff Recruitment",
    description: "Join the San Francisco Deputy Sheriff's Department and make a difference in your community",
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
    description: "Join the San Francisco Deputy Sheriff's Department and make a difference in your community",
    images: ["/images/twitter-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>SFDSA AI Recruiter</title>
        <meta name="description" content="San Francisco Deputy Sheriffs' Association AI Recruiter" />
        <meta name="generator" content="v0.dev" />
        {/* All Tailwind CDN and fallback links removed. Only local CSS is used. */}
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <RootLayoutClient>{children}</RootLayoutClient>
        </ErrorBoundary>
      </body>
    </html>
  )
} 
