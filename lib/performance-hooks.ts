"use client";

import { useEffect, useRef } from "react";
import { trackCustomPerformance } from "./performance-monitoring";

// Hook to track component render time
export function useRenderPerformance(componentName: string) {
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Track when component is mounted
    const mountTime = performance.now() - startTimeRef.current;
    trackCustomPerformance(`${componentName}-mount`, mountTime);

    // Track when component is unmounted
    return () => {
      trackCustomPerformance(`${componentName}-unmount`, performance.now());
    };
  }, [componentName]);

  // Set start time when component is first rendered
  if (startTimeRef.current === 0) {
    startTimeRef.current = performance.now();
  }
}

// Hook to track data fetching performance
export function useFetchPerformance<T>(
  fetchFn: () => Promise<T>,
  options: {
    name: string;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
  },
) {
  const { name, enabled = true, onSuccess, onError } = options;

  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();

    fetchFn()
      .then((data) => {
        const endTime = performance.now();
        trackCustomPerformance(`fetch-${name}`, endTime - startTime);
        onSuccess?.(data);
      })
      .catch((error) => {
        const endTime = performance.now();
        trackCustomPerformance(`fetch-error-${name}`, endTime - startTime);
        onError?.(error);
      });
  }, [fetchFn, name, enabled, onSuccess, onError]);
}

// Hook to track interaction performance
export function useInteractionPerformance() {
  return (interactionName: string) => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      trackCustomPerformance(
        `interaction-${interactionName}`,
        endTime - startTime,
      );
    };
  };
}
