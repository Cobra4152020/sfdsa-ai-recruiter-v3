"use client";

import { useEffect, useState } from "react";
import {
  initErrorMonitoring,
  getLoggedErrors,
  clearErrorLog,
  type ErrorRecord,
} from "@/lib/error-monitoring";
import { XCircle, AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

interface ErrorMonitorProps {
  initiallyExpanded?: boolean;
}

export function ErrorMonitorClient({
  initiallyExpanded = false,
}: ErrorMonitorProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [errors, setErrors] = useState<ErrorRecord[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initialize error monitoring
    initErrorMonitoring();

    // Update errors on custom event
    const handleErrorCaptured = () => {
      setErrors(getLoggedErrors());
    };

    window.addEventListener("error-captured", handleErrorCaptured);

    // Check for console errors every 5 seconds
    const intervalId = setInterval(() => {
      setErrors(getLoggedErrors());
    }, 5000);

    // Clean up
    return () => {
      window.removeEventListener("error-captured", handleErrorCaptured);
      clearInterval(intervalId);
    };
  }, []);

  // Set visibility based on whether there are errors
  useEffect(() => {
    if (errors.length > 0) {
      setIsVisible(true);
    }
  }, [errors]);

  if (!isVisible) return null;

  const clearErrors = () => {
    clearErrorLog();
    setErrors([]);
  };

  const refreshErrors = () => {
    setErrors(getLoggedErrors());
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-900/50 w-[600px] max-h-[500px] flex flex-col overflow-hidden">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 flex items-center justify-between">
            <div className="flex items-center text-red-800 dark:text-red-300">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <h3 className="font-medium">
                Console Error Monitor ({errors.length})
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshErrors}
                className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-800/30 text-red-600 dark:text-red-300 transition-colors duration-200"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={clearErrors}
                className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-800/30 text-red-600 dark:text-red-300 transition-colors duration-200"
                title="Clear all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-800/30 text-red-600 dark:text-red-300 transition-colors duration-200"
                title="Minimize"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {errors.map((error, index) => (
              <div
                key={index}
                className="bg-red-50 dark:bg-red-900/20 rounded-md p-3 text-sm border border-red-100 dark:border-red-900/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-700 dark:text-red-300 font-medium">
                    {error.message}
                  </span>
                  <span className="text-red-500 dark:text-red-400 text-xs">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {error.stack && (
                  <pre className="text-xs text-red-600 dark:text-red-400 mt-2 whitespace-pre-wrap font-mono">
                    {error.stack}
                  </pre>
                )}
              </div>
            ))}
            {errors.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No errors to display
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 rounded-full shadow-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors duration-200"
          title="Show error monitor"
        >
          <AlertTriangle className="h-5 w-5" />
          {errors.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white dark:bg-red-400 dark:text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {errors.length}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
