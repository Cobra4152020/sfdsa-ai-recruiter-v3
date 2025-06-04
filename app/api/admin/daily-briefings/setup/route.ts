import { NextResponse } from "next/server";
import { setupDailyBriefingsTable } from "@/lib/daily-briefing-setup-server";

export async function POST() {
  const result = await setupDailyBriefingsTable();
  return NextResponse.json(result);
}
