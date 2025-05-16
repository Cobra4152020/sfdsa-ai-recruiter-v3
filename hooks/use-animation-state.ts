"use client"

import { useState, useEffect } from "react"

type AnimationState = "closed" | "opening" | "open" | "closing"

export function useAnimationState(initialState = false, duration = 200) {
  const [isOpen, setIsOpen] = useState(initialState)
  const [animationState, setAnimationState] = useState<AnimationState>(initialState ? "open" : "closed")

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isOpen && animationState === "closed") {
      setAnimationState("opening")
      timer = setTimeout(() => setAnimationState("open"), 10) // Small delay to trigger animation
    } else if (!isOpen && animationState === "open") {
      setAnimationState("closing")
      timer = setTimeout(() => setAnimationState("closed"), duration)
    }

    return () => clearTimeout(timer)
  }, [isOpen, animationState, duration])

  const toggle = () => setIsOpen((prev) => !prev)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    isOpen,
    animationState,
    toggle,
    open,
    close,
    isAnimating: animationState === "opening" || animationState === "closing",
    isVisible: animationState !== "closed",
  }
}
