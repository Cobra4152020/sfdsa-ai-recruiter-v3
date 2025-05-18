import type React from "react"

export default function LayoutWithNavigation({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen pt-20 pb-16">{children}</main>
  )
}
