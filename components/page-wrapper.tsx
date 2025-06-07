"use client";

import type React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main id="main-content" className="flex-1 pt-16 pb-12 bg-white dark:bg-black">
      {children}
    </main>
  );
}
