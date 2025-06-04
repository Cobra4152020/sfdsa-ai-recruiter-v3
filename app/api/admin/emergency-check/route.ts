export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { getServiceSupabase } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simple check of database connection
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("user_types")
      .select("*")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection error",
          error: error.message,
          details: error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      data: {
        timestamp: new Date().toISOString(),
        connectionStatus: "ok",
        sample: data,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
