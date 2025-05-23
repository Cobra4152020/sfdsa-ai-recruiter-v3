"use client"

import { Component, type ReactNode } from "react"
import { errorTracking } from "@/lib/error-tracking"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorTracking.trackError(error, {
      componentStack: errorInfo.componentStack,
      location: "ErrorBoundary",
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We've been notified and are working on fixing the issue.</p>
            <button
              onClick={() => {
                errorTracking.trackAction("Error boundary retry clicked", {
                  location: "ErrorBoundary",
                })
                this.setState({ hasError: false, error: null })
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
