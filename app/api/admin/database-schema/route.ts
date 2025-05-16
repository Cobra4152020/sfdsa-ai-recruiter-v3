import { NextResponse } from "next/server"
import { fetchDatabaseSchema } from "@/lib/schema-visualization"

export async function GET() {
  try {
    const schema = await fetchDatabaseSchema()
    return NextResponse.json(schema)
  } catch (error) {
    console.error("Error in database schema endpoint:", error)
    return NextResponse.json(
      {
        tables: [],
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
} 