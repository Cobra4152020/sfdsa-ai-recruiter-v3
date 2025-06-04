/**
 * Error monitoring utility to help track and debug client-side errors
 */

// Configure options
const ERROR_LOGGING_ENABLED = true;
const ERROR_SAMPLING_RATE = 1.0; // 1.0 = 100% of errors are logged
const MAX_ERRORS_STORED = 50;

// Types
export interface ErrorRecord {
  timestamp: string;
  message: string;
  source?: string;
  lineNumber?: number;
  columnNumber?: number;
  stack?: string;
  componentName?: string;
  url: string;
  userAgent: string;
}

// Storage for errors in memory (for the current session)
let errorStore: ErrorRecord[] = [];

/**
 * Initialize error monitoring
 */
export function initErrorMonitoring() {
  if (typeof window === "undefined" || !ERROR_LOGGING_ENABLED) return;

  // Save original console.error
  const originalConsoleError = console.error;

  // Override console.error to capture errors
  console.error = (...args) => {
    // Call original console.error
    originalConsoleError.apply(console, args);

    // Log error for monitoring
    try {
      const errorMessage = args
        .map((arg) =>
          typeof arg === "string"
            ? arg
            : arg instanceof Error
              ? arg.message
              : JSON.stringify(arg),
        )
        .join(" ");

      captureError({
        message: errorMessage,
        stack: args.find((arg) => arg instanceof Error)?.stack,
      });
    } catch (e) {
      // Don't let our error monitoring break the application
      originalConsoleError("Error in error monitoring:", e);
    }
  };

  // Capture unhandled errors
  window.addEventListener("error", (event) => {
    captureError({
      message: event.message,
      source: event.filename,
      lineNumber: event.lineno,
      columnNumber: event.colno,
      stack: event.error?.stack,
    });

    // Don't prevent default error handling
    return false;
  });

  // Capture unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    captureError({
      message: `Unhandled Promise Rejection: ${event.reason?.message || "Unknown error"}`,
      stack: event.reason?.stack,
    });
  });

  console.log("Error monitoring initialized");
}

/**
 * Capture an error for monitoring
 */
export function captureError(errorData: Partial<ErrorRecord>) {
  if (!ERROR_LOGGING_ENABLED) return;

  // Apply sampling rate
  if (Math.random() > ERROR_SAMPLING_RATE) return;

  try {
    const errorRecord: ErrorRecord = {
      timestamp: new Date().toISOString(),
      message: errorData.message || "Unknown error",
      source: errorData.source,
      lineNumber: errorData.lineNumber,
      columnNumber: errorData.columnNumber,
      stack: errorData.stack,
      componentName: errorData.componentName,
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };

    // Add to in-memory store
    errorStore = [errorRecord, ...errorStore].slice(0, MAX_ERRORS_STORED);

    // Dispatch custom event for real-time monitoring
    if (typeof window !== "undefined") {
      const event = new CustomEvent("error-captured", { detail: errorRecord });
      window.dispatchEvent(event);
    }

    // Optionally send to backend or analytics service
    // This is where you'd call your API to log the error
  } catch (e) {
    // Fail silently to avoid infinite loops
    console.log("Failed to capture error:", e);
  }
}

/**
 * Get all logged errors
 */
export function getLoggedErrors(): ErrorRecord[] {
  return [...errorStore];
}

/**
 * Clear error log
 */
export function clearErrorLog() {
  errorStore = [];
}

/**
 * Log an error from anywhere in the application
 */
export function logError(
  message: string,
  error?: Error,
  componentName?: string,
) {
  captureError({
    message,
    stack: error?.stack,
    componentName,
  });
}
