"use client"

import { useState, useEffect } from "react"

/**
 * Hook to detect if the current viewport is mobile
 * @param breakpoint The width threshold in pixels to consider as mobile (default: 768)
 * @returns boolean indicating if the current viewport is mobile
 */
export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if window width is less than breakpoint
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check on mount
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", checkMobile)
  }, [breakpoint])

  return isMobile
}
