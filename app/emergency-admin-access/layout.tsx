import type { ReactNode } from "react";

export default function EmergencyAdminAccessLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 