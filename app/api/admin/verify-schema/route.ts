import { NextResponse } from "next/server"
import { verifyDatabaseSchema } from "@/lib/schema-verification"

export async function GET() {
  try {
    const result = await verifyDatabaseSchema()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error verifying database schema:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
