import LogRocket from "logrocket";

// Custom error type for tracking errors
export class TrackingError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "TrackingError";
  }
}

// Type for error context
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
  [key: string]: string | number | boolean | undefined;
}

// Type for action data
export interface ActionData {
  userId?: string;
  timestamp?: string;
  success?: boolean;
  [key: string]: string | number | boolean | undefined;
}

// Type for user traits
export interface UserTraits {
  email?: string;
  name?: string;
  role?: string;
  createdAt?: string;
  [key: string]: string | number | boolean | undefined;
}

// Type for error tracking result
export interface ErrorTrackingResult {
  success: boolean;
  error?: TrackingError;
  message?: string;
}

// Type guard for browser environment
const isBrowser = (): boolean => typeof window !== "undefined";

// Helper function to create tracking error
const createTrackingError = (error: unknown): TrackingError => {
  if (error instanceof Error) {
    return new TrackingError(error.message, error);
  }
  return new TrackingError(String(error), error);
};

// Initialize LogRocket
if (isBrowser() && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
  LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID);
}

// Error tracking utility
export const errorTracking = {
  // Track errors
  trackError: (error: Error, context?: ErrorContext): ErrorTrackingResult => {
    try {
      if (!isBrowser()) {
        return {
          success: false,
          message: "Error tracking is only available in browser environment",
        };
      }

      console.error("Error:", error, context);
      LogRocket.captureException(error, {
        tags: {
          ...context,
          timestamp: new Date().toISOString(),
        },
      });
      return {
        success: true,
        message: "Error tracked successfully",
      };
    } catch (trackingError) {
      console.error("Error tracking failed:", trackingError);
      return {
        success: false,
        error: createTrackingError(trackingError),
        message: "Failed to track error",
      };
    }
  },

  // Track user actions
  trackAction: (action: string, data?: ActionData): ErrorTrackingResult => {
    try {
      if (!isBrowser()) {
        return {
          success: false,
          message: "Action tracking is only available in browser environment",
        };
      }

      LogRocket.track(action, {
        ...data,
        timestamp: new Date().toISOString(),
      });
      return {
        success: true,
        message: "Action tracked successfully",
      };
    } catch (trackingError) {
      console.error("Action tracking failed:", trackingError);
      return {
        success: false,
        error: createTrackingError(trackingError),
        message: "Failed to track action",
      };
    }
  },

  // Identify user
  identifyUser: (userId: string, traits?: UserTraits): ErrorTrackingResult => {
    try {
      if (!isBrowser()) {
        return {
          success: false,
          message:
            "User identification is only available in browser environment",
        };
      }

      LogRocket.identify(userId, {
        ...traits,
        lastSeen: new Date().toISOString(),
      });
      return {
        success: true,
        message: "User identified successfully",
      };
    } catch (trackingError) {
      console.error("User identification failed:", trackingError);
      return {
        success: false,
        error: createTrackingError(trackingError),
        message: "Failed to identify user",
      };
    }
  },
};
