import LogRocket from 'logrocket'

// Initialize LogRocket
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
  LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID)
}

// Error tracking utility
export const errorTracking = {
  // Track errors
  trackError: (error: Error, context?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      console.error('Error:', error, context)
      LogRocket.captureException(error, {
        tags: context,
      })
    }
  },

  // Track user actions
  trackAction: (action: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      LogRocket.track(action, data)
    }
  },

  // Identify user
  identifyUser: (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      LogRocket.identify(userId, traits)
    }
  },
} 