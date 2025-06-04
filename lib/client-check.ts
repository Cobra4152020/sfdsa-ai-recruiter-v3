/**
 * Client-side environment checks
 */

/**
 * Check if the code is running in a browser environment
 * @returns {boolean} True if running in browser, false if in Node.js/SSR
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Check if the code is running in a server environment
 * @returns {boolean} True if running in Node.js/SSR, false if in browser
 */
export function isServer(): boolean {
  return !isBrowser();
}

/**
 * Safe way to access window object
 * @returns {Window | undefined} Window object if in browser, undefined if on server
 */
export function getWindow(): Window | undefined {
  return isBrowser() ? window : undefined;
}

/**
 * Safe way to access document object
 * @returns {Document | undefined} Document object if in browser, undefined if on server
 */
export function getDocument(): Document | undefined {
  return isBrowser() ? document : undefined;
}
