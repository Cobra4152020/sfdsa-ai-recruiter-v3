import { useEffect, RefObject } from "react"

export function useScrollToBottom<T extends HTMLElement>(
  ref: RefObject<T>,
  dependencies: any[]
) {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [ref, ...dependencies])
} 