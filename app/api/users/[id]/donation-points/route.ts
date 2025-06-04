import { NextResponse } from "next/server";

export const dynamic = "force-static";

interface DonationPoints {
  total_points: number;
  points_history: {
    id: string;
    points: number;
    reason: string;
    created_at: string;
  }[];
}

// Mock donation points data
const STATIC_DONATION_POINTS: Record<string, DonationPoints> = {
  "test-user": {
    total_points: 500,
    points_history: [
      {
        id: "1",
        points: 100,
        reason: "Completed written test preparation",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        points: 150,
        reason: "Completed oral board preparation",
        created_at: "2024-01-02T00:00:00Z",
      },
      {
        id: "3",
        points: 250,
        reason: "Completed physical test preparation",
        created_at: "2024-01-03T00:00:00Z",
      },
    ],
  },
};

// Generate static paths for common user IDs
export function generateStaticParams() {
  // Generate 20 user IDs for static generation
  return Array.from({ length: 20 }, (_, i) => ({
    id: `user${i + 1}`,
  }));
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    // Get mock data for the user, or create default data if not found
    const mockData = STATIC_DONATION_POINTS[userId] || {
      total_points: 0,
      points_history: [],
    };

    return NextResponse.json({
      success: true,
      data: mockData,
      source: "static",
    });
  } catch (error) {
    console.error("Error fetching user donation points:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
