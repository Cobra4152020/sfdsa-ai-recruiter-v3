"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the client component to avoid SSR issues
const ErrorMonitorClient = dynamic(
  () => import("./error-monitor-client").then((mod) => mod.ErrorMonitorClient),
  {
    ssr: false,
  },
);

export function ErrorMonitor({ children }: { children: React.ReactNode }) {
  // Only render in development or when explicitly enabled
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if we should render the monitor
    const isDev = process.env.NODE_ENV === "development";
    const isEnabled = localStorage.getItem("enableErrorMonitor") === "true";

    setShouldRender(isDev || isEnabled);

    // Add a secret key command to toggle the monitor
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+E to toggle the error monitor
      if (e.ctrlKey && e.shiftKey && e.key === "E") {
        const newValue = localStorage.getItem("enableErrorMonitor") !== "true";
        localStorage.setItem("enableErrorMonitor", newValue.toString());
        setShouldRender(newValue);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!shouldRender) return <>{children}</>;

  return (
    <>
      <ErrorMonitorClient />
      {children}
    </>
  );
}
