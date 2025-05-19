import type { ReactNode } from "react";

export default function PlayTheGameLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 