import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { userId = 'test-user', badgeType = 'first-response' } = await request.json();

    // Award a badge using the existing API
    const response = await fetch(new URL('/api/badges', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        badgeType,
        source: 'test_award',
      }),
    });

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: "Test badge awarded successfully",
      result,
      demonstration: {
        awarded_to: userId,
        badge_type: badgeType,
        instructions: "This demonstrates the live badge system. Real users would earn badges through actual activities.",
      }
    });

  } catch (error) {
    console.error('Error in test badge award:', error);
    return NextResponse.json({
      success: false,
      message: "Test badge award failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Badge test endpoint is ready",
    available_badges: [
      'first-response',
      'chat-participation',
      'application-started',
      'written',
      'oral',
      'physical',
      'polygraph',
      'psychological',
      'full',
      'frequent-user',
      'resource-downloader',
      'hard-charger'
    ],
    usage: {
      award_badge: "POST with { userId, badgeType }",
      example: {
        url: "/api/test-badge-award",
        method: "POST",
        body: {
          userId: "test-user",
          badgeType: "first-response"
        }
      }
    }
  });
} 