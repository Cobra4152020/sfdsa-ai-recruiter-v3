import { NextResponse } from "next/server";
import { changeUserRole } from "@/lib/user-management-service-server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { newRole } = await req.json();
  if (!newRole) {
    return NextResponse.json(
      { error: "Missing newRole in request body" },
      { status: 400 },
    );
  }
  const result = await changeUserRole(params.id, newRole);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to change user role" },
      { status: 400 },
    );
  }
  return NextResponse.json({ success: true });
}
