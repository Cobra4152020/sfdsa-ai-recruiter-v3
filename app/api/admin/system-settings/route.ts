import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Mock system settings
const STATIC_SETTINGS = {
  maintenance_mode: false,
  feature_flags: {
    trivia_enabled: true,
    tiktok_challenges_enabled: true,
    donations_enabled: true,
    badges_enabled: true,
  },
  version: "1.0.0",
  last_updated: "2024-01-01T00:00:00Z",
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      settings: STATIC_SETTINGS,
      source: "static",
    });
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Note: POST and DELETE operations are not supported in static exports
export async function POST() {
  return NextResponse.json(
    { error: "POST operations not supported in static mode" },
    { status: 405 },
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "DELETE operations not supported in static mode" },
    { status: 405 },
  );
}
