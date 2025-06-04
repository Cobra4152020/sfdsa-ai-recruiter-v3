import { NextResponse } from "next/server";
import {
  verifyDatabaseSchema,
  fixDatabaseSchemaIssues,
  fixTableIssues,
  type SchemaIssue,
} from "@/lib/schema-verification";

/**
 * Verifies the database schema
 */
export async function verifySchema() {
  try {
    const result = await verifyDatabaseSchema();
    return result;
  } catch (error) {
    console.error("Error in verifySchema action:", error);
    return {
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
    };
  }
}

/**
 * Fixes all database schema issues
 */
export async function fixAllIssues() {
  try {
    const verificationResult = await verifyDatabaseSchema();

    // Collect all issues
    const allIssues: SchemaIssue[] = [
      ...verificationResult.globalIssues,
      ...verificationResult.tables.flatMap((table) => table.issues),
    ];

    // Fix issues
    const result = await fixDatabaseSchemaIssues(allIssues);

    // Revalidate paths

    return result;
  } catch (error) {
    console.error("Error in fixAllIssues action:", error);
    return {
      success: false,
      fixed: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fixes issues for a specific table
 */
export async function fixTableIssuesAction(tableName: string) {
  try {
    const result = await fixTableIssues(tableName);

    // Revalidate paths

    return result;
  } catch (error) {
    console.error(
      `Error in fixTableIssues action for table ${tableName}:`,
      error,
    );
    return {
      success: false,
      fixed: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fixes specific issues by their indices
 */
export async function fixSpecificIssues(issueIndices: number[]) {
  try {
    const verificationResult = await verifyDatabaseSchema();

    // Collect all issues
    const allIssues: SchemaIssue[] = [
      ...verificationResult.globalIssues,
      ...verificationResult.tables.flatMap((table) => table.issues),
    ];

    // Filter issues by indices
    const issuesToFix = issueIndices
      .map((index) => allIssues[index])
      .filter(Boolean);

    // Fix issues
    const result = await fixDatabaseSchemaIssues(issuesToFix);

    // Revalidate paths

    return result;
  } catch (error) {
    console.error("Error in fixSpecificIssues action:", error);
    return {
      success: false,
      fixed: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Runs a custom SQL query to fix issues
 */
export async function runCustomFix(sql: string) {
  try {
    const { getServiceSupabase } = await import("@/app/lib/supabase/server");
    const supabase = getServiceSupabase();

    const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Revalidate paths

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in runCustomFix action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await verifySchema(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in databaseSchemaVerification:`, error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
