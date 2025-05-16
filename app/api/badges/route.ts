export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"

// Use the badge types from your AchievementBadge component
type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "application-started"
  | "application-completed"
  | "first-response"
  | "frequent-user"
  | "resource-downloader"

interface Badge {
  id: string
  badge_type: BadgeType
  name: string
  description: string
  created_at: string
}

// Static badges data
const staticBadges: Badge[] = [
  {
    id: "written",
    badge_type: "written",
    name: "Written Test",
    description: "Completed written test preparation",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "oral",
    badge_type: "oral",
    name: "Oral Board",
    description: "Prepared for oral board interviews",
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "physical",
    badge_type: "physical",
    name: "Physical Test",
    description: "Completed physical test preparation",
    created_at: "2024-01-03T00:00:00Z",
  },
  {
    id: "polygraph",
    badge_type: "polygraph",
    name: "Polygraph",
    description: "Learned about the polygraph process",
    created_at: "2024-01-04T00:00:00Z",
  },
  {
    id: "psychological",
    badge_type: "psychological",
    name: "Psychological",
    description: "Prepared for psychological evaluation",
    created_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "full",
    badge_type: "full",
    name: "Full Process",
    description: "Completed all preparation areas",
    created_at: "2024-01-06T00:00:00Z",
  },
  {
    id: "chat-participation",
    badge_type: "chat-participation",
    name: "Chat Participation",
    description: "Engaged with Sgt. Ken",
    created_at: "2024-01-07T00:00:00Z",
  },
  {
    id: "first-response",
    badge_type: "first-response",
    name: "First Response",
    description: "Received first response from Sgt. Ken",
    created_at: "2024-01-08T00:00:00Z",
  },
  {
    id: "application-started",
    badge_type: "application-started",
    name: "Application Started",
    description: "Started the application process",
    created_at: "2024-01-09T00:00:00Z",
  },
  {
    id: "application-completed",
    badge_type: "application-completed",
    name: "Application Completed",
    description: "Completed the application process",
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "frequent-user",
    badge_type: "frequent-user",
    name: "Frequent User",
    description: "Regularly engages with the recruitment platform",
    created_at: "2024-01-11T00:00:00Z",
  },
  {
    id: "resource-downloader",
    badge_type: "resource-downloader",
    name: "Resource Downloader",
    description: "Downloaded recruitment resources and materials",
    created_at: "2024-01-12T00:00:00Z",
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    badges: staticBadges,
    source: 'static'
  })
}

// Note: POST endpoint removed as it cannot be static
// Badge creation should be handled through a different mechanism
// such as a serverless function or external service
