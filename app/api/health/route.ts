
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-core"

export async function GET() {
  const healthStatus = {
    api: { status: "ok", message: "API is operational" },
    database: { status: "unknown", message: "Database status not checked" },
    environment: { status: "unknown", message: "Environment variables not checked" },
  }

  // Check database connection
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("health_check").select("*").limit(1)

    if (error) throw error

    healthStatus.database = {
      status: "ok",
      message: "Database connection successful",
    }
  } catch (error) {
    console.error("Database health check error:", error)
    healthStatus.database = {
      status: "error",
      message: error instanceof Error ? error.message : "Database connection failed",
    }
  }

  // Check required environment variables
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
  ]

  const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingEnvVars.length > 0) {
    healthStatus.environment = {
      status: "error",
      message: `Missing environment variables: ${missingEnvVars.join(", ")}`,
    }
  } else {
    healthStatus.environment = {
      status: "ok",
      message: "All required environment variables are set",
    }
  }

  // Return overall health status
  const isHealthy = Object.values(healthStatus).every((status) => status.status === "ok")

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      checks: healthStatus,
    },
    { status: isHealthy ? 200 : 500 },
  )
}
