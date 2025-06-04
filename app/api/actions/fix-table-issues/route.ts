import { NextResponse } from "next/server";
import { fixTableIssues } from "@/lib/schema-verification";

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

export async function generateStaticParams() {
  // Add dummy params for testing
  return [];
}

export async function POST(request: Request) {
  try {
    const { tableName } = await request.json();

    if (!tableName) {
      return NextResponse.json(
        {
          success: false,
          error: "Table name is required",
          fixed: [],
        },
        { status: 400 },
      );
    }

    const result = await fixTableIssues(tableName);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fixing table issues:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        fixed: [],
      },
      { status: 500 },
    );
  }
}
