import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { verifyAdminAccess } from "@/lib/user-management-service"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const { status } = await req.json()
    const supabase = createClient()

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid challenge ID" }, { status: 400 })
    }

    if (!status || !["active", "inactive"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Verify admin access (in a real app, you'd get the admin ID from the session)
    const isAdmin = await verifyAdminAccess("admin-id")
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    // Update challenge status
    const { data, error } = await supabase.from("tiktok_challenges").update({ status }).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({ challenge: data })
  } catch (error) {
    console.error("Error updating TikTok challenge status:", error)
    return NextResponse.json({ error: "Failed to update challenge status" }, { status: 500 })
  }
}
