import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import Script from "next/script"
import RootLayoutClient from "../components/RootLayoutClient"

const inter = Inter({ subsets: ["latin"] })

// Define metadata for SEO
export const metadata: Metadata = {
  title: "SF Deputy Sheriff Recruitment | Join Our Team",
  description:
    "Join the San Francisco Sheriff's Office. Competitive salary, benefits, and career advancement opportunities. Apply now for a rewarding career in law enforcement.",
  keywords:
    "deputy sheriff, san francisco sheriff, law enforcement career, sheriff recruitment, police jobs, public safety careers",
  openGraph: {
    title: "SF Deputy Sheriff Recruitment | Join Our Team",
    description:
      "Join the San Francisco Sheriff's Office. Competitive salary, benefits, and career advancement opportunities. Apply now for a rewarding career in law enforcement.",
    url: "https://sfdeputysheriff.com",
    siteName: "San Francisco Deputy Sheriff Recruitment",
    images: [
      {
        url: "/og-image.jpg",
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
    title: "SF Deputy Sheriff Recruitment | Join Our Team",
    description:
      "Join the San Francisco Sheriff's Office. Competitive salary, benefits, and career advancement opportunities. Apply now for a rewarding career in law enforcement.",
    images: ["/twitter-image.jpg"],
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
        {/* Primary CDN link to Tailwind */}
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.17/dist/tailwind.min.css" rel="stylesheet" />
        
        {/* Fallback to local copy */}
        <link href="/css/tailwind.min.css" rel="stylesheet" />
        
        {/* Minimal CSS fallback */}
        <link href="/css/inline-tailwind.css" rel="stylesheet" />
        
        {/* Script fallback if CSS links fail */}
        <Script id="tailwind-fallback" strategy="beforeInteractive">{`
          (function() {
            if (!document.querySelector('link[href*="tailwindcss"]')) {
              var link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@3.4.17/dist/tailwind.min.css';
              document.head.appendChild(link);
              console.log('Tailwind CSS loaded via script fallback');
            }
          })();
        `}</Script>
        
        {/* Backup styles for Shadcn components */}
        <style>{`
          :root {
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 222.2 84% 4.9%;
            --primary: 221.2 83.2% 53.3%;
            --primary-foreground: 210 40% 98%;
            --secondary: 210 40% 96.1%;
            --secondary-foreground: 222.2 47.4% 11.2%;
            --muted: 210 40% 96.1%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --accent: 210 40% 96.1%;
            --accent-foreground: 222.2 47.4% 11.2%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 210 40% 98%;
            --border: 214.3 31.8% 91.4%;
            --input: 214.3 31.8% 91.4%;
            --ring: 221.2 83.2% 53.3%;
            --radius: 0.5rem;
          }
          .dark {
            --background: 222.2 84% 4.9%;
            --foreground: 210 40% 98%;
            --card: 222.2 84% 4.9%;
            --card-foreground: 210 40% 98%;
            --popover: 222.2 84% 4.9%;
            --popover-foreground: 210 40% 98%;
            --primary: 217.2 91.2% 59.8%;
            --primary-foreground: 222.2 47.4% 11.2%;
            --secondary: 217.2 32.6% 17.5%;
            --secondary-foreground: 210 40% 98%;
            --muted: 217.2 32.6% 17.5%;
            --muted-foreground: 215 20.2% 65.1%;
            --accent: 217.2 32.6% 17.5%;
            --accent-foreground: 210 40% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 210 40% 98%;
            --border: 217.2 32.6% 17.5%;
            --input: 217.2 32.6% 17.5%;
            --ring: 224.3 76.3% 48%;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
} 
