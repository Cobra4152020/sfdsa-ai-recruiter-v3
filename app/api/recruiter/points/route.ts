export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";
import {
  getRecruiterPoints,
  awardRecruiterPoints,
  RecruiterActivityType,
} from "@/lib/recruiter-rewards-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recruiterId = searchParams.get("recruiterId");

    if (!recruiterId) {
      return NextResponse.json(
        { success: false, message: "Recruiter ID is required" },
        { status: 400 },
      );
    }

    const result = await getRecruiterPoints(recruiterId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in recruiter points GET:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { recruiterId, activityType, description, recruitId, metadata } =
      await request.json();

    if (!recruiterId || !activityType) {
      return NextResponse.json(
        {
          success: false,
          message: "Recruiter ID and activity type are required",
        },
        { status: 400 },
      );
    }

    // Verify this is a valid activity type
    if (!Object.values(RecruiterActivityType).includes(activityType)) {
      return NextResponse.json(
        { success: false, message: "Invalid activity type" },
        { status: 400 },
      );
    }

    const result = await awardRecruiterPoints(
      recruiterId,
      activityType as RecruiterActivityType,
      description || `Points awarded for ${activityType}`,
      recruitId,
      metadata,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in recruiter points POST:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
