"use client"

import { useEffect, useState } from "react"
import { initErrorMonitoring, getLoggedErrors, clearErrorLog } from "@/lib/error-monitoring"
import { XCircle, AlertTriangle, Clock, RefreshCw, Trash2 } from "lucide-react"

interface ErrorMonitorProps {
  initiallyExpanded?: boolean
}

export function ErrorMonitorClient({ initiallyExpanded = false }: ErrorMonitorProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)
  const [errors, setErrors] = useState<any[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Initialize error monitoring
    initErrorMonitoring()

    // Update errors on custom event
    const handleErrorCaptured = () => {
      setErrors(getLoggedErrors())
    }

    window.addEventListener("error-captured", handleErrorCaptured)

    // Check for console errors every 5 seconds
    const intervalId = setInterval(() => {
      setErrors(getLoggedErrors())
    }, 5000)

    // Clean up
    return () => {
      window.removeEventListener("error-captured", handleErrorCaptured)
      clearInterval(intervalId)
    }
  }, [])

  // Set visibility based on whether there are errors
  useEffect(() => {
    if (errors.length > 0) {
      setIsVisible(true)
    }
  }, [errors])

  if (!isVisible) return null

  const clearErrors = () => {
    clearErrorLog()
    setErrors([])
  }

  const refreshErrors = () => {
    setErrors(getLoggedErrors())
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-900 w-[600px] max-h-[500px] flex flex-col overflow-hidden">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 flex items-center justify-between">
            <div className="flex items-center text-red-800 dark:text-red-300">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Console Error Monitor ({errors.length})</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshErrors}
                className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-800/30 text-red-600 dark:text-red-300"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={clearErrors}
                className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-800/30 text-red-600 dark:text-red-300"
                title="Clear all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-800/30 text-red-600 dark:text-red-300"
                title="Minimize"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-1">
            {errors.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">No errors logged</div>
            ) : (
              <div className="space-y-2 p-2">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20 rounded p-3 text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-red-800 dark:text-red-300 truncate max-w-[400px]">
                        {error.message}
                      </div>
                      <div className="flex items-center text-red-500 dark:text-red-400 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    {error.source && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Source: {error.source}
                        {error.lineNumber && `:${error.lineNumber}`}
                        {error.columnNumber && `:${error.columnNumber}`}
                      </div>
                    )}

                    {error.stack && (
                      <details className="mt-1">
                        <summary className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200">
                          Stack trace
                        </summary>
                        <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full shadow-lg flex items-center"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Console Errors ({errors.length})
        </button>
      )}
    </div>
  )
}
