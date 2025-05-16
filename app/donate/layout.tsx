import type React from "react"
import type { Metadata } from "next"
import MainLayoutClient from "../(main)/MainLayoutClient"

export const metadata: Metadata = {
  title: "Donate | SF Deputy Sheriff Recruitment",
  description: "Support the San Francisco Deputy Sheriff recruitment efforts through your donation.",
}

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayoutClient>{children}</MainLayoutClient>
}
