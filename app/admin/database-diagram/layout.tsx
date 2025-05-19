import type { ReactNode } from "react";

export default function AdminDatabaseDiagramLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 