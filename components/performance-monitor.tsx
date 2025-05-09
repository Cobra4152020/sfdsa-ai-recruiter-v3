"use client"

import { useEffect } from "react"
import { reportPerformanceMetric, getRating } from "@/lib/performance-monitoring"

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in the browser
    if (typeof window === "undefined") return

    // Only run in production or when explicitly enabled
    const isEnabled =
      process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true"

    if (!isEnabled) return

    // Function to report web vitals
    const reportWebVitals = async () => {
      try {
        // Dynamically import web-vitals to reduce bundle size
        const webVitals = await import("web-vitals")

        // Report Core Web Vitals
        webVitals.onCLS((metric) => {
          try {
            reportPerformanceMetric({
              name: "CLS",
              value: metric.value,
              rating: getRating("CLS", metric.value),
              navigationType: metric.navigationType,
              id: metric.id,
              path: window.location.pathname,
              timestamp: Date.now(),
            })
          } catch (error) {
            console.warn("Error reporting CLS:", error)
          }
        })

        webVitals.onFCP((metric) => {
          try {
            reportPerformanceMetric({
              name: "FCP",
              value: metric.value,
              rating: getRating("FCP", metric.value),
              navigationType: metric.navigationType,
              id: metric.id,
              path: window.location.pathname,
              timestamp: Date.now(),
            })
          } catch (error) {
            console.warn("Error reporting FCP:", error)
          }
        })

        webVitals.onLCP((metric) => {
          try {
            reportPerformanceMetric({
              name: "LCP",
              value: metric.value,
              rating: getRating("LCP", metric.value),
              navigationType: metric.navigationType,
              id: metric.id,
              path: window.location.pathname,
              timestamp: Date.now(),
            })
          } catch (error) {
            console.warn("Error reporting LCP:", error)
          }
        })

        webVitals.onTTFB((metric) => {
          try {
            reportPerformanceMetric({
              name: "TTFB",
              value: metric.value,
              rating: getRating("TTFB", metric.value),
              navigationType: metric.navigationType,
              id: metric.id,
              path: window.location.pathname,
              timestamp: Date.now(),
            })
          } catch (error) {
            console.warn("Error reporting TTFB:", error)
          }
        })

        // Try to report FID, but it might not be available in all browsers
        try {
          if (typeof webVitals.onFID === "function") {
            webVitals.onFID((metric) => {
              try {
                reportPerformanceMetric({
                  name: "FID",
                  value: metric.value,
                  rating: getRating("FID", metric.value),
                  navigationType: metric.navigationType,
                  id: metric.id,
                  path: window.location.pathname,
                  timestamp: Date.now(),
                })
              } catch (error) {
                console.warn("Error reporting FID:", error)
              }
            })
          }
        } catch (error) {
          console.warn("FID measurement not available:", error)
        }

        // Try to report INP, but it might not be available in all browsers
        try {
          if (typeof webVitals.onINP === "function") {
            webVitals.onINP((metric) => {
              try {
                reportPerformanceMetric({
                  name: "INP",
                  value: metric.value,
                  rating: getRating("INP", metric.value),
                  navigationType: metric.navigationType,
                  id: metric.id,
                  path: window.location.pathname,
                  timestamp: Date.now(),
                })
              } catch (error) {
                console.warn("Error reporting INP:", error)
              }
            })
          }
        } catch (error) {
          console.warn("INP measurement not available:", error)
        }
      } catch (error) {
        console.warn("Error loading web-vitals:", error)
      }
    }

    // Report web vitals
    reportWebVitals()

    // Clean up function
    return () => {
      // No cleanup needed
    }
  }, [])

  // This component doesn't render anything
  return null
}
