import type React from "react"
import { AdminAuthCheck } from "@/components/admin/admin-auth-check"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if the current path is /admin/login
  const isAdminLoginPage = typeof window !== "undefined" && window.location.pathname === "/admin/login"

  // Only apply AdminAuthCheck if not on the login page
  return isAdminLoginPage ? children : <AdminAuthCheck>{children}</AdminAuthCheck>
}
