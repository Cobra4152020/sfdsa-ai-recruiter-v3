import { NextResponse } from "next/server";
import {
  getDonationPointRules,
  updateDonationPointRule,
} from "@/lib/donation-points-service-server";

export async function GET() {
  const result = await getDonationPointRules();
  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  // TODO: Add authentication/authorization check
  const { rule } = await request.json();
  if (!rule || !rule.id) {
    return NextResponse.json(
      { success: false, message: "Missing rule or rule ID" },
      { status: 400 },
    );
  }
  const result = await updateDonationPointRule(rule.id, rule);
  return NextResponse.json(result);
}
