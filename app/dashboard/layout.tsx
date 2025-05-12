import type React from "react"
import { RecruitAuthCheck } from "@/components/recruit/recruit-auth-check"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RecruitAuthCheck>{children}</RecruitAuthCheck>
}
