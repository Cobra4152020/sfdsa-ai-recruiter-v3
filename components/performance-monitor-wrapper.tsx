"use client"

import { useEffect } from "react"
import PerformanceMonitor from "@/components/performance-monitor"
import { createPerformanceMetricsTable } from "@/lib/database-setup"

export default function PerformanceMonitorWrapper() {
  useEffect(() => {
    // Initialize performance monitoring on the client side
    if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true") {
      try {
        createPerformanceMetricsTable().catch((error) => {
          console.error("Failed to create performance metrics table:", error)
        })
      } catch (error) {
        console.error("Error initializing performance monitoring:", error)
      }
    }
  }, [])

  // Only render the performance monitor if enabled
  if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true") {
    return <PerformanceMonitor />
  }

  return null
}
