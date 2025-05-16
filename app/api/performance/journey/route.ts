import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"
import type { Journey, JourneyStep } from "@/lib/journey-tracking"

export async function POST(request: Request) {
  try {
    // Only allow in production or when explicitly enabled
    if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== "true") {
      return NextResponse.json({ success: false, message: "Performance monitoring is disabled" }, { status: 400 })
    }

    // Parse the request body
    const journey: Journey = await request.json()

    // Validate the journey
    if (!journey || !journey.id || !journey.name) {
      return NextResponse.json({ success: false, message: "Invalid journey data" }, { status: 400 })
    }

    // Insert the journey into the database
    const { error: journeyError } = await supabase.from("performance_journeys").insert({
      journey_id: journey.id,
      journey_name: journey.name,
      start_time: new Date(journey.startTime).toISOString(),
      end_time: journey.endTime ? new Date(journey.endTime).toISOString() : null,
      completed: journey.completed,
      user_id: journey.userId || null,
      session_id: journey.sessionId,
      step_count: journey.steps.length,
      total_duration: journey.endTime ? journey.endTime - journey.startTime : null,
      metadata: journey.metadata || {},
    })

    if (journeyError) {
      console.error("Error storing journey:", journeyError)
      return NextResponse.json({ success: false, message: "Failed to store journey" }, { status: 500 })
    }

    // Insert the journey steps
    if (journey.steps.length > 0) {
      const stepsData = journey.steps.map((step: JourneyStep) => ({
        journey_id: step.journeyId,
        step_name: step.stepName,
        step_number: step.stepNumber,
        timestamp: new Date(step.timestamp).toISOString(),
        duration: step.duration || null,
        previous_step: step.previousStep || null,
        user_id: step.userId || null,
        session_id: step.sessionId,
        metrics: step.metrics || {},
        metadata: step.metadata || {},
      }))

      const { error: stepsError } = await supabase.from("performance_journey_steps").insert(stepsData)

      if (stepsError) {
        console.error("Error storing journey steps:", stepsError)
        // We don't fail the whole request if steps fail, just log it
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing journey data:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
