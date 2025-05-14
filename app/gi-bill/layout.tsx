import type React from "react"
import type { Metadata } from "next"
import MainLayoutClient from "../(main)/MainLayoutClient"

export const metadata: Metadata = {
  title: "G.I. Bill Benefits | SF Deputy Sheriff Recruitment",
  description:
    "Learn how to use your G.I. Bill benefits to fund your training and education as a San Francisco Deputy Sheriff.",
}

export default function GIBillLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayoutClient>{children}</MainLayoutClient>
}
