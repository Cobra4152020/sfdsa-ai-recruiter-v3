import type React from "react"
import { PageWrapper } from "@/components/page-wrapper"

export default function LayoutWithNavigation({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PageWrapper>
      <main className="min-h-screen pt-20 pb-16">{children}</main>
    </PageWrapper>
  )
}
