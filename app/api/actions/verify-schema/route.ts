import { NextResponse } from "next/server";
import { verifyDatabaseSchema } from "@/lib/schema-verification";

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

export async function generateStaticParams() {
  // Add dummy params for testing
  return [];
}

export async function GET() {
  try {
    const result = await verifyDatabaseSchema();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in verifySchema action:", error);
    return NextResponse.json(
      {
        tables: [],
        globalIssues: [
          {
            type: "other" as const,
            description: `Server action error: ${error instanceof Error ? error.message : String(error)}`,
            severity: "high" as const,
          },
        ],
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
