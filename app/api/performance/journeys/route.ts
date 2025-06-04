import { NextResponse } from "next/server";

export const dynamic = "force-static";

interface JourneySummary {
  journey_name: string;
  total_users: number;
  completion_rate: number;
  average_time: number;
  last_updated: string;
}

interface JourneyStep {
  journey_name: string;
  step_name: string;
  step_order: number;
  completion_rate: number;
  average_time: number;
  dropoff_rate: number;
  last_updated: string;
}

// Mock journey data
const STATIC_JOURNEYS: JourneySummary[] = [
  {
    journey_name: "Written Test Preparation",
    total_users: 1000,
    completion_rate: 85,
    average_time: 14.5,
    last_updated: "2024-01-01T00:00:00Z",
  },
  {
    journey_name: "Oral Board Preparation",
    total_users: 800,
    completion_rate: 75,
    average_time: 21.3,
    last_updated: "2024-01-02T00:00:00Z",
  },
  {
    journey_name: "Physical Test Preparation",
    total_users: 600,
    completion_rate: 90,
    average_time: 30.0,
    last_updated: "2024-01-03T00:00:00Z",
  },
];

// Mock journey steps data
const STATIC_JOURNEY_STEPS: Record<string, JourneyStep[]> = {
  "Written Test Preparation": [
    {
      journey_name: "Written Test Preparation",
      step_name: "Study Guide Review",
      step_order: 1,
      completion_rate: 95,
      average_time: 2.5,
      dropoff_rate: 5,
      last_updated: "2024-01-01T00:00:00Z",
    },
    {
      journey_name: "Written Test Preparation",
      step_name: "Practice Questions",
      step_order: 2,
      completion_rate: 85,
      average_time: 5.0,
      dropoff_rate: 10,
      last_updated: "2024-01-01T00:00:00Z",
    },
    {
      journey_name: "Written Test Preparation",
      step_name: "Mock Test",
      step_order: 3,
      completion_rate: 75,
      average_time: 7.0,
      dropoff_rate: 15,
      last_updated: "2024-01-01T00:00:00Z",
    },
  ],
  "Oral Board Preparation": [
    {
      journey_name: "Oral Board Preparation",
      step_name: "Interview Tips",
      step_order: 1,
      completion_rate: 90,
      average_time: 3.0,
      dropoff_rate: 10,
      last_updated: "2024-01-02T00:00:00Z",
    },
    {
      journey_name: "Oral Board Preparation",
      step_name: "Practice Questions",
      step_order: 2,
      completion_rate: 80,
      average_time: 8.0,
      dropoff_rate: 15,
      last_updated: "2024-01-02T00:00:00Z",
    },
    {
      journey_name: "Oral Board Preparation",
      step_name: "Mock Interview",
      step_order: 3,
      completion_rate: 70,
      average_time: 10.3,
      dropoff_rate: 20,
      last_updated: "2024-01-02T00:00:00Z",
    },
  ],
  "Physical Test Preparation": [
    {
      journey_name: "Physical Test Preparation",
      step_name: "Requirements Review",
      step_order: 1,
      completion_rate: 95,
      average_time: 2.0,
      dropoff_rate: 5,
      last_updated: "2024-01-03T00:00:00Z",
    },
    {
      journey_name: "Physical Test Preparation",
      step_name: "Training Plan",
      step_order: 2,
      completion_rate: 90,
      average_time: 8.0,
      dropoff_rate: 10,
      last_updated: "2024-01-03T00:00:00Z",
    },
    {
      journey_name: "Physical Test Preparation",
      step_name: "Progress Tracking",
      step_order: 3,
      completion_rate: 85,
      average_time: 20.0,
      dropoff_rate: 15,
      last_updated: "2024-01-03T00:00:00Z",
    },
  ],
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const journeyName = url.searchParams.get("journey");

    if (journeyName) {
      // Return steps for specific journey
      const steps = STATIC_JOURNEY_STEPS[journeyName] || [];
      return NextResponse.json({
        success: true,
        steps,
        source: "static",
      });
    }

    // Return all journey summaries
    return NextResponse.json({
      success: true,
      journeys: STATIC_JOURNEYS,
      source: "static",
    });
  } catch (error) {
    console.error("Error fetching performance journeys:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
