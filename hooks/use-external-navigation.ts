"use client";

import { useRouter } from "next/navigation";
import { isBrowser } from "@/lib/utils";

export function useExternalNavigation() {
  const router = useRouter();

  const navigateTo = (url: string) => {
    if (!url) return;

    // Check if URL is external
    const isExternal = url.startsWith("http") || url.startsWith("https");

    if (isExternal) {
      // For external URLs, use window.location.href
      if (isBrowser()) {
        window.location.href = url;
      }
    } else {
      // For internal routes, use Next.js router
      router.push(url);
    }
  };

  return { navigateTo };
}
