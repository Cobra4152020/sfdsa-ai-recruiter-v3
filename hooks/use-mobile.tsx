"use client"

import { useState, useEffect, useCallback } from "react"
import { useClientOnly } from "@/hooks/use-client-only"
import { getWindowDimensions, isBrowser } from "@/lib/utils"

/**
 * Hook to detect if the current viewport is mobile
 * @param breakpoint The width threshold in pixels to consider as mobile (default: 768)
 * @returns boolean indicating if the current viewport is mobile
 */
export function useMobile(breakpoint = 768) {
  const memoizedGetWindowDimensions = useCallback(() => getWindowDimensions(), [])
  const { innerWidth } = useClientOnly(memoizedGetWindowDimensions, { scrollY: 0, width: 0, height: 0, innerWidth: 0, innerHeight: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!isBrowser()) return

    // Function to check if window width is less than breakpoint
    const checkMobile = () => {
      setIsMobile(innerWidth < breakpoint)
    }

    // Check on mount and when innerWidth changes
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", checkMobile)
  }, [breakpoint, innerWidth])

  return isMobile
}
