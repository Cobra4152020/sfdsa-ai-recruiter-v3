import { useState, useEffect } from "react";
import { isBrowser } from "@/lib/utils";

export function useClientOnly<T>(callback: () => T, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (isBrowser()) {
      setValue(callback());
    }
  }, [callback]);

  return value;
}

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
