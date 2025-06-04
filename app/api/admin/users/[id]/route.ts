import { NextResponse } from "next/server";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "@/lib/user-management-service-server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUserById(params.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const data = await req.json();
  const result = await updateUser(params.id, data);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to update user" },
      { status: 400 },
    );
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const result = await deleteUser(params.id);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to delete user" },
      { status: 400 },
    );
  }
  return NextResponse.json({ success: true });
}
