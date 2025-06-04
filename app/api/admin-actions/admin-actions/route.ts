export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";

interface Recruiter {
  id: string;
  is_active: boolean;
  is_verified: boolean;
  verified_at: string | null;
  user_types: {
    user_type: string;
  };
  [key: string]: unknown;
}

// Static mock data for pending volunteer recruiters
const mockPendingRecruiters: Recruiter[] = [
  {
    id: "volunteer-1",
    is_active: false,
    is_verified: false,
    verified_at: null,
    user_types: {
      user_type: "volunteer",
    },
    email: "volunteer1@example.com",
    name: "John Smith",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "volunteer-2",
    is_active: false,
    is_verified: false,
    verified_at: null,
    user_types: {
      user_type: "volunteer",
    },
    email: "volunteer2@example.com",
    name: "Jane Doe",
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "volunteer-3",
    is_active: false,
    is_verified: false,
    verified_at: null,
    user_types: {
      user_type: "volunteer",
    },
    email: "volunteer3@example.com",
    name: "Bob Johnson",
    created_at: "2024-01-03T00:00:00Z",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockPendingRecruiters,
    source: "static",
  });
}

// Note: POST endpoint removed as it cannot be static
// Admin actions should be handled through a separate admin interface
// or serverless functions
