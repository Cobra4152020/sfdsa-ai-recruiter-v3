import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      receivedUserId: userId,
      message: userId ? "User ID received successfully" : "No user ID provided",
      instructions: "This endpoint shows what user ID the dashboard is sending"
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: "Debug user endpoint failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 