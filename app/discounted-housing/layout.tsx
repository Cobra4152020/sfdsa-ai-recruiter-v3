import type React from "react"
import type { Metadata } from "next"
import MainLayoutClient from "../(main)/MainLayoutClient"

export const metadata: Metadata = {
  title: "Discounted Housing | SF Deputy Sheriff Recruitment",
  description: "Learn about special housing programs and discounts available to San Francisco Deputy Sheriffs.",
}

export default function DiscountedHousingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayoutClient>{children}</MainLayoutClient>
}
