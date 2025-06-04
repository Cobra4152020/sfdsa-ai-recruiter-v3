"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import AdminAuthCheck from "@/components/admin/admin-auth-check";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminLoginPage = pathname === "/admin/login";

  // Only apply AdminAuthCheck if not on the login page
  return isAdminLoginPage ? (
    children
  ) : (
    <AdminAuthCheck>{children}</AdminAuthCheck>
  );
}
