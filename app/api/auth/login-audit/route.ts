import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Mock login audit data
const STATIC_AUDIT_LOGS = [
  {
    id: "1",
    user_id: "test-user",
    login_time: "2024-01-01T00:00:00Z",
    ip_address: "127.0.0.1",
    user_agent: "Mozilla/5.0",
    success: true,
  },
  {
    id: "2",
    user_id: "test-user",
    login_time: "2024-01-02T00:00:00Z",
    ip_address: "127.0.0.1",
    user_agent: "Mozilla/5.0",
    success: true,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      logs: STATIC_AUDIT_LOGS,
      source: "static",
    });
  } catch (error) {
    console.error("Error fetching login audit logs:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
