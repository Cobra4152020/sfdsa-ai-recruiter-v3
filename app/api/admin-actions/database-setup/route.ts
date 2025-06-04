import { NextResponse } from "next/server";
import { createColumnCheckFunction } from "@/lib/database-setup";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function runDatabaseSetup() {
  try {
    // Create the column check function first
    await createColumnCheckFunction();

    // Run the database setup
    const result = await setupDatabase();

    return result;
  } catch (error) {
    console.error("Error in runDatabaseSetup:", error);
    return { success: false, error: String(error) };
  }
}

async function setupDatabase() {
  const successes: string[] = [];
  const errors: string[] = [];

  // Setup daily briefings tables
  console.log("Setting up daily briefings tables...");
  try {
    const dailyBriefingsSql = fs.readFileSync(
      path.join(
        process.cwd(),
        "migrations",
        "create_daily_briefings_tables.sql",
      ),
      "utf8",
    );

    const { error: dailyBriefingsError } = await supabase.rpc("exec_sql", {
      sql_query: dailyBriefingsSql,
    });

    if (dailyBriefingsError) {
      console.error(
        "Error setting up daily briefings tables:",
        dailyBriefingsError,
      );
      errors.push(`Daily briefings tables: ${dailyBriefingsError.message}`);
    } else {
      console.log("Daily briefings tables setup complete");
      successes.push("Daily briefings tables setup complete");
    }
  } catch (error) {
    console.error("Exception setting up daily briefings tables:", error);
    errors.push(
      `Daily briefings tables: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return { success: errors.length === 0, successes, errors };
}

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await databaseSetup(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in databaseSetup:`, error);
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
