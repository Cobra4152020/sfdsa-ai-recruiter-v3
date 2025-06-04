"use client";

import { useEffect } from "react";
import { installWebSocketErrorHandler } from "@/lib/websocket-error-handler";

export function WebSocketErrorHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    installWebSocketErrorHandler();
  }, []);

  return <>{children}</>;
}
