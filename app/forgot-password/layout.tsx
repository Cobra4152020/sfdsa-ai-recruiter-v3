import type { ReactNode } from "react";

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 