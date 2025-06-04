export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";
import { API_CACHE_HEADERS } from "@/lib/cache-utils";

export async function GET() {
  try {
    const requiredEnvVars = [
      "NEXT_PUBLIC_VERCEL_ENV",
      "NEXT_PUBLIC_VERCEL_URL",
      "NEXT_PUBLIC_ENABLE_LEADERBOARD",
      "NEXT_PUBLIC_ENABLE_BADGES",
      "NEXT_PUBLIC_ENABLE_POINTS",
      "SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ];

    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar],
    );

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required environment variables: ${missingEnvVars.join(", ")}`,
          environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "unknown",
          buildId: process.env.NEXT_PUBLIC_BUILD_ID || "unknown",
        },
        { status: 500, headers: API_CACHE_HEADERS },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "All required environment variables are present",
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "unknown",
        buildId: process.env.NEXT_PUBLIC_BUILD_ID || "unknown",
        features: {
          leaderboard: process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD === "true",
          badges: process.env.NEXT_PUBLIC_ENABLE_BADGES === "true",
          points: process.env.NEXT_PUBLIC_ENABLE_POINTS === "true",
          debug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true",
        },
      },
      { headers: API_CACHE_HEADERS },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Environment health check failed: ${error}` },
      { status: 500, headers: API_CACHE_HEADERS },
    );
  }
}
