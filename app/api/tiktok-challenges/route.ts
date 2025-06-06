import { NextResponse } from "next/server";
import { TikTokChallengeService } from "@/lib/tiktok-challenge-service";
import { verifyAdminAccess } from "@/lib/user-management-service-server";

export const dynamic = "force-dynamic";

// Enhanced challenges with better rewards and live integration
const ENHANCED_CHALLENGES = [
  {
    id: "1",
    title: "SFDA Recruit Life Challenge",
    description:
      "Show what motivated you to consider law enforcement! Share your story of wanting to serve and protect the SF community.",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    pointsReward: 150,
    badgeReward: "storyteller",
    active: true,
    hashtags: ["SFDARecruitLife", "ServiceMotivation", "CommunityFirst"],
    requirements: [
      "Share your personal motivation story",
      "Keep it professional and inspiring",
      "Use #SFDARecruitLife hashtag",
      "Show genuine passion for service"
    ],
    completed: false,
    thumbnailUrl: "/levis-stadium-49ers.png",
    instructions: "Create a 30-60 second TikTok explaining what motivated you to consider a career in law enforcement with the SF Sheriff's Department."
  },
  {
    id: "2", 
    title: "Community Hero Challenge",
    description:
      "Showcase how you've helped your community or how you plan to make a difference as a deputy sheriff.",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    pointsReward: 200,
    badgeReward: "community-champion",
    active: true,
    hashtags: ["CommunityHero", "SFDAService", "MakingADifference"],
    requirements: [
      "Show positive community interaction",
      "Highlight service mindset",
      "Use #CommunityHero hashtag",
      "Demonstrate leadership qualities"
    ],
    completed: false,
    thumbnailUrl: "/oracle-park-giants.png",
    instructions: "Share a story of how you've helped others or your vision for serving the SF community as a deputy."
  },
  {
    id: "3",
    title: "Academy Ready Challenge", 
    description:
      "Demonstrate your fitness level and preparation for the physical demands of sheriff's academy training.",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    pointsReward: 175,
    badgeReward: "fitness-focused",
    active: true,
    hashtags: ["AcademyReady", "SFDAFitness", "DeputyPrep"],
    requirements: [
      "Show workout routine or fitness activity",
      "Demonstrate proper form and safety",
      "Use #AcademyReady hashtag",
      "Focus on functional fitness"
    ],
    completed: false,
    thumbnailUrl: "/chase-center-gsw.png",
    instructions: "Show your fitness routine and explain how you're preparing physically for the academy."
  },
  {
    id: "4",
    title: "SF Pride Challenge",
    description:
      "Share what you love about San Francisco and why you want to protect and serve this amazing city.",
    startDate: "2024-01-01", 
    endDate: "2024-12-31",
    pointsReward: 125,
    badgeReward: "sf-ambassador",
    active: true,
    hashtags: ["SFPride", "CityLove", "SFDAService"],
    requirements: [
      "Feature San Francisco landmarks or culture",
      "Express genuine appreciation for the city", 
      "Use #SFPride hashtag",
      "Show local knowledge"
    ],
    completed: false,
    thumbnailUrl: "/golden-gate-bridge.png",
    instructions: "Create a video showcasing your love for San Francisco and why you want to serve this community."
  },
  {
    id: "5",
    title: "Future Deputy Challenge",
    description:
      "Share your vision of yourself as a deputy sheriff and how you'll make a positive impact in law enforcement.",
    startDate: "2024-01-01",
    endDate: "2024-12-31", 
    pointsReward: 180,
    badgeReward: "visionary-leader",
    active: true,
    hashtags: ["FutureDeputy", "LawEnforcementGoals", "SFDAVision"],
    requirements: [
      "Share your career vision and goals",
      "Demonstrate understanding of deputy role",
      "Use #FutureDeputy hashtag", 
      "Show commitment to professional growth"
    ],
    completed: false,
    thumbnailUrl: "/mission-district-sf.png",
    instructions: "Share your vision of yourself as a deputy sheriff and the positive impact you want to make."
  }
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    // Try to get challenges from database first
    if (userId) {
      try {
        const challenges = await TikTokChallengeService.getChallengesForUser(userId);
        if (challenges && challenges.length > 0) {
          return NextResponse.json({
            challenges: challenges.map(challenge => ({
              id: parseInt(challenge.id),
              title: challenge.title,
              description: challenge.description,
              startDate: new Date(challenge.startDate),
              endDate: new Date(challenge.endDate),
              pointsReward: challenge.pointsReward,
              badgeReward: challenge.badgeReward,
              thumbnailUrl: challenge.thumbnailUrl,
              hashtags: challenge.hashtags,
              status: challenge.status,
              completed: challenge.completed,
              submissionId: challenge.submissionId,
              submissionStatus: challenge.submissionStatus,
            })),
            source: "database",
          });
        }
      } catch (dbError) {
        console.error("Database fetch failed, using enhanced fallback:", dbError);
      }
    }

    // Enhanced fallback with live points integration
    const challengesWithStatus = ENHANCED_CHALLENGES.map(challenge => ({
      ...challenge,
      id: parseInt(challenge.id),
      startDate: new Date(challenge.startDate),
      endDate: new Date(challenge.endDate),
      // Check if user has completed this challenge (would need database query)
      completed: false,
      submissionStatus: null,
    }));

    return NextResponse.json({
      challenges: challengesWithStatus,
      source: "enhanced_static",
      note: "Connect database for full functionality"
    });

  } catch (error) {
    console.error("Error fetching TikTok challenges:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch TikTok challenges",
        source: "error",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adminId, challenge } = body;

    // Verify that the request is from an admin
    const isAdmin = await verifyAdminAccess(adminId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 },
      );
    }

    // Create new challenge
    const newChallenge =
      await TikTokChallengeService.createChallenge(challenge);

    if (!newChallenge) {
      return NextResponse.json(
        { error: "Failed to create challenge" },
        { status: 500 },
      );
    }

    return NextResponse.json({ challenge: newChallenge });
  } catch (error) {
    console.error("Error creating TikTok challenge:", error);
    return NextResponse.json(
      { error: "Failed to create TikTok challenge" },
      { status: 500 },
    );
  }
}
