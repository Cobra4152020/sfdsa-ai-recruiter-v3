import type React from "react"
import type { Metadata } from "next"
import MainLayoutClient from "./MainLayoutClient"

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

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <MainLayoutClient>{children}</MainLayoutClient>
}
