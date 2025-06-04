import { getBaseUrl } from "./url-utils";

// Extract domain from the full URL
const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    return url;
  }
};

/**
 * Get the window origin (protocol + hostname + port) safely
 * @returns {string} The window origin or empty string if not in browser
 */
export function getWindowOrigin(): string {
  if (typeof window !== "undefined" && window.location) {
    return window.location.origin;
  }
  return getBaseUrl();
}

export const PRIMARY_DOMAIN = extractDomain(getBaseUrl());
