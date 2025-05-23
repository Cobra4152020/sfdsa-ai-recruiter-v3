"use client"

import { useState, useEffect, useCallback } from "react"
import { useClientOnly } from "@/hooks/use-client-only"
import { getWindowDimensions, isBrowser } from "@/lib/utils"

export function useScrollPosition() {
  const memoizedGetWindowDimensions = useCallback(() => getWindowDimensions(), [])
  const { scrollY } = useClientOnly(memoizedGetWindowDimensions, { scrollY: 0, width: 0, height: 0, innerWidth: 0, innerHeight: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    if (!isBrowser()) return

    const updatePosition = () => {
      setScrollPosition(window.pageYOffset)
    }

    window.addEventListener("scroll", updatePosition)
    updatePosition()

    return () => window.removeEventListener("scroll", updatePosition)
  }, [])

  return scrollY
}
