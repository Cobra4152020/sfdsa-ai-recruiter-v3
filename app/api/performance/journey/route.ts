export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"

// Static journey data
const mockJourneys = [
  {
    id: "journey-1",
    name: "Application Process",
    startTime: "2024-01-01T00:00:00Z",
    endTime: "2024-01-01T01:00:00Z",
    completed: true,
    userId: "user-1",
    sessionId: "session-1",
    stepCount: 5,
    totalDuration: 3600000,
    metadata: {
      browser: "Chrome",
      platform: "Desktop"
    },
    steps: [
      {
        journeyId: "journey-1",
        stepName: "Start Application",
        stepNumber: 1,
        timestamp: "2024-01-01T00:00:00Z",
        duration: 300000,
        previousStep: null,
        userId: "user-1",
        sessionId: "session-1",
        metrics: {
          timeOnPage: 300
        }
      },
      {
        journeyId: "journey-1",
        stepName: "Personal Info",
        stepNumber: 2,
        timestamp: "2024-01-01T00:05:00Z",
        duration: 600000,
        previousStep: "Start Application",
        userId: "user-1",
        sessionId: "session-1",
        metrics: {
          timeOnPage: 600
        }
      }
    ]
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    journeys: mockJourneys,
    source: 'static'
  })
}

// Note: POST endpoint removed as it cannot be static
// Journey tracking should be handled through client-side storage
// or a separate analytics service
