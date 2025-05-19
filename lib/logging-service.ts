/**
 * Enhanced logging service for the application
 * Provides structured logging with context and severity levels
 */

type LogLevel = "debug" | "info" | "warn" | "error" | "critical"

interface LogContext {
  component?: string
  action?: string
  userId?: string
  requestId?: string
  [key: string]: any
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context: LogContext
  error?: any
}

// Configure log destinations
const LOG_TO_CONSOLE = true
const LOG_TO_DATABASE = process.env.NODE_ENV === "production"

/**
 * Log a message with the specified severity level and context
 */
export function log(level: LogLevel, message: string, context: LogContext = {}, error?: any) {
  const timestamp = new Date().toISOString()

  const entry: LogEntry = {
    timestamp,
    level,
    message,
    context,
    ...(error && { error: formatError(error) }),
  }

  // Log to console in development or if configured
  if (LOG_TO_CONSOLE) {
    logToConsole(entry)
  }

  // Log to database in production
  if (LOG_TO_DATABASE) {
    logToDatabase(entry).catch((err) => {
      console.error("Failed to write log to database:", err)
    })
  }

  return entry
}

/**
 * Format error objects for logging
 */
function formatError(error: any): any {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause ? formatError(error.cause) : undefined,
    }
  }

  return error
}

/**
 * Log to console with appropriate formatting and colors
 */
function logToConsole(entry: LogEntry) {
  const { timestamp, level, message, context, error } = entry

  // Color coding for different log levels
  const colors = {
    debug: "\x1b[34m", // Blue
    info: "\x1b[32m", // Green
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    critical: "\x1b[41m\x1b[37m", // White on Red background
    reset: "\x1b[0m",
  }

  const color = colors[level] || colors.reset

  // Format the log message
  console.log(`${color}[${timestamp}] [${level.toUpperCase()}]${colors.reset} ${message}`)

  // Log context if present
  if (Object.keys(context).length > 0) {
    console.log("Context:", context)
  }

  // Log error details if present
  if (error) {
    if (level === "error" || level === "critical") {
      console.error("Error details:", error)
    } else {
      console.log("Error details:", error)
    }
  }
}

/**
 * Log to database for persistence and analysis
 */
async function logToDatabase(entry: LogEntry) {
  try {
    // Import dynamically to avoid circular dependencies
    const { getServiceSupabase } = await import("@/app/lib/supabase/server")
    const supabase = getServiceSupabase()

    // Store log in the database
    const { error } = await supabase.from("system_logs").insert({
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
      context: entry.context,
      error_details: entry.error ? JSON.stringify(entry.error) : null,
    })

    if (error) {
      console.error("Failed to write log to database:", error)
    }
  } catch (err) {
    console.error("Error in logToDatabase:", err)
  }
}

// Convenience methods for different log levels
export const debug = (message: string, context: LogContext = {}, error?: any) => log("debug", message, context, error)

export const info = (message: string, context: LogContext = {}, error?: any) => log("info", message, context, error)

export const warn = (message: string, context: LogContext = {}, error?: any) => log("warn", message, context, error)

export const error = (message: string, context: LogContext = {}, error?: any) => log("error", message, context, error)

export const critical = (message: string, context: LogContext = {}, error?: any) =>
  log("critical", message, context, error)
