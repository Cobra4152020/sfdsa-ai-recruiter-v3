import { NextRequest, NextResponse } from "next/server";
import { addParticipationPoints } from "@/lib/points-service";

export async function POST(req: NextRequest) {
  try {
    const { userId, points, activityType, description } = await req.json();
    if (!userId || !points || !activityType) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    const result = await addParticipationPoints(userId, points, activityType, description);
    if (result) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Failed to add points" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() || "Unknown error" }, { status: 500 });
  }
} 