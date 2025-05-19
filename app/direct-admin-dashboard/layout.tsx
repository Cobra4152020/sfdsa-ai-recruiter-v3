import type { ReactNode } from "react";

export default function DirectAdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 