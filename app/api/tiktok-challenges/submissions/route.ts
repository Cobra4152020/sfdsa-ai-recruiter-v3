import { NextResponse } from "next/server";
import { TikTokChallengeService } from "@/lib/tiktok-challenge-service";

export const dynamic = "force-static";

interface StaticParam {
  challengeId?: string;
  userId?: string;
}

// Generate static parameters for common combinations
export function generateStaticParams() {
  // Get all challenge IDs
  const challengeIds = [1, 2, 3, 4, 5]; // Add your actual challenge IDs

  // Get some sample user IDs
  const userIds = ["user1", "user2", "user3"]; // Add your sample user IDs

  const params: StaticParam[] = [];

  // Add challenge-based params
  challengeIds.forEach((id) => {
    params.push({ challengeId: id.toString() });
  });

  // Add user-based params
  userIds.forEach((id) => {
    params.push({ userId: id });
  });

  return params;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { challengeId, userId, videoUrl, tiktokUrl, metadata } = body;

    if (!challengeId || !userId || !videoUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Submit challenge
    const submission = await TikTokChallengeService.submitChallenge(
      challengeId,
      userId,
      videoUrl,
      tiktokUrl,
      metadata,
    );

    if (!submission) {
      return NextResponse.json(
        { error: "Failed to submit challenge" },
        { status: 500 },
      );
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Error submitting TikTok challenge:", error);
    return NextResponse.json(
      { error: "Failed to submit TikTok challenge" },
      { status: 500 },
    );
  }
}

// Mock submissions for static export
const STATIC_SUBMISSIONS = [
  {
    id: "1",
    challengeId: "1",
    userId: "test-user",
    videoUrl: "https://example.com/video1.mp4",
    tiktokUrl: "https://tiktok.com/@user/video1",
    status: "approved",
    createdAt: "2024-01-01T00:00:00Z",
    metadata: {
      views: 1000,
      likes: 100,
      shares: 50,
    },
  },
  {
    id: "2",
    challengeId: "2",
    userId: "test-user",
    videoUrl: "https://example.com/video2.mp4",
    tiktokUrl: "https://tiktok.com/@user/video2",
    status: "pending",
    createdAt: "2024-01-02T00:00:00Z",
    metadata: {
      views: 500,
      likes: 50,
      shares: 25,
    },
  },
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const challengeId = url.searchParams.get("challengeId");
    const userId = url.searchParams.get("userId");

    let submissions = [...STATIC_SUBMISSIONS];

    if (challengeId) {
      // Filter submissions for a challenge
      submissions = submissions.filter((s) => s.challengeId === challengeId);
    } else if (userId) {
      // Filter submissions for a user
      submissions = submissions.filter((s) => s.userId === userId);
    }

    return NextResponse.json({
      submissions,
      source: "static",
    });
  } catch (error) {
    console.error("Error fetching TikTok challenge submissions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch TikTok challenge submissions",
        source: "error",
      },
      { status: 500 },
    );
  }
}
