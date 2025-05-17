import type React from "react"
import type { Metadata } from "next"
import MainLayoutClient from "@/components/MainLayoutClient"

export const metadata: Metadata = {
  title: "Donate | SF Deputy Sheriff Recruitment",
  description:
    "Support the San Francisco Deputy Sheriffs' Association recruitment initiatives through your generous donations.",
}

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayoutClient>{children}</MainLayoutClient>
}
