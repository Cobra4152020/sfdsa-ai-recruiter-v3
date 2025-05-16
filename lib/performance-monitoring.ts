import type { Metric } from "web-vitals"

// Types for performance metrics
export type PerformanceMetric = {
  name: string
  value: number
  rating: "good" | "needs-improvement" | "poor"
  navigationType?: string
  id?: string
  path?: string
  userAgent?: string
  timestamp: number
}

export type WebVitalsMetric = Metric

// Function to determine performance rating based on metric thresholds
export function getRating(name: string, value: number): "good" | "needs-improvement" | "poor" {
  switch (name) {
    case "CLS":
      return value <= 0.1 ? "good" : value <= 0.25 ? "needs-improvement" : "poor"
    case "FCP":
      return value <= 1800 ? "good" : value <= 3000 ? "needs-improvement" : "poor"
    case "FID":
      return value <= 100 ? "good" : value <= 300 ? "needs-improvement" : "poor"
    case "LCP":
      return value <= 2500 ? "good" : value <= 4000 ? "needs-improvement" : "poor"
    case "TTFB":
      return value <= 800 ? "good" : value <= 1800 ? "needs-improvement" : "poor"
    case "INP":
      return value <= 200 ? "good" : value <= 500 ? "needs-improvement" : "poor"
    default:
      return "needs-improvement"
  }
}

// Function to report performance metrics to our API
export async function reportPerformanceMetric(metric: PerformanceMetric): Promise<void> {
  // Don't attempt to report metrics during SSR
  if (typeof window === "undefined") return

  try {
    // Check if performance monitoring is enabled
    const isEnabled =
      process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true"

    if (!isEnabled) {
      // Just log to console in development when not explicitly enabled
      console.log("Performance metric (dev mode):", {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        path: metric.path,
      })
      return
    }

    // Add user agent if not provided
    if (!metric.userAgent && typeof navigator !== "undefined") {
      metric.userAgent = navigator.userAgent
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    try {
      const response = await fetch("/api/performance/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metric),
        // Use keepalive to ensure the request completes even if the page is unloading
        keepalive: true,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        // Don't log RLS errors as they're expected with anonymous users
        if (!errorText.includes("violates row-level security policy")) {
          console.warn(`Performance metric reporting failed (${response.status}): ${errorText}`)
        }
        // Still log the metric to console as fallback
        logMetricToConsole(metric)
      }
    } catch (fetchError) {
      // Don't log AbortError as it's expected when the request times out
      if (fetchError instanceof Error && fetchError.name !== "AbortError") {
        console.warn("Error reporting performance metric:", fetchError)
      }
      // Log the metric to console as fallback
      logMetricToConsole(metric)
    }
  } catch (error) {
    // Catch any other errors that might occur
    console.warn("Unexpected error in performance monitoring:", error)
    // Log the metric to console as fallback
    logMetricToConsole(metric)
  }
}

// Helper function to log metrics to console
function logMetricToConsole(metric: PerformanceMetric): void {
  console.log("Performance metric (fallback):", {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    path: metric.path,
  })
}

// Function to track custom performance metrics
export function trackCustomPerformance(name: string, startTime: number): void {
  const endTime = performance.now()
  const duration = endTime - startTime

  const metric: PerformanceMetric = {
    name,
    value: duration,
    rating: "good", // Custom metrics don't have standard ratings
    path: typeof window !== "undefined" ? window.location.pathname : undefined,
    timestamp: Date.now(),
  }

  reportPerformanceMetric(metric)
}

// Function to track resource loading performance
export function trackResourcePerformance(): void {
  if (typeof window === "undefined" || !window.performance || !window.performance.getEntriesByType) {
    return
  }

  try {
    // Get all resource timing entries
    const resources = window.performance.getEntriesByType("resource")

    // Group resources by type
    const resourcesByType: Record<string, number[]> = {}

    resources.forEach((resource) => {
      const entry = resource as PerformanceResourceTiming
      const fileExtension = entry.name.split(".").pop()?.split("?")[0] || "unknown"

      if (!resourcesByType[fileExtension]) {
        resourcesByType[fileExtension] = []
      }

      resourcesByType[fileExtension].push(entry.duration)
    })

    // Report average load time for each resource type
    Object.entries(resourcesByType).forEach(([type, durations]) => {
      const avgDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length

      const metric: PerformanceMetric = {
        name: `resource-${type}`,
        value: avgDuration,
        rating: "good", // Custom metrics don't have standard ratings
        path: window.location.pathname,
        timestamp: Date.now(),
      }

      reportPerformanceMetric(metric)
    })
  } catch (error) {
    console.warn("Error tracking resource performance:", error)
  }
}

// Function to track memory usage
export function trackMemoryUsage(): void {
  if (typeof window === "undefined" || !("memory" in window.performance)) {
    return
  }

  try {
    // TypeScript doesn't know about the memory property by default
    const memory = (window.performance as any).memory

    if (memory) {
      const usedHeapSize = memory.usedJSHeapSize
      const totalHeapSize = memory.totalJSHeapSize
      const heapLimit = memory.jsHeapSizeLimit

      const heapUsagePercent = (usedHeapSize / heapLimit) * 100

      const metric: PerformanceMetric = {
        name: "memory-usage",
        value: heapUsagePercent,
        rating: heapUsagePercent <= 50 ? "good" : heapUsagePercent <= 80 ? "needs-improvement" : "poor",
        path: window.location.pathname,
        timestamp: Date.now(),
      }

      reportPerformanceMetric(metric)
    }
  } catch (error) {
    console.warn("Error tracking memory usage:", error)
  }
}
