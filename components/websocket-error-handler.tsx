"use client"

import { useEffect } from "react"
import { installWebSocketErrorHandler } from "@/lib/websocket-error-handler"

export function WebSocketErrorHandler() {
  useEffect(() => {
    installWebSocketErrorHandler()
  }, [])

  return null
}
