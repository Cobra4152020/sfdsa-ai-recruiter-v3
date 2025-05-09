import type React from "react"
import { HeaderWrapper } from "@/components/header-wrapper"
import { ImprovedFooter } from "@/components/improved-footer"

export default function LayoutWithNavigation({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HeaderWrapper />
      <main className="min-h-screen pt-20 pb-16">{children}</main>
      <ImprovedFooter />
    </>
  )
}
