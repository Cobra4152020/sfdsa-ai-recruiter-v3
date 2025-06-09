import { useEffect, RefObject } from "react";

export function useScrollToBottom<T extends HTMLElement>(
  ref: RefObject<T>, 
  messages: any[]
) {
  useEffect(() => {
    if (ref.current && messages.length > 0) {
      // Use smooth scrolling with a slight delay to give users time to read
      setTimeout(() => {
        ref.current?.scrollTo({
          top: ref.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 500); // 500ms delay before scrolling
    }
  }, [ref, messages.length]); // Only depend on messages.length, not the entire array
}
