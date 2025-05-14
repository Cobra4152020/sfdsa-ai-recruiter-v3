import { v4 as uuidv4 } from "uuid"
import { reportPerformanceMetric } from "./performance-monitoring"

// Types for journey tracking
export type JourneyStep = {
  journeyId: string
  journeyName: string
  stepName: string
  stepNumber: number
  timestamp: number
  duration?: number
  metrics?: Record<string, number>
  userId?: string
  sessionId: string
  previousStep?: string
  metadata?: Record<string, any>
}

export type Journey = {
  id: string
  name: string
  startTime: number
  endTime?: number
  steps: JourneyStep[]
  completed: boolean
  userId?: string
  sessionId: string
  metadata?: Record<string, any>
}

// In-memory storage for active journeys (will be lost on page refresh)
const activeJourneys: Record<string, Journey> = {}

// Session ID management
let currentSessionId = ""

export function getSessionId(): string {
  if (typeof window === "undefined") return ""

  if (!currentSessionId) {
    // Try to get from sessionStorage
    const storedSessionId = sessionStorage.getItem("performance_session_id")

    if (storedSessionId) {
      currentSessionId = storedSessionId
    } else {
      // Create new session ID
      currentSessionId = uuidv4()
      sessionStorage.setItem("performance_session_id", currentSessionId)
    }
  }

  return currentSessionId
}

// Start a new user journey
export function startJourney(journeyName: string, metadata: Record<string, any> = {}): string {
  const journeyId = uuidv4()
  const sessionId = getSessionId()
  const userId = getUserId()

  const journey: Journey = {
    id: journeyId,
    name: journeyName,
    startTime: performance.now(),
    steps: [],
    completed: false,
    userId,
    sessionId,
    metadata,
  }

  activeJourneys[journeyId] = journey

  // Report journey start
  reportPerformanceMetric({
    name: `journey-${journeyName}-start`,
    value: 0, // No duration yet
    rating: "good",
    path: window.location.pathname,
    timestamp: Date.now(),
    metadata: {
      journeyId,
      sessionId,
      userId,
    },
  })

  return journeyId
}

// Record a step in the journey
export function recordJourneyStep(
  journeyId: string,
  stepName: string,
  metrics: Record<string, number> = {},
  metadata: Record<string, any> = {},
): void {
  const journey = activeJourneys[journeyId]

  if (!journey) {
    console.warn(`Journey with ID ${journeyId} not found. Creating a new journey.`)
    const newJourneyId = startJourney(`auto-${stepName}`)
    recordJourneyStep(newJourneyId, stepName, metrics, metadata)
    return
  }

  const stepNumber = journey.steps.length + 1
  const timestamp = performance.now()
  const previousStep = journey.steps.length > 0 ? journey.steps[journey.steps.length - 1].stepName : undefined

  // Calculate duration from previous step or journey start
  const previousTimestamp =
    journey.steps.length > 0 ? journey.steps[journey.steps.length - 1].timestamp : journey.startTime

  const duration = timestamp - previousTimestamp

  const step: JourneyStep = {
    journeyId,
    journeyName: journey.name,
    stepName,
    stepNumber,
    timestamp,
    duration,
    metrics,
    userId: journey.userId,
    sessionId: journey.sessionId,
    previousStep,
    metadata,
  }

  journey.steps.push(step)

  // Report step metrics
  reportPerformanceMetric({
    name: `journey-${journey.name}-step-${stepName}`,
    value: duration,
    rating: getRatingForDuration(duration),
    path: window.location.pathname,
    timestamp: Date.now(),
    metadata: {
      journeyId,
      stepNumber,
      previousStep,
      sessionId: journey.sessionId,
      userId: journey.userId,
    },
  })

  // Report any additional metrics
  Object.entries(metrics).forEach(([metricName, value]) => {
    reportPerformanceMetric({
      name: `journey-${journey.name}-${metricName}`,
      value,
      rating: "good", // Custom metrics don't have standard ratings
      path: window.location.pathname,
      timestamp: Date.now(),
      metadata: {
        journeyId,
        stepName,
        stepNumber,
        sessionId: journey.sessionId,
        userId: journey.userId,
      },
    })
  })
}

// Complete a journey
export function completeJourney(journeyId: string, success = true, metadata: Record<string, any> = {}): void {
  const journey = activeJourneys[journeyId]

  if (!journey) {
    console.warn(`Cannot complete journey with ID ${journeyId}: not found`)
    return
  }

  journey.endTime = performance.now()
  journey.completed = true
  journey.metadata = { ...journey.metadata, ...metadata, success }

  const totalDuration = journey.endTime - journey.startTime

  // Report journey completion
  reportPerformanceMetric({
    name: `journey-${journey.name}-complete`,
    value: totalDuration,
    rating: getRatingForDuration(totalDuration, journey.name),
    path: window.location.pathname,
    timestamp: Date.now(),
    metadata: {
      journeyId,
      stepCount: journey.steps.length,
      success,
      sessionId: journey.sessionId,
      userId: journey.userId,
    },
  })

  // Store journey data in database
  storeJourneyData(journey)

  // Clean up
  delete activeJourneys[journeyId]
}

// Abandon a journey
export function abandonJourney(journeyId: string, reason = "unknown", metadata: Record<string, any> = {}): void {
  const journey = activeJourneys[journeyId]

  if (!journey) {
    console.warn(`Cannot abandon journey with ID ${journeyId}: not found`)
    return
  }

  journey.endTime = performance.now()
  journey.completed = false
  journey.metadata = { ...journey.metadata, ...metadata, abandonReason: reason }

  const totalDuration = journey.endTime - journey.startTime

  // Report journey abandonment
  reportPerformanceMetric({
    name: `journey-${journey.name}-abandon`,
    value: totalDuration,
    rating: "poor", // Abandoned journeys are considered poor performance
    path: window.location.pathname,
    timestamp: Date.now(),
    metadata: {
      journeyId,
      stepCount: journey.steps.length,
      lastStep: journey.steps.length > 0 ? journey.steps[journey.steps.length - 1].stepName : "none",
      reason,
      sessionId: journey.sessionId,
      userId: journey.userId,
    },
  })

  // Store journey data in database
  storeJourneyData(journey)

  // Clean up
  delete activeJourneys[journeyId]
}

// Get active journey by name
export function getActiveJourneyByName(journeyName: string): string | null {
  const journey = Object.values(activeJourneys).find((j) => j.name === journeyName)
  return journey ? journey.id : null
}

// Get user ID if available
function getUserId(): string | undefined {
  if (typeof window === "undefined") return undefined

  // Try to get from localStorage or other auth mechanism
  // This is a placeholder - implement based on your auth system
  try {
    // Check if we have a user ID in localStorage
    const userId = localStorage.getItem("userId")
    if (userId) return userId

    // Or try to get from your auth context/state
    // const user = getUser() // Your auth function
    // if (user?.id) return user.id
  } catch (e) {
    console.warn("Error getting user ID:", e)
  }

  return undefined
}

// Store journey data in database
async function storeJourneyData(journey: Journey): Promise<void> {
  try {
    const response = await fetch("/api/performance/journey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(journey),
      // Use keepalive to ensure the request completes even if the page is unloading
      keepalive: true,
    })

    if (!response.ok) {
      console.error("Failed to store journey data:", await response.text())
    }
  } catch (error) {
    console.error("Error storing journey data:", error)
  }
}

// Get rating based on duration
function getRatingForDuration(duration: number, journeyType = "default"): "good" | "needs-improvement" | "poor" {
  // Define thresholds based on journey type
  const thresholds: Record<string, [number, number]> = {
    login: [2000, 5000],
    registration: [5000, 10000],
    application: [10000, 30000],
    game: [3000, 8000],
    "profile-view": [2000, 5000],
    default: [3000, 8000],
  }

  const [goodThreshold, improvementThreshold] = thresholds[journeyType] || thresholds.default

  if (duration <= goodThreshold) return "good"
  if (duration <= improvementThreshold) return "needs-improvement"
  return "poor"
}

// Add metadata to journey
export function addJourneyMetadata(journeyId: string, metadata: Record<string, any>): void {
  const journey = activeJourneys[journeyId]

  if (!journey) {
    console.warn(`Cannot add metadata to journey with ID ${journeyId}: not found`)
    return
  }

  journey.metadata = { ...journey.metadata, ...metadata }
}

// Get all predefined journey types
export const JOURNEY_TYPES = {
  LOGIN: "login",
  REGISTRATION: "registration",
  APPLICATION: "application",
  BADGE_EARNING: "badge-earning",
  GAME_PLAYING: "game-playing",
  PROFILE_VIEW: "profile-view",
  TRIVIA: "trivia",
  LEADERBOARD: "leaderboard",
}
