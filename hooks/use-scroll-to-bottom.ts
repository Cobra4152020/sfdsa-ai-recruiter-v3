import { useEffect, RefObject } from "react";

export function useScrollToBottom<
  T extends HTMLElement,
  D extends ReadonlyArray<unknown>,
>(ref: RefObject<T>, dependencies: D) {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [ref, ...dependencies]);
}
