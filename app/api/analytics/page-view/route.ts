import { NextResponse } from "next/server"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

// Mock analytics data
const mockAnalytics = {
  total_page_views: 15000,
  unique_visitors: 5000,
  average_time_on_site: "3m 45s",
  bounce_rate: "35%",
  top_pages: [
    { path: "/", views: 5000 },
    { path: "/trivia", views: 2500 },
    { path: "/leaderboard", views: 2000 },
    { path: "/nft-awards", views: 1500 },
    { path: "/about", views: 1000 }
  ],
  source: 'static'
};

export async function GET() {
  return NextResponse.json(mockAnalytics)
}

// Note: POST endpoint removed as it cannot be static
// Client-side analytics should be handled through a third-party service
// or by storing data in localStorage/IndexedDB
