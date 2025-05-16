import { NextResponse } from "next/server"
import { TikTokChallengeService } from "@/lib/tiktok-challenge-service"
import { generateTikTokSubmissionStaticParams } from "@/lib/static-params"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

interface TikTokSubmission {
  id: number;
  user_id: string;
  username: string;
  challenge_id: number;
  video_url: string;
  thumbnail_url: string;
  description: string;
  likes: number;
  views: number;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewer_notes?: string;
}

// Generate all possible combinations at build time
export function generateStaticParams() {
  // Generate params for submissions 1-10
  return Array.from({ length: 10 }, (_, i) => ({ id: (i + 1).toString() }));
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const submissionId = Number.parseInt(params.id)
    
    if (isNaN(submissionId) || submissionId < 1 || submissionId > 10) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 })
    }

    // Generate deterministic mock data based on submission ID
    const submission = getMockSubmission(submissionId)

    return NextResponse.json({ 
      submission,
      source: 'static'
    })
  } catch (error) {
    console.error("Error in TikTok submission API:", error)
    return NextResponse.json({ 
      error: "Failed to fetch submission",
      source: 'error'
    }, { status: 500 })
  }
}

function getMockSubmission(id: number): TikTokSubmission {
  // Use ID as seed for deterministic data
  const seed = id * 7;
  const challengeId = ((id - 1) % 3) + 1; // Cycle through 3 challenges
  const status = ['pending', 'approved', 'rejected'][((id - 1) % 3)] as 'pending' | 'approved' | 'rejected';
  
  const usernames = [
    "tiktok_star", "dance_pro", "comedy_queen", "viral_creator", 
    "trend_setter", "music_lover", "challenge_king", "content_guru",
    "social_butterfly", "creative_mind"
  ];
  
  const descriptions = [
    "Check out my awesome dance moves! 🕺💃 #SFChallenge",
    "Having fun with this challenge! 😊 #DanceLife",
    "Trying something new today! 🌟 #TrendingNow",
    "This challenge is so much fun! 🎉 #ViralDance",
    "My take on the SF dance challenge! 💫 #DanceChallenge",
    "Dancing through the city! 🌉 #SanFrancisco",
    "Loving this new trend! ❤️ #TikTokDance",
    "City vibes and good times! 🌆 #SFLife",
    "Making memories in SF! 📸 #CityLife",
    "Dance like nobody's watching! 💃 #JustDance"
  ];

  return {
    id,
    user_id: `user-${id}`,
    username: usernames[id - 1],
    challenge_id: challengeId,
    video_url: `/mock-videos/submission-${id}.mp4`,
    thumbnail_url: `/mock-thumbnails/submission-${id}.jpg`,
    description: descriptions[id - 1],
    likes: 100 + (seed % 900), // 100-999 likes
    views: 1000 + (seed % 9000), // 1000-9999 views
    created_at: new Date(Date.now() - (id * 86400000)).toISOString(), // Staggered dates
    status,
    reviewer_notes: status === 'rejected' ? "Content does not meet community guidelines" : undefined
  };
} 