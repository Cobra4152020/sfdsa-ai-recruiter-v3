import { useEffect, RefObject } from "react";

export function useScrollToBottom<
  T extends HTMLElement,
  D extends ReadonlyArray<unknown>,
>(ref: RefObject<T>, dependencies: D) {
  useEffect(() => {
    if (ref.current) {
      // Use smooth scrolling with a slight delay to give users time to read
      setTimeout(() => {
        ref.current?.scrollTo({
          top: ref.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 500); // 500ms delay before scrolling
    }
  }, [ref, ...dependencies]);
}
