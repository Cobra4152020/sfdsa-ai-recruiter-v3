"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function PerformanceMonitor() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Only run performance monitoring if enabled
    if (process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== "true") {
      return
    }

    try {
      // Record page view timing
      const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const pageLoadTime = navigationTiming ? navigationTiming.loadEventEnd - navigationTiming.startTime : null

      // Only send metrics if we have valid timing data
      if (pageLoadTime && pageLoadTime > 0) {
        // Send performance data to API
        fetch("/api/performance/metrics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
            loadTime: pageLoadTime,
            timestamp: new Date().toISOString(),
          }),
          // Use keepalive to ensure the request completes even if the page is unloaded
          keepalive: true,
        }).catch((error) => {
          console.error("Failed to send performance metrics:", error)
        })
      }
    } catch (error) {
      console.error("Error in performance monitoring:", error)
    }
  }, [pathname])

  // Don't render anything visible
  return null
}
