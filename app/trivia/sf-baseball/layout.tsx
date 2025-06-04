import type { ReactNode } from "react";

export default function TriviaSfBaseballLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
