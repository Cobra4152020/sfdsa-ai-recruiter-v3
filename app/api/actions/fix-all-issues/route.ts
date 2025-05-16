import { NextResponse } from "next/server"
import { fixDatabaseSchemaIssues, verifyDatabaseSchema } from "@/lib/schema-verification"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function generateStaticParams() {
  // Add dummy params for testing
  return []
}

export async function POST() {
  try {
    // First, verify the schema to get the issues
    const verificationResult = await verifyDatabaseSchema()
    
    // Get all issues from tables and global issues
    const allIssues = [
      ...verificationResult.globalIssues,
      ...verificationResult.tables.flatMap(table => table.issues),
    ]

    // Fix all issues
    const result = await fixDatabaseSchemaIssues(allIssues)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fixing all issues:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      fixed: [],
    }, { status: 500 })
  }
} 