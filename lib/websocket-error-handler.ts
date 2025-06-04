/**
 * WebSocket error handler to prevent excessive console errors from failing WebSocket connections
 */

export function installWebSocketErrorHandler() {
  if (typeof window === "undefined") return;

  // Keep track of WebSocket errors to avoid excessive logging
  const errorTracker = {
    lastErrorTime: 0,
    errorCount: 0,
    suppressedCount: 0,
  };

  // Store the original WebSocket constructor
  const OriginalWebSocket = window.WebSocket;

  // Create a proxy WebSocket constructor
  class EnhancedWebSocket extends OriginalWebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      super(url, protocols);

      // Handle errors more gracefully
      this.addEventListener("error", (event) => {
        const now = Date.now();
        const timeSinceLastError = now - errorTracker.lastErrorTime;
        errorTracker.lastErrorTime = now;

        // If errors are happening in rapid succession (within 1 second),
        // start suppressing the console output
        if (timeSinceLastError < 1000) {
          errorTracker.errorCount++;

          // Only log every 5th error to reduce console spam
          if (errorTracker.errorCount % 5 !== 0) {
            errorTracker.suppressedCount++;

            // Prevent the error from showing in console
            event.stopImmediatePropagation();
            event.preventDefault();

            return;
          }

          // For the 5th, 10th, etc. error, show a summary
          if (errorTracker.suppressedCount > 0) {
            console.warn(
              `WebSocket error: ${errorTracker.suppressedCount} similar errors were suppressed`,
            );
            errorTracker.suppressedCount = 0;
          }
        } else {
          // Reset counter if errors are not in rapid succession
          errorTracker.errorCount = 1;
          errorTracker.suppressedCount = 0;
        }
      });
    }
  }

  // Replace the global WebSocket constructor
  try {
    window.WebSocket = EnhancedWebSocket as typeof WebSocket;
    console.log("WebSocket error handler installed");
  } catch (error) {
    console.error("Failed to install WebSocket error handler:", error);
  }
}
