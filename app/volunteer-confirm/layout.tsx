import type { ReactNode } from "react";

export default function VolunteerConfirmLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 